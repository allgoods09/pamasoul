<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    /**
     * Display cart page
     */
    public function index()
    {
        $user = Auth::user();
        $cart = $user->cart()->firstOrCreate(['user_id' => $user->id]);
        $cart->load('items.product');
        
        $cartItems = $cart->items;
        
        $selectedItems = session()->get('selected_cart_items', []);
        
        if (empty($selectedItems) && $cartItems->isNotEmpty()) {
            $selectedItems = $cartItems->pluck('id')->toArray();
            session()->put('selected_cart_items', $selectedItems);
        }
        
        $subtotal = $cartItems->sum(function ($item) use ($selectedItems) {
            if (in_array($item->id, $selectedItems)) {
                return $item->quantity * $item->price_snapshot;
            }
            return 0;
        });
        
        $shippingFee = $this->calculateShipping($subtotal);
        $total = $subtotal + $shippingFee;
        
        return inertia('Customer/Cart/Index', [
            'cartItems' => $cartItems,
            'selectedItems' => $selectedItems,
            'subtotal' => $subtotal,
            'shippingFee' => $shippingFee,
            'total' => $total,
            'shippingConfig' => $this->getShippingConfig(), // Add this
        ]);
    }
    
    /**
     * Update cart item selection
     */
    public function updateSelection(Request $request)
    {
        $selectedItems = $request->input('selected_items', []);
        session()->put('selected_cart_items', $selectedItems);
        
        $user = Auth::user();
        $cart = $user->cart()->first();
        
        if (!$cart) {
            return response()->json([
                'subtotal' => 0,
                'shippingFee' => 0,
                'total' => 0,
                'selected_count' => 0,
            ]);
        }
        
        $cartItems = $cart->items;
        
        $subtotal = $cartItems->sum(function ($item) use ($selectedItems) {
            if (in_array($item->id, $selectedItems)) {
                return $item->quantity * $item->price_snapshot;
            }
            return 0;
        });
        
        // Use dynamic shipping calculation
        $shippingFee = $this->calculateShipping($subtotal);
        $total = $subtotal + $shippingFee;
        
        return response()->json([
            'subtotal' => $subtotal,
            'shippingFee' => $shippingFee,
            'total' => $total,
            'selected_count' => count($selectedItems),
        ]);
    }
    
    /**
     * Add product to cart
     */
    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1|max:99',
        ]);
        
        $user = Auth::user();
        $cart = $user->cart()->firstOrCreate(['user_id' => $user->id]);
        $product = Product::findOrFail($request->product_id);
        
        if ($product->stock < $request->quantity) {
            return redirect()->back()->with('error', 'Not enough stock available.');
        }
        
        $cartItem = $cart->items()->where('product_id', $product->id)->first();
        
        if ($cartItem) {
            $newQuantity = $cartItem->quantity + $request->quantity;
            if ($product->stock < $newQuantity) {
                return redirect()->back()->with('error', 'Not enough stock available.');
            }
            $cartItem->update(['quantity' => $newQuantity]);
        } else {
            $cartItem = $cart->items()->create([
                'product_id' => $product->id,
                'quantity' => $request->quantity,
                'price_snapshot' => $product->price,
            ]);
        }
        
        // Auto-select newly added item
        $selectedItems = session()->get('selected_cart_items', []);
        if (!in_array($cartItem->id, $selectedItems)) {
            $selectedItems[] = $cartItem->id;
            session()->put('selected_cart_items', $selectedItems);
        }
        
        return redirect()->back()->with('success', 'Product added to cart!');
    }
    
    /**
     * Update cart item quantity
     */
    public function update(Request $request, $cartItemId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1|max:99',
        ]);
        
        $user = Auth::user();
        $cart = $user->cart()->firstOrFail();
        $cartItem = $cart->items()->findOrFail($cartItemId);
        
        $product = Product::findOrFail($cartItem->product_id);
        
        if ($product->stock < $request->quantity) {
            return response()->json(['error' => 'Not enough stock available.'], 422);
        }
        
        $cartItem->update(['quantity' => $request->quantity]);
    
        $selectedItems = session()->get('selected_cart_items', []);
        $cartItems = $cart->items;
        
        $subtotal = $cartItems->sum(function ($item) use ($selectedItems) {
            if (in_array($item->id, $selectedItems)) {
                return $item->quantity * $item->price_snapshot;
            }
            return 0;
        });
        
        // Use dynamic shipping calculation
        $shippingFee = $this->calculateShipping($subtotal);
        $total = $subtotal + $shippingFee;
        
        return response()->json([
            'success' => true,
            'item_total' => $cartItem->quantity * $cartItem->price_snapshot,
            'subtotal' => $subtotal,
            'shippingFee' => $shippingFee,
            'total' => $total,
        ]);
    }
    
    /**
     * Remove item from cart
     */
    public function remove($cartItemId)
    {
        $user = Auth::user();
        $cart = $user->cart()->firstOrFail();
        $cartItem = $cart->items()->findOrFail($cartItemId);
        $cartItem->delete();
        
        // Remove from selected items
        $selectedItems = session()->get('selected_cart_items', []);
        $selectedItems = array_values(array_filter($selectedItems, function($id) use ($cartItemId) {
            return $id != $cartItemId;
        }));
        session()->put('selected_cart_items', $selectedItems);
        
        return redirect()->back()->with('success', 'Item removed from cart.');
    }
}