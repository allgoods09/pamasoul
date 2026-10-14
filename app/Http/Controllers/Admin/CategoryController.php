<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class CategoryController extends Controller
{
    // List categories
    public function index(Request $request)
    {
        $query = Category::withCount('products');

        if ($request->filled('search')) {
            $query->search($request->search);
        }

        $categories = $query->paginate(10)->withQueryString();

        return inertia('Admin/Categories/Index', [
            'categories' => $categories,
            'filters' => $request->only(['search']),
        ]);
    }

    // The store has three fixed collections; preserve their slugs and product links.
    public function store(Request $request)
    {
        $data = $request->validate(['name' => 'required|in:Fishing Rods,Reels,Fishing Lines|unique:categories,name']);
        Category::create($data);

        return back()->with('success', 'Collection restored.');
    }

    public function update(Request $request, Category $category)
    {
        throw ValidationException::withMessages(['name' => 'Rods, Reels and Lines are fixed collections.']);
    }

    public function destroy(Category $category)
    {
        throw ValidationException::withMessages(['category' => 'Collections cannot be deleted. Archive individual products instead.']);
    }
}
