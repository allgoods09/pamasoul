<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    /**
     * Order confirmation page
     */
    public function confirmation(Order $order)
    {
        // Ensure order belongs to logged-in user
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }
        
        $order->load('items.product');
        
        return inertia('Customer/Orders/Confirmation', [
            'order' => $order,
        ]);
    }
    
    /**
     * My orders listing
     */
    public function index()
    {
        $orders = Auth::user()
            ->orders()
            ->with('items.product')
            ->latest()
            ->paginate(10);
        
        return inertia('Customer/Orders/Index', [
            'orders' => $orders,
        ]);
    }
    
    /**
     * View single order details
     */
    public function show(Order $order)
    {
        // Ensure order belongs to logged-in user
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }
        
        $order->load('items.product');
        
        return inertia('Customer/Orders/Show', [
            'order' => $order,
        ]);
    }
}