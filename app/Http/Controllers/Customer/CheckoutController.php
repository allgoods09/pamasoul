<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Support\CartSummary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CheckoutController extends Controller
{
    public function index(Request $request)
    {
        $cart = $request->user()->cart()->first();
        $items = $cart?->items()->whereIn('id', session('selected_cart_items', []))->with('product')->get();
        if (! $items || $items->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Please select available items in your cart before checkout.');
        }
        foreach ($items as $item) {
            if (! $item->product->is_active || $item->quantity > $item->product->stock || $item->price_snapshot !== $item->product->price) {
                return redirect()->route('cart.index')->with('error', 'Inventory or pricing changed. Review your cart before checkout.');
            }
        }
        $summary = CartSummary::forCart($cart);
        $token = (string) Str::uuid();
        // Multiple tabs may each have an outstanding quote; the submitted token binds its reviewed total.
        $quotes = session('checkout_quotes', []);
        $quotes[$token] = ['total' => $summary['total'], 'item_ids' => $summary['selectedItems'], 'created_at' => time()];
        session()->put('checkout_quotes', array_slice($quotes, -10, null, true));

        return inertia('Customer/Checkout/Index', array_merge($summary, [
            'cartItems' => $items, 'shippingConfig' => CartSummary::shippingConfig(), 'checkoutToken' => $token,
        ]));
    }

    public function store(Request $request)
    {
        if (is_string($request->input('phone'))) {
            $request->merge(['phone' => preg_replace('/[\s()-]/', '', $request->phone)]);
        }
        $data = $request->validate([
            'recipient' => 'required|string|min:2|max:100',
            'phone' => ['required', 'regex:/^(?:09\d{9}|\+639\d{9})$/'],
            'street' => 'required|string|min:5|max:200', 'barangay' => 'required|string|max:100',
            'city' => 'required|string|max:100', 'province' => 'required|string|max:100',
            'postal_code' => ['required', 'regex:/^\d{4}$/'],
            'payment_method' => 'required|in:COD,BankTransfer', 'checkout_token' => 'required|uuid',
        ]);
        $user = $request->user();
        $existing = $user->orders()->where('checkout_token', $data['checkout_token'])->first();
        if ($existing) {
            return redirect()->route('order.confirmation', $existing);
        }
        $quote = session('checkout_quotes.'.$data['checkout_token']);
        if (! $quote || $quote['created_at'] < time() - 3600) {
            throw ValidationException::withMessages(['checkout_token' => 'This checkout has expired. Refresh to review your order again.']);
        }
        try {
            $order = DB::transaction(function () use ($user, $data, $quote) {
                $cart = $user->cart()->lockForUpdate()->first();
                $existing = $user->orders()->where('checkout_token', $data['checkout_token'])->first();
                if ($existing) {
                    return $existing;
                }
                $items = $cart?->items()->whereIn('id', $quote['item_ids'])->orderBy('product_id')->lockForUpdate()->get();
                if (! $items || $items->isEmpty() || $items->count() !== count($quote['item_ids'])) {
                    throw ValidationException::withMessages(['cart' => 'Your cart changed. Return to your cart and review your items.']);
                }
                $products = Product::whereIn('id', $items->pluck('product_id'))->orderBy('id')->lockForUpdate()->get()->keyBy('id');
                $subtotalCents = 0;
                foreach ($items as $item) {
                    $product = $products->get($item->product_id);
                    if (! $product || ! $product->is_active || $item->quantity > $product->stock || $item->quantity < 1 || $item->quantity > 99) {
                        throw ValidationException::withMessages(['cart' => 'Stock changed. Review the available quantities in your cart.']);
                    }
                    if ($item->price_snapshot !== $product->price) {
                        throw ValidationException::withMessages(['cart' => 'A product price changed. Return to your cart to review it.']);
                    }
                    $subtotalCents += (int) round($product->price * 100) * $item->quantity;
                }
                $subtotal = $subtotalCents / 100;
                $fee = CartSummary::shipping($subtotal);
                $total = round($subtotal + $fee, 2);
                if ($total > 99999999.99) {
                    throw ValidationException::withMessages(['cart' => 'This order exceeds the supported order value. Reduce the quantities or contact support.']);
                }
                if ((int) round($total * 100) !== (int) round($quote['total'] * 100)) {
                    throw ValidationException::withMessages(['cart' => 'Your order total changed. Refresh checkout to review the updated total.']);
                }
                $order = Order::create([
                    'user_id' => $user->id, 'status' => 'Pending', 'total' => $total, 'shipping_fee' => $fee,
                    'payment_method' => $data['payment_method'], 'checkout_token' => $data['checkout_token'],
                    'shipping_address' => implode("\n", [$data['recipient'], $data['phone'], $data['street'], $data['barangay'], $data['city'].', '.$data['province'].' '.$data['postal_code'], 'Philippines']),
                ]);
                foreach ($items as $item) {
                    $product = $products[$item->product_id];
                    $order->items()->create(['product_id' => $product->id, 'product_name' => $product->name, 'quantity' => $item->quantity, 'price_snapshot' => $product->price]);
                    $product->decrement('stock', $item->quantity);
                    $item->delete();
                }

                return $order;
            }, 3);
        } catch (ValidationException $exception) {
            throw $exception;
        } catch (\Throwable $exception) {
            report($exception);
            throw ValidationException::withMessages(['cart' => 'Your order could not be saved. Please try again. If it was already saved, retrying will return the same order.']);
        }
        session()->put('selected_cart_items', array_values(array_diff(session('selected_cart_items', []), $quote['item_ids'])));
        session()->forget('checkout_quotes.'.$data['checkout_token']);

        return redirect()->route('order.confirmation', $order);
    }
}
