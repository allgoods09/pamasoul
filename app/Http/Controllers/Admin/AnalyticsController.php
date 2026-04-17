<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        // Date range filtering
        $dateFrom = $request->get('date_from', now()->subDays(30)->toDateString());
        $dateTo = $request->get('date_to', now()->toDateString());
        
        // Sales Overview
        $totalSales = Order::where('status', 'Completed')
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->sum('total');
        
        $totalOrders = Order::whereBetween('created_at', [$dateFrom, $dateTo])->count();
        
        $averageOrderValue = $totalOrders > 0 ? $totalSales / $totalOrders : 0;
        
        // Daily Sales Chart Data
        $dailySales = Order::where('status', 'Completed')
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(total) as total'), DB::raw('COUNT(*) as orders'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();
        
        // Category Sales Distribution
        $categorySales = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'Completed')
            ->whereBetween('orders.created_at', [$dateFrom, $dateTo])
            ->select('categories.name', DB::raw('SUM(order_items.quantity * order_items.price_snapshot) as total'))
            ->groupBy('categories.id', 'categories.name')
            ->get();
        
        // Top Selling Products
        $topProducts = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'Completed')
            ->whereBetween('orders.created_at', [$dateFrom, $dateTo])
            ->select('products.name', DB::raw('SUM(order_items.quantity) as total_sold'), DB::raw('SUM(order_items.quantity * order_items.price_snapshot) as revenue'))
            ->groupBy('products.id', 'products.name')
            ->orderBy('total_sold', 'desc')
            ->limit(10)
            ->get();
        
        // Monthly Trends (last 12 months)
        $monthlyTrends = Order::where('status', 'Completed')
            ->where('created_at', '>=', now()->subMonths(12))
            ->select(DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'), DB::raw('SUM(total) as total'), DB::raw('COUNT(*) as orders'))
            ->groupBy('month')
            ->orderBy('month')
            ->get();
        
        // Customer Statistics
        $totalCustomers = User::where('role', 'customer')->count();
        $newCustomers = User::where('role', 'customer')
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->count();
        
        $repeatCustomers = DB::table('orders')
            ->where('status', 'Completed')
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->select('user_id', DB::raw('COUNT(*) as order_count'))
            ->groupBy('user_id')
            ->having('order_count', '>', 1)
            ->count();
        
        // Stock Status
        $lowStockProducts = Product::where('stock', '<=', 5)->where('stock', '>', 0)->count();
        $outOfStockProducts = Product::where('stock', '<=', 0)->count();
        $totalProducts = Product::count();
        
        // Payment Method Distribution
        $paymentDistribution = Order::whereBetween('created_at', [$dateFrom, $dateTo])
            ->select('payment_method', DB::raw('COUNT(*) as count'))
            ->groupBy('payment_method')
            ->get();
        
        // Order Status Distribution
        $orderStatusDistribution = Order::whereBetween('created_at', [$dateFrom, $dateTo])
            ->select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->get();
        
        return inertia('Admin/Analytics/Index', [
            'stats' => [
                'totalSales' => $totalSales,
                'totalOrders' => $totalOrders,
                'averageOrderValue' => $averageOrderValue,
                'totalCustomers' => $totalCustomers,
                'newCustomers' => $newCustomers,
                'repeatCustomers' => $repeatCustomers,
                'lowStockProducts' => $lowStockProducts,
                'outOfStockProducts' => $outOfStockProducts,
                'totalProducts' => $totalProducts,
            ],
            'dailySales' => $dailySales,
            'categorySales' => $categorySales,
            'topProducts' => $topProducts,
            'monthlyTrends' => $monthlyTrends,
            'paymentDistribution' => $paymentDistribution,
            'orderStatusDistribution' => $orderStatusDistribution,
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
        ]);
    }
    
    public function exportPdf(Request $request)
    {
        $dateFrom = $request->get('date_from', now()->subDays(30)->toDateString());
        $dateTo = $request->get('date_to', now()->toDateString());
        
        // Sales Overview
        $totalSales = Order::where('status', 'Completed')
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->sum('total');
        
        $totalOrders = Order::whereBetween('created_at', [$dateFrom, $dateTo])->count();
        
        $averageOrderValue = $totalOrders > 0 ? $totalSales / $totalOrders : 0;
        
        // Top Products
        $topProducts = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'Completed')
            ->whereBetween('orders.created_at', [$dateFrom, $dateTo])
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
            ->whereBetween('orders.created_at', [$dateFrom, $dateTo])
            ->select('categories.name', DB::raw('SUM(order_items.quantity * order_items.price_snapshot) as total'))
            ->groupBy('categories.id', 'categories.name')
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
        
        $dailySales = Order::where('status', 'Completed')
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(total) as total'), DB::raw('COUNT(*) as orders'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();
        
        $csvFileName = "analytics-export-{$dateFrom}-to-{$dateTo}.csv";
        $handle = fopen('php://temp', 'w+');
        
        // Add UTF-8 BOM for Excel compatibility
        fwrite($handle, "\xEF\xBB\xBF");
        
        // Add headers
        fputcsv($handle, ['Date', 'Total Sales (₱)', 'Number of Orders']);
        
        // Add data
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