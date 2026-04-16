<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    // List all products with filters and pagination
    public function index(Request $request)
    {
        $query = Product::with('category');
        
        // Search filter
        if ($request->filled('search')) {
            $query->search($request->search);
        }
        
        // Category filter
        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }
        
        // Stock status filter
        if ($request->filled('stock_status')) {
            if ($request->stock_status === 'in_stock') {
                $query->inStock();
            } elseif ($request->stock_status === 'low_stock') {
                $query->lowStock();
            } elseif ($request->stock_status === 'out_of_stock') {
                $query->outOfStock();
            }
        }
        
        // Price range filter
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }
        
        // Sorting
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);
        
        $products = $query->paginate(15)->withQueryString();
        $categories = Category::all();
        
        return inertia('Admin/Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'stock_status', 'min_price', 'max_price', 'sort', 'direction']),
        ]);
    }
    
    // Show form to create new product
    public function create()
    {
        $categories = Category::all();
        
        return inertia('Admin/Products/Create', [
            'categories' => $categories,
        ]);
    }
    
    // Store new product
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150|unique:products',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0|max:999999.99',
            'stock' => 'required|integer|min:0|max:999999',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|string|max:500', // Image URL validation
        ]);
        
        $product = Product::create($validated);
        
        return redirect()->route('admin.products.index')
            ->with('success', 'Product created successfully!');
    }
    
    // Show form to edit product
    public function edit(Product $product)
    {
        $categories = Category::all();
        
        return inertia('Admin/Products/Edit', [
            'product' => $product,
            'categories' => $categories,
        ]);
    }
    
    // Update product
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150', Rule::unique('products')->ignore($product->id)],
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0|max:999999.99',
            'stock' => 'required|integer|min:0|max:999999',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|string|max:500', // Image URL validation
        ]);
        
        $product->update($validated);
        
        return redirect()->route('admin.products.index')
            ->with('success', 'Product updated successfully!');
    }
    
    // Delete product
    public function destroy(Product $product)
    {
        $product->delete();
        
        return redirect()->route('admin.products.index')
            ->with('success', 'Product deleted successfully!');
    }
    
    // Toggle availability (set stock to 0)
    public function toggleAvailability(Product $product)
    {
        $product->update(['stock' => 0]);
        
        return redirect()->back()
            ->with('success', 'Product marked as unavailable.');
    }
    
    // Bulk delete products
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:products,id',
        ]);
        
        Product::whereIn('id', $request->ids)->delete();
        
        return redirect()->back()
            ->with('success', count($request->ids) . ' products deleted successfully!');
    }
    
    // Bulk update stock
    public function bulkUpdateStock(Request $request)
    {
        $request->validate([
            'products' => 'required|array',
            'products.*.id' => 'exists:products,id',
            'products.*.stock' => 'required|integer|min:0',
        ]);
        
        foreach ($request->products as $productData) {
            Product::where('id', $productData['id'])->update(['stock' => $productData['stock']]);
        }
        
        return redirect()->back()
            ->with('success', 'Stock updated successfully!');
    }
    
    // Export products (CSV)
    public function export()
    {
        $products = Product::with('category')->get();
        
        $csv = \League\Csv\Writer::createFromString('');
        $csv->insertOne(['ID', 'Name', 'Description', 'Price', 'Stock', 'Category', 'Image URL', 'Created At']);
        
        foreach ($products as $product) {
            $csv->insertOne([
                $product->id,
                $product->name,
                $product->description,
                $product->price,
                $product->stock,
                $product->category->name,
                $product->image,
                $product->created_at,
            ]);
        }
        
        return response($csv->toString(), 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="products.csv"',
        ]);
    }
}