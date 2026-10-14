<?php

namespace App\Support;

use App\Models\Cart;
use App\Models\Setting;

class CartSummary
{
    public static function shippingConfig(): array
    {
        $settings = Setting::whereIn('key', ['shipping.free_threshold', 'shipping.base_fee'])->pluck('value', 'key');

        return ['free_threshold' => (float) ($settings['shipping.free_threshold'] ?? config('shipping.free_threshold', 5000)),
            'base_fee' => (float) ($settings['shipping.base_fee'] ?? config('shipping.base_fee', 50))];
    }

    public static function shipping(float $subtotal): float
    {
        $config = self::shippingConfig();

        // A zero threshold disables the free-shipping promotion.
        return $subtotal <= 0 || ($config['free_threshold'] > 0 && $subtotal >= $config['free_threshold']) ? 0 : $config['base_fee'];
    }

    public static function forCart(Cart $cart): array
    {
        $items = $cart->items()->with('product')->get();
        $selected = $items->filter(fn ($item) => $item->product->is_active && $item->quantity <= $item->product->stock)
            ->pluck('id')->intersect(session('selected_cart_items', []))->values()->all();
        session()->put('selected_cart_items', $selected);
        $subtotalCents = $items->whereIn('id', $selected)->sum(fn ($item) => (int) round($item->price_snapshot * 100) * $item->quantity);
        $subtotal = $subtotalCents / 100;
        $fee = self::shipping($subtotal);

        return ['subtotal' => $subtotal, 'shippingFee' => $fee, 'total' => round($subtotal + $fee, 2),
            'selectedItems' => $selected, 'selected_count' => count($selected), 'cartCount' => $items->sum('quantity')];
    }
}
