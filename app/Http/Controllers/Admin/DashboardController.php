<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Support\SalesSeries;
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
            ->where('is_active', true)
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
            ->toBase()->get();

        // Top Selling Products
        $topProducts = Product::withSum(['orderItems as order_items_count' => fn ($q) => $q->whereHas('order', fn ($o) => $o->where('status', 'Completed'))], 'quantity')
            ->with('category')
            ->whereHas('orderItems.order', fn ($q) => $q->where('status', 'Completed'))
            ->orderBy('order_items_count', 'desc')
            ->limit(5)
            ->get();

        // Monthly Sales (last 6 months)
        $monthlySales = SalesSeries::monthly(now()->subMonths(5)->startOfMonth(), now());

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
