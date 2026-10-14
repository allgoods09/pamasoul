<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Support\UserManagement;
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
            $query->where(function ($q) use ($request) {
                $q->where('name', 'LIKE', "%{$request->search}%")
                    ->orWhere('email', 'LIKE', "%{$request->search}%");
            });
        }

        $users = $query->withCount('orders')->latest()->paginate(15)->withQueryString();

        // Calculate total_spent for each user
        $users->getCollection()->transform(function ($user) {
            $user->total_spent = $user->orders()
                ->where('status', 'Completed')
                ->sum('total');

            return $user;
        });

        return inertia('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['role', 'search']),
            'userStats' => ['customers' => User::where('role', 'customer')->count(), 'admins' => User::where('role', 'admin')->count(), 'orders' => Order::count()],
        ]);
    }

    public function show(User $user)
    {
        $orders = $user->orders()->withCount('items')->latest()->get();

        // Calculate total_spent for the user
        $user->total_spent = $user->orders()
            ->where('status', 'Completed')
            ->sum('total');

        return inertia('Admin/Users/Show', [
            'user' => $user->load('orders'),
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

    public function updateRole(Request $request, User $user)
    {
        $data = $request->validate(['role' => 'required|in:customer,admin']);
        UserManagement::apply([$user->id], $data['role']);

        return back()->with('success', 'User role updated.');
    }

    public function destroy(User $user)
    {
        UserManagement::apply([$user->id]);

        return back()->with('success', 'User deleted.');
    }

    public function bulkUpdateRole(Request $request)
    {
        $data = $request->validate(['ids' => 'required|array|min:1|max:100', 'ids.*' => 'required|integer|distinct|exists:users,id', 'role' => 'required|in:customer,admin']);
        UserManagement::apply($data['ids'], $data['role']);

        return back()->with('success', count($data['ids']).' user roles updated.');
    }

    public function bulkDelete(Request $request)
    {
        $data = $request->validate(['ids' => 'required|array|min:1|max:100', 'ids.*' => 'required|integer|distinct|exists:users,id']);
        UserManagement::apply($data['ids']);

        return back()->with('success', count($data['ids']).' users deleted.');
    }
}
