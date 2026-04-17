<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderStatusNotification;
use App\Models\Setting;

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
            'shippingConfig' => $this->getShippingConfig(),
            'filters' => $request->only(['status', 'date_from', 'date_to', 'search']),
        ]);
    }

    public function updateShippingSettings(Request $request)
    {
        $validated = $request->validate([
            'free_threshold' => 'required|numeric|min:0',
            'base_fee' => 'required|numeric|min:0',
        ]);
        
        Setting::set('shipping.free_threshold', $validated['free_threshold'], 'shipping');
        Setting::set('shipping.base_fee', $validated['base_fee'], 'shipping');
        
        return redirect()->back()->with('success', 'Shipping settings updated successfully');
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
    public function invoice($id)
    {
        $order = Order::with(['user', 'items.product'])->findOrFail($id);
        
        // Return PDF view or HTML invoice
        return inertia('Admin/Orders/Invoice', [
            'order' => $order
        ]);
    }

    public function sendStatusEmail($id)
    {
        $order = Order::with(['user', 'items.product'])->findOrFail($id);
        
        if (!$order->user || !$order->user->email) {
            return back()->with('error', 'No email address found');
        }
        
        Mail::to($order->user->email)->send(new OrderStatusNotification($order));
        
        return back()->with('success', "Email sent successfully");
    }
}