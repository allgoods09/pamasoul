<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {   

        $firstOrderDate = Order::orderBy('created_at', 'asc')->first();
        $defaultStartDate = $firstOrderDate ? $firstOrderDate->created_at->toDateString() : now()->subDays(30)->toDateString();

        // Date range filtering - default to last 30 days
        $dateFrom = $request->get('date_from', $defaultStartDate);
        $dateTo = $request->get('date_to', now()->toDateString());
        
        // IMPORTANT: Add end of day to dateTo for inclusive range
        $endDate = $dateTo . ' 23:59:59';
        
        // ========== SALES OVERVIEW ==========
        $totalSales = Order::where('status', 'Completed')
            ->whereBetween('created_at', [$dateFrom, $endDate])
            ->sum('total');
        
        $totalOrders = Order::whereBetween('created_at', [$dateFrom, $endDate])->count();
        
        $pendingOrders = Order::where('status', 'Pending')
            ->whereBetween('created_at', [$dateFrom, $endDate])
            ->count();
        
        $shippedOrders = Order::where('status', 'Shipped')
            ->whereBetween('created_at', [$dateFrom, $endDate])
            ->count();
        
        $completedOrders = Order::where('status', 'Completed')
            ->whereBetween('created_at', [$dateFrom, $endDate])
            ->count();
        
        $averageOrderValue = $totalOrders > 0 ? $totalSales / $totalOrders : 0;
        
        // ========== DAILY SALES CHART ==========
        $dailySales = Order::where('status', 'Completed')
            ->whereBetween('created_at', [$dateFrom, $endDate])
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(total) as total'), DB::raw('COUNT(*) as orders'))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'total' => floatval($item->total),
                    'orders' => intval($item->orders),
                ];
            });
        
        // ========== CATEGORY SALES ==========
        $categorySales = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'Completed')
            ->whereBetween('orders.created_at', [$dateFrom, $endDate])
            ->select('categories.name', DB::raw('SUM(order_items.quantity * order_items.price_snapshot) as total'))
            ->groupBy('categories.id', 'categories.name')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->name,
                    'total' => floatval($item->total),
                ];
            });
        
        // ========== TOP SELLING PRODUCTS ==========
        $topProducts = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'Completed')
            ->whereBetween('orders.created_at', [$dateFrom, $endDate])
            ->select(
                'products.id',
                'products.name',
                DB::raw('SUM(order_items.quantity) as total_sold'),
                DB::raw('SUM(order_items.quantity * order_items.price_snapshot) as revenue')
            )
            ->groupBy('products.id', 'products.name')
            ->orderBy('total_sold', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'total_sold' => intval($item->total_sold),
                    'revenue' => floatval($item->revenue),
                ];
            });
        
        // ========== MONTHLY TRENDS ==========
        $monthlyTrends = Order::where('status', 'Completed')
            ->where('created_at', '>=', now()->subMonths(12)->startOfMonth())
            ->select(
                DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month_key'),
                DB::raw('DATE_FORMAT(created_at, "%b %Y") as month'),
                DB::raw('SUM(total) as total'),
                DB::raw('COUNT(*) as orders')
            )
            ->groupBy('month_key', 'month')
            ->orderBy('month_key')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => $item->month,
                    'total' => floatval($item->total),
                    'orders' => intval($item->orders),
                ];
            });
        
        // ========== CUSTOMER STATISTICS ==========
        $totalCustomers = User::where('role', 'customer')->count();
        
        $newCustomers = User::where('role', 'customer')
            ->whereBetween('created_at', [$dateFrom, $endDate])
            ->count();
        
        // Repeat customers (customers with 2+ completed orders)
        $repeatCustomers = DB::table('orders')
            ->where('status', 'Completed')  // Only count completed orders
            ->whereBetween('created_at', [$dateFrom, $endDate])
            ->select('user_id', DB::raw('COUNT(*) as order_count'))
            ->groupBy('user_id')
            ->having('order_count', '>', 1)
            ->count();
        
        $oneTimeCustomers = DB::table('orders')
            ->where('status', 'Completed')
            ->whereBetween('created_at', [$dateFrom, $endDate])
            ->select('user_id', DB::raw('COUNT(*) as order_count'))
            ->groupBy('user_id')
            ->having('order_count', '=', 1)
            ->count();
        
        // ========== STOCK STATUS ==========
        $lowStockProducts = Product::where('stock', '<=', 5)->where('stock', '>', 0)->count();
        $outOfStockProducts = Product::where('stock', '<=', 0)->count();
        $totalProducts = Product::count();
        $healthyStock = $totalProducts - ($lowStockProducts + $outOfStockProducts);
        
        // Low stock products list
        $lowStockList = Product::where('stock', '<=', 5)
            ->where('stock', '>', 0)
            ->orderBy('stock', 'asc')
            ->limit(5)
            ->get(['id', 'name', 'stock']);
        
        // ========== PAYMENT METHOD DISTRIBUTION ==========
        $paymentDistribution = Order::whereBetween('created_at', [$dateFrom, $endDate])
            ->select('payment_method', DB::raw('COUNT(*) as count'))
            ->groupBy('payment_method')
            ->get()
            ->map(function ($item) {
                return [
                    'payment_method' => $item->payment_method,
                    'count' => intval($item->count),
                ];
            });
        
        // ========== ORDER STATUS DISTRIBUTION ==========
        $orderStatusDistribution = Order::whereBetween('created_at', [$dateFrom, $endDate])
            ->select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->get()
            ->map(function ($item) {
                return [
                    'status' => $item->status,
                    'count' => intval($item->count),
                ];
            });
        
        // ========== REVENUE BY PAYMENT METHOD ==========
        $revenueByPaymentMethod = Order::where('status', 'Completed')
            ->whereBetween('created_at', [$dateFrom, $endDate])
            ->select('payment_method', DB::raw('SUM(total) as total'))
            ->groupBy('payment_method')
            ->get()
            ->map(function ($item) {
                return [
                    'payment_method' => $item->payment_method === 'COD' ? 'Cash on Delivery' : 'Bank Transfer',
                    'total' => floatval($item->total),
                ];
            });
        
        // ========== AVG ORDER VALUE BY MONTH ==========
        $avgOrderValueByMonth = Order::where('status', 'Completed')
        ->where('created_at', '>=', now()->subMonths(6)->startOfMonth())
        ->select(
            DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month_key'),
            DB::raw('DATE_FORMAT(created_at, "%b %Y") as month'),
            DB::raw('AVG(total) as avg_value'),
            DB::raw('COUNT(*) as order_count')
        )
        ->groupBy('month_key', 'month')
        ->orderBy('month_key', 'asc')
        ->get()
        ->map(function ($item) {
            return [
                'month' => $item->month,
                'avg_value' => floatval($item->avg_value),
                'order_count' => intval($item->order_count),
            ];
        });
        
        // ========== TOP CUSTOMERS ==========
        $topCustomers = DB::table('orders')
            ->join('users', 'orders.user_id', '=', 'users.id')
            ->where('orders.status', 'Completed')
            ->whereBetween('orders.created_at', [$dateFrom, $endDate])
            ->select(
                'users.id',
                'users.name',
                'users.email',
                DB::raw('SUM(orders.total) as total_spent'),
                DB::raw('COUNT(orders.id) as order_count')
            )
            ->groupBy('users.id', 'users.name', 'users.email')
            ->orderBy('total_spent', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'email' => $item->email,
                    'total_spent' => floatval($item->total_spent),
                    'order_count' => intval($item->order_count),
                ];
            });
        
        return inertia('Admin/Analytics/Index', [
            'stats' => [
                'totalSales' => $totalSales,
                'totalOrders' => $totalOrders,
                'pendingOrders' => $pendingOrders,
                'shippedOrders' => $shippedOrders,
                'completedOrders' => $completedOrders,
                'averageOrderValue' => $averageOrderValue,
                'totalCustomers' => $totalCustomers,
                'newCustomers' => $newCustomers,
                'repeatCustomers' => $repeatCustomers,
                'oneTimeCustomers' => $oneTimeCustomers,
                'lowStockProducts' => $lowStockProducts,
                'outOfStockProducts' => $outOfStockProducts,
                'healthyStock' => $healthyStock,
                'totalProducts' => $totalProducts,
                'lowStockList' => $lowStockList,
            ],
            'dailySales' => $dailySales,
            'categorySales' => $categorySales,
            'topProducts' => $topProducts,
            'monthlyTrends' => $monthlyTrends,
            'paymentDistribution' => $paymentDistribution,
            'orderStatusDistribution' => $orderStatusDistribution,
            'revenueByPaymentMethod' => $revenueByPaymentMethod,
            'avgOrderValueByMonth' => $avgOrderValueByMonth,
            'topCustomers' => $topCustomers,
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
            'fullRange' => [
                'from' => $firstOrderDate,  // Your oldest order date
                'to' => now()->toDateString(),
            ],
        ]);
    }
    
    public function exportPdf(Request $request)
    {
        $dateFrom = $request->get('date_from', now()->subDays(30)->toDateString());
        $dateTo = $request->get('date_to', now()->toDateString());
        $endDate = $dateTo . ' 23:59:59';
        
        // Sales Overview
        $totalSales = Order::where('status', 'Completed')
            ->whereBetween('created_at', [$dateFrom, $endDate])
            ->sum('total');
        
        $totalOrders = Order::whereBetween('created_at', [$dateFrom, $endDate])->count();
        
        $averageOrderValue = $totalOrders > 0 ? $totalSales / $totalOrders : 0;
        
        // Total Customers
        $totalCustomers = User::where('role', 'customer')->count();
        
        // Total Items Sold
        $totalItemsSold = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'Completed')
            ->whereBetween('orders.created_at', [$dateFrom, $endDate])
            ->sum('order_items.quantity');
        
        // Top Products
        $topProducts = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'Completed')
            ->whereBetween('orders.created_at', [$dateFrom, $endDate])
            ->select('products.name', DB::raw('SUM(order_items.quantity) as total_sold'), DB::raw('SUM(order_items.quantity * order_items.price_snapshot) as revenue'))
            ->groupBy('products.id', 'products.name')
            ->orderBy('total_sold', 'desc')
            ->limit(10)
            ->get();
        
        // Category Sales
        $categorySales = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'Completed')
            ->whereBetween('orders.created_at', [$dateFrom, $endDate])
            ->select('categories.name', DB::raw('SUM(order_items.quantity * order_items.price_snapshot) as total'))
            ->groupBy('categories.id', 'categories.name')
            ->orderBy('total', 'desc')
            ->get();
        
        $data = [
            'generated_at' => now()->format('Y-m-d H:i:s'),
            'date_range' => [
                'from' => $dateFrom,
                'to' => $dateTo,
            ],
            'total_sales' => $totalSales,
            'total_orders' => $totalOrders,
            'average_order_value' => $averageOrderValue,
            'total_customers' => $totalCustomers,
            'total_items_sold' => $totalItemsSold,
            'top_products' => $topProducts,
            'category_sales' => $categorySales,
        ];
        
        $pdf = Pdf::loadView('pdf.analytics-report', $data);
        $pdf->setPaper('A4', 'portrait');
        $pdf->getDomPDF()->set_option('isPhpEnabled', true);
        
        return $pdf->download("analytics-report-{$dateFrom}-to-{$dateTo}.pdf");
    }
    
    public function exportCsv(Request $request)
    {
        $dateFrom = $request->get('date_from', now()->subDays(30)->toDateString());
        $dateTo = $request->get('date_to', now()->toDateString());
        $endDate = $dateTo . ' 23:59:59';
        
        $dailySales = Order::where('status', 'Completed')
            ->whereBetween('created_at', [$dateFrom, $endDate])
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(total) as total'), DB::raw('COUNT(*) as orders'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();
        
        $csvFileName = "analytics-export-{$dateFrom}-to-{$dateTo}.csv";
        $handle = fopen('php://temp', 'w+');
        
        fwrite($handle, "\xEF\xBB\xBF");
        fputcsv($handle, ['Date', 'Total Sales (₱)', 'Number of Orders']);
        
        foreach ($dailySales as $sale) {
            fputcsv($handle, [$sale->date, number_format($sale->total, 2), $sale->orders]);
        }
        
        rewind($handle);
        $csvContent = stream_get_contents($handle);
        fclose($handle);
        
        return response($csvContent, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$csvFileName}\"",
        ]);
    }
}