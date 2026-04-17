<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    // List orders
    public function index(Request $request)
    {
        $query = Order::with('user');
        
        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        
        // Date range filter
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }
        
        // Search by order ID or customer name
        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('id', $request->search)
                  ->orWhereHas('user', function($user) use ($request) {
                      $user->where('name', 'LIKE', "%{$request->search}%");
                  });
            });
        }
        
        $orders = $query->withCount('items')->latest()->paginate(15)->withQueryString();
        
        $statusCounts = [
            'Pending' => Order::where('status', 'Pending')->count(),
            'Paid' => Order::where('status', 'Paid')->count(),
            'Shipped' => Order::where('status', 'Shipped')->count(),
            'Completed' => Order::where('status', 'Completed')->count(),
        ];
        
        return inertia('Admin/Orders/Index', [
            'orders' => $orders,
            'statusCounts' => $statusCounts,
            'filters' => $request->only(['status', 'date_from', 'date_to', 'search']),
        ]);
    }
    
    // View single order
    public function show(Order $order)
    {
        $order->load('user', 'items.product');
        
        return inertia('Admin/Orders/Show', [
            'order' => $order,
            'shippingConfig' => $this->getShippingConfig(),
        ]);
    }
    
    // Update order status
    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:Pending,Paid,Shipped,Completed',
        ]);
        
        $oldStatus = $order->status;
        $order->updateStatus($validated['status']);
        
        return redirect()->back()
            ->with('success', "Order status changed from {$oldStatus} to {$order->status}");
    }
    
    // Bulk update status
    public function bulkUpdateStatus(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:orders,id',
            'status' => 'required|in:Pending,Paid,Shipped,Completed',
        ]);
        
        $count = Order::whereIn('id', $request->ids)->update(['status' => $request->status]);
        
        return redirect()->back()
            ->with('success', "{$count} orders updated to {$request->status}");
    }
    
    // Generate invoice (PDF - future)
    public function invoice(Order $order)
    {
        // Will implement PDF generation later
        return inertia('Admin/Orders/Invoice', [
            'order' => $order->load('user', 'items.product'),
        ]);
    }
}