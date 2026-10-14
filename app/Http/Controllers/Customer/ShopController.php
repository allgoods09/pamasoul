<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ShopController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'search' => 'nullable|string|max:150', 'category' => 'nullable|string|max:100',
            'sort' => 'nullable|in:latest,price_low,price_high,name_asc,name_desc',
            'min_price' => 'nullable|numeric|min:0|max:999999.99',
            'max_price' => 'nullable|numeric|min:0|max:999999.99',
        ]);
        if ($request->filled('min_price') && $request->filled('max_price') && $request->min_price > $request->max_price) {
            throw ValidationException::withMessages(['max_price' => 'Maximum price must be at least the minimum price.']);
        }
        $query = Product::with('category')->where('is_active', true)->whereHas('category', fn ($q) => $q->catalog());

        // Search - now searches product name, description, AND category name
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('category', function ($catQuery) use ($search) {
                        $catQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Category filter - UPDATED to use slug
        if ($request->filled('category')) {
            $category = Category::catalog()->where('slug', $request->category)->first();
            $query->where('category_id', $category?->id ?? 0);
        }

        // Price range
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Sort
        $sort = $request->get('sort', 'latest');
        switch ($sort) {
            case 'price_low':
                $query->orderBy('price', 'asc');
                break;
            case 'price_high':
                $query->orderBy('price', 'desc');
                break;
            case 'name_asc':
                $query->orderBy('name', 'asc');
                break;
            case 'name_desc':
                $query->orderBy('name', 'desc');
                break;
            case 'latest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        $products = $query->orderBy('id', 'desc')->paginate(12)->withQueryString();
        $categories = Category::catalog()->get();

        return inertia('Customer/Shop/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'sort', 'min_price', 'max_price']),
        ]);
    }

    public function landing()
    {
        $featuredProducts = Product::with('category')
            ->where('is_active', true)->where('stock', '>', 0)
            ->whereHas('category', fn ($q) => $q->catalog())
            ->latest()
            ->limit(8)
            ->get();

        $categories = Category::catalog()->withCount(['products' => fn ($q) => $q->where('is_active', true)])->get();

        return inertia('Customer/Landing', [
            'featuredProducts' => $featuredProducts,
            'categories' => $categories,
        ]);
    }

    public function show(Product $product)
    {
        $product->load('category');

        $relatedProducts = Product::with('category')->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('is_active', true)->where('stock', '>', 0)
            ->limit(4)
            ->get();

        return inertia('Customer/Shop/Show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }
}
