<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Support\CartSummary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $cart = $request->user()->cart()->firstOrCreate(['user_id' => $request->user()->id]);
        $items = $cart->items()->with('product.category')->get();
        $pricesChanged = false;
        foreach ($items as $item) {
            if ($item->price_snapshot !== $item->product->price) {
                $item->update(['price_snapshot' => $item->product->price]);
                $pricesChanged = true;
            }
        }
        if (! session()->has('selected_cart_items')) {
            session()->put('selected_cart_items', $items->filter(fn ($item) => $item->product->is_active && $item->quantity <= $item->product->stock)->pluck('id')->all());
        }

        return inertia('Customer/Cart/Index', array_merge(CartSummary::forCart($cart), [
            'cartItems' => $items, 'shippingConfig' => CartSummary::shippingConfig(), 'pricesChanged' => $pricesChanged,
        ]));
    }

    public function updateSelection(Request $request)
    {
        $data = $request->validate(['selected_items' => 'present|array', 'selected_items.*' => 'integer|distinct']);
        $cart = $request->user()->cart()->firstOrFail();
        $allowed = $cart->items()->with('product')->get()->filter(fn ($item) => $item->product->is_active && $item->quantity <= $item->product->stock)->pluck('id');
        if (collect($data['selected_items'])->diff($allowed)->isNotEmpty()) {
            throw ValidationException::withMessages(['selected_items' => 'Choose available items from your own cart.']);
        }
        session()->put('selected_cart_items', $data['selected_items']);
        session()->forget('checkout_quotes');

        return response()->json(CartSummary::forCart($cart));
    }

    public function add(Request $request)
    {
        $data = $request->validate(['product_id' => 'required|integer|exists:products,id', 'quantity' => 'required|integer|min:1|max:99']);
        $cart = $request->user()->cart()->firstOrCreate(['user_id' => $request->user()->id]);
        $item = DB::transaction(function () use ($cart, $data) {
            $cart->newQuery()->whereKey($cart->id)->lockForUpdate()->first();
            $product = Product::lockForUpdate()->findOrFail($data['product_id']);
            $item = $cart->items()->where('product_id', $product->id)->first();
            $quantity = ($item?->quantity ?? 0) + $data['quantity'];
            if (! $product->is_active || $quantity > $product->stock || $quantity > 99) {
                throw ValidationException::withMessages(['quantity' => 'That quantity is unavailable. Check the stock and the quantity already in your cart.']);
            }

            return $cart->items()->updateOrCreate(['product_id' => $product->id], ['quantity' => $quantity, 'price_snapshot' => $product->price]);
        }, 3);
        session()->put('selected_cart_items', array_values(array_unique([...session('selected_cart_items', []), $item->id])));
        session()->forget('checkout_quotes');

        return back()->with('success', 'Product added to your cart.');
    }

    public function update(Request $request, $cartItem)
    {
        $data = $request->validate(['quantity' => 'required|integer|min:1|max:99']);
        $cart = $request->user()->cart()->firstOrFail();
        DB::transaction(function () use ($cart, $cartItem, $data) {
            $cart->newQuery()->whereKey($cart->id)->lockForUpdate()->first();
            $item = $cart->items()->findOrFail($cartItem);
            $product = Product::lockForUpdate()->findOrFail($item->product_id);
            if (! $product->is_active || $data['quantity'] > $product->stock) {
                throw ValidationException::withMessages(['quantity' => 'Not enough stock available.']);
            }
            $item->update(['quantity' => $data['quantity'], 'price_snapshot' => $product->price]);
        }, 3);
        session()->forget('checkout_quotes');

        return response()->json(array_merge(CartSummary::forCart($cart), ['cartItems' => $cart->items()->with('product.category')->get()]));
    }

    public function remove(Request $request, $cartItem)
    {
        $cart = $request->user()->cart()->firstOrFail();
        DB::transaction(function () use ($cart, $cartItem) {
            $cart->newQuery()->whereKey($cart->id)->lockForUpdate()->first();
            $cart->items()->findOrFail($cartItem)->delete();
        });
        session()->put('selected_cart_items', array_values(array_filter(session('selected_cart_items', []), fn ($id) => $id != $cartItem)));
        session()->forget('checkout_quotes');

        return back()->with('success', 'Item removed from your cart.');
    }
}
