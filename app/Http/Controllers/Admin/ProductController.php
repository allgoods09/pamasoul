<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Support\CsvDownload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'search' => 'nullable|string|max:150', 'sort' => 'nullable|in:name,price,stock,created_at',
            'direction' => 'nullable|in:asc,desc', 'max_stock' => 'nullable|integer|min:0|max:999999', 'category' => 'nullable|integer|exists:categories,id',
            'stock_status' => 'nullable|in:in_stock,low_stock,out_of_stock,archived',
            'min_price' => 'nullable|numeric|min:0|max:999999.99', 'max_price' => 'nullable|numeric|min:0|max:999999.99',
        ]);
        $query = Product::with('category');
        if ($request->filled('search')) {
            $query->search($request->search);
        }
        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }
        if ($request->filled('stock_status')) {
            if ($request->stock_status === 'archived') {
                $query->where('is_active', false);
            } else {
                $query->where('is_active', true);
                match ($request->stock_status) {
                    'in_stock' => $query->inStock(), 'low_stock' => $query->lowStock(), 'out_of_stock' => $query->outOfStock(),
                };
            }
        }
        if ($request->filled('max_stock')) {
            $query->where('is_active', true)->where('stock', '<=', $request->max_stock);
        }
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }
        $query->orderBy($request->input('sort') ?: 'created_at', $request->input('direction') ?: 'desc')->orderBy('id', 'desc');

        return inertia('Admin/Products/Index', [
            'products' => $query->paginate(15)->withQueryString(), 'categories' => Category::catalog()->get(),
            'inventoryStats' => ['total' => Product::count(), 'inStock' => Product::where('is_active', true)->where('stock', '>', 5)->count(), 'lowStock' => Product::where('is_active', true)->whereBetween('stock', [1, 5])->count(), 'outOfStock' => Product::where('is_active', true)->where('stock', 0)->count()],
            'filters' => $request->only(['search', 'category', 'stock_status', 'min_price', 'max_price', 'max_stock', 'sort', 'direction']),
        ]);
    }

    private function validated(Request $request, ?Product $product = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:150', Rule::unique('products')->ignore($product?->id)],
            'description' => 'nullable|string|max:10000', 'price' => 'required|numeric|min:0.01|max:999999.99|decimal:0,2',
            'stock' => 'required|integer|min:0|max:999999',
            'category_id' => ['required', Rule::exists('categories', 'id')->whereIn('slug', Category::CATALOG_SLUGS)],
            'image' => ['nullable', 'string', 'max:255', function ($attribute, $value, $fail) {
                if (! preg_match('~^https?://~i', $value) && ! str_starts_with($value, '/images/')) {
                    $fail('Use an HTTP(S) image URL or a local /images/ path.');
                }
            }],
            'is_active' => 'sometimes|boolean', 'specifications' => ['nullable', 'array', 'max:20', function ($attribute, $value, $fail) {
                foreach (array_keys($value) as $key) {
                    if (strlen((string) $key) > 80 || ! trim((string) $key)) {
                        $fail('Specification labels must be 1–80 characters.');
                    }
                }
            }], 'specifications.*' => 'required|string|max:200',
        ]);
    }

    public function create()
    {
        return inertia('Admin/Products/Create', ['categories' => Category::catalog()->get()]);
    }

    public function store(Request $request)
    {
        Product::create($this->validated($request));

        return redirect()->route('admin.products.index')->with('success', 'Product created successfully.');
    }

    public function edit(Product $product)
    {
        return inertia('Admin/Products/Edit', ['product' => $product, 'categories' => Category::catalog()->get()]);
    }

    public function update(Request $request, Product $product)
    {
        $data = $this->validated($request, $product);
        DB::transaction(function () use ($product, $data) {
            $locked = Product::whereKey($product->id)->lockForUpdate()->firstOrFail();
            $locked->orderItems()->whereNull('product_name')->update(['product_name' => $locked->name]);
            $locked->update($data);
        });

        return redirect()->route('admin.products.index')->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        DB::transaction(fn () => Product::whereKey($product->id)->lockForUpdate()->firstOrFail()->update(['is_active' => false]));

        return redirect()->route('admin.products.index')->with('success', 'Product archived. Inventory and order history are preserved.');
    }

    public function toggleAvailability(Product $product)
    {
        $active = DB::transaction(function () use ($product) {
            $locked = Product::whereKey($product->id)->lockForUpdate()->firstOrFail();
            $locked->update(['is_active' => ! $locked->is_active]);

            return $locked->is_active;
        });

        return back()->with('success', $active ? 'Product restored to the store.' : 'Product archived. Stock is preserved.');
    }

    public function bulkDelete(Request $request)
    {
        $data = $request->validate(['ids' => 'required|array|min:1|max:100', 'ids.*' => 'required|integer|distinct|exists:products,id']);
        DB::transaction(function () use ($data) {
            foreach (Product::whereIn('id', $data['ids'])->orderBy('id')->lockForUpdate()->get() as $product) {
                $product->update(['is_active' => false]);
            }
        });

        return back()->with('success', count($data['ids']).' products archived.');
    }

    public function bulkUpdateStock(Request $request)
    {
        $data = $request->validate(['products' => 'required|array|min:1|max:100', 'products.*.id' => 'required|integer|distinct|exists:products,id', 'products.*.stock' => 'required|integer|min:0|max:999999']);
        DB::transaction(function () use ($data) {
            foreach (collect($data['products'])->sortBy('id') as $row) {
                Product::whereKey($row['id'])->lockForUpdate()->firstOrFail()->update(['stock' => $row['stock']]);
            }
        });

        return back()->with('success', 'Inventory updated successfully.');
    }

    public function export()
    {
        $rows = Product::with('category')->orderBy('id')->lazy()->map(fn ($p) => [$p->id, $p->name, $p->description, $p->price, $p->stock, $p->category->name, $p->is_active ? 'Active' : 'Archived', $p->image, (string) $p->created_at]);

        return CsvDownload::make('products.csv', ['ID', 'Name', 'Description', 'Price (PHP)', 'Stock', 'Category', 'Availability', 'Image', 'Created at'], $rows);
    }
}
