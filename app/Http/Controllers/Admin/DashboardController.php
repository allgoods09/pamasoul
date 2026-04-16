<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // Total Sales (from completed orders)
        $totalSales = Order::where('status', 'Completed')->sum('total');
        
        // Total Orders
        $totalOrders = Order::count();
        
        // Total Customers (users with role 'customer')
        $totalCustomers = User::where('role', 'customer')->count();
        
        // Low Stock Products (stock <= 5)
        $lowStockProducts = Product::where('stock', '<=', 5)
            ->where('stock', '>', 0)
            ->with('category')
            ->get();
        
        $lowStockCount = $lowStockProducts->count();
        
        // Recent Orders
        $recentOrders = Order::with('user')
            ->latest()
            ->limit(10)
            ->get();
        
        // Orders by status (for chart)
        $ordersByStatus = Order::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get();
        
        // Top Selling Products
        $topProducts = Product::withCount('orderItems')
            ->with('category')
            ->orderBy('order_items_count', 'desc')
            ->limit(5)
            ->get();
        
        // Monthly Sales (last 6 months)
        $monthlySales = Order::where('status', 'Completed')
            ->where('created_at', '>=', now()->subMonths(6))
            ->select(DB::raw('MONTH(created_at) as month'), DB::raw('SUM(total) as total'))
            ->groupBy('month')
            ->orderBy('month')
            ->get();
        
        return inertia('Admin/Dashboard', [
            'stats' => [
                'totalSales' => $totalSales,
                'totalOrders' => $totalOrders,
                'totalCustomers' => $totalCustomers,
                'lowStockCount' => $lowStockCount,
            ],
            'lowStockProducts' => $lowStockProducts,
            'recentOrders' => $recentOrders,
            'ordersByStatus' => $ordersByStatus,
            'topProducts' => $topProducts,
            'monthlySales' => $monthlySales,
        ]);
    }
}