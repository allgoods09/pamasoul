<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // List users
    public function index(Request $request)
    {
        $query = User::query();
        
        // Role filter
        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }
        
        // Search
        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'LIKE', "%{$request->search}%")
                  ->orWhere('email', 'LIKE', "%{$request->search}%");
            });
        }
        
        $users = $query->latest()->paginate(15)->withQueryString();
        
        return inertia('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['role', 'search']),
        ]);
    }

    public function show(User $user)
    {
        $orders = $user->orders()->latest()->get();
        
        return inertia('Admin/Users/Show', [
            'user' => $user,
            'orders' => $orders,
        ]);
    }
    
    // Create user (admin)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:150|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:customer,admin',
        ]);
        
        $validated['password'] = Hash::make($validated['password']);
        
        User::create($validated);
        
        return redirect()->route('admin.users.index')
            ->with('success', 'User created successfully!');
    }
    
    // Update user role
    public function updateRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => 'required|in:customer,admin',
        ]);
        
        $user->update(['role' => $validated['role']]);
        
        return redirect()->back()
            ->with('success', "User role updated to {$user->role}");
    }
    
    // Delete user
    public function destroy(User $user)
    {
        // Prevent deleting last admin
        if ($user->role === 'admin' && User::where('role', 'admin')->count() <= 1) {
            return redirect()->back()
                ->with('error', 'Cannot delete the only admin user.');
        }
        
        $user->delete();
        
        return redirect()->route('admin.users.index')
            ->with('success', 'User deleted successfully!');
    }
    
    // Impersonate user (for debugging)
    public function impersonate(User $user)
    {
        auth()->user()->impersonate($user);
        
        return redirect()->route('customer.dashboard')
            ->with('success', "You are now viewing as {$user->name}");
    }
}