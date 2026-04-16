<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $cart = $user->cart()->first();
        
        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }
        
        $selectedItemIds = session()->get('selected_cart_items', []);
        
        if (empty($selectedItemIds)) {
            return redirect()->route('cart.index')->with('error', 'Please select items to checkout.');
        }
        
        $cart->load(['items' => function($query) use ($selectedItemIds) {
            $query->whereIn('id', $selectedItemIds)->with('product');
        }]);
        
        $cartItems = $cart->items;
        
        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'No selected items found.');
        }
        
        $subtotal = $cartItems->sum(function ($item) {
            return $item->quantity * $item->price_snapshot;
        });
        
        // Use the dynamic shipping calculation from parent controller
        $shippingFee = $this->calculateShipping($subtotal);
        $total = $subtotal + $shippingFee;
        
        return inertia('Customer/Checkout/Index', [
            'cartItems' => $cartItems,
            'subtotal' => $subtotal,
            'shippingFee' => $shippingFee,
            'total' => $total,
            'shippingConfig' => $this->getShippingConfig(),
        ]);
    }
    
    public function store(Request $request)
    {
        $request->validate([
            'shipping_address' => 'required|string|max:500',
            'payment_method' => 'required|in:COD,BankTransfer',
        ]);
        
        $user = Auth::user();
        $cart = $user->cart()->first();
        
        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }
        
        $selectedItemIds = session()->get('selected_cart_items', []);
        
        if (empty($selectedItemIds)) {
            return redirect()->route('cart.index')->with('error', 'Please select items to checkout.');
        }
        
        $selectedItems = $cart->items()->whereIn('id', $selectedItemIds)->with('product')->get();
        
        if ($selectedItems->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'No selected items found.');
        }
        
        // Check stock
        foreach ($selectedItems as $item) {
            if ($item->product->stock < $item->quantity) {
                return redirect()->back()->with('error', "Not enough stock for {$item->product->name}.");
            }
        }
        
        $subtotal = $selectedItems->sum(function ($item) {
            return $item->quantity * $item->price_snapshot;
        });
        
        // Use the dynamic shipping calculation from parent controller
        $shippingFee = $this->calculateShipping($subtotal);
        $total = $subtotal + $shippingFee;
        
        DB::beginTransaction();
        
        try {
            // Create order
            $order = Order::create([
                'user_id' => $user->id,
                'status' => 'Pending',
                'total' => $total,
                'payment_method' => $request->payment_method,
                'shipping_address' => $request->shipping_address,
            ]);
            
            // Create order items and deduct stock
            foreach ($selectedItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price_snapshot' => $item->price_snapshot,
                ]);
                
                // Deduct stock
                $item->product->decrement('stock', $item->quantity);
                
                // Remove only selected items from cart
                $item->delete();
            }
            
            DB::commit();
            
            // Clear selection session
            session()->forget('selected_cart_items');
            
            return redirect()->route('order.confirmation', $order);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Something went wrong. Please try again.');
        }
    }
}