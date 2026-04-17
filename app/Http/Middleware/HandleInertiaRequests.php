<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\Auth;
use App\Models\Setting;  // ← ADD THIS

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function share(Request $request)
    {
        $user = Auth::user();
        $cartCount = 0;
        
        if ($user && $user->cart) {
            $cartCount = $user->cart->items()->sum('quantity');
        }
        
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
            ],
            'cartCount' => $cartCount,
            'shippingConfig' => [
                'free_threshold' => (float) Setting::get('shipping.free_threshold', 5000),  // ← CHANGED
                'base_fee' => (float) Setting::get('shipping.base_fee', 50),  // ← CHANGED
            ],
            'hideAds' => $this->shouldHideAds($request),
        ]);
    }

    private function shouldHideAds(Request $request): bool
    {
        $hideAdsRoutes = [
            'cart.index',
            'checkout.index',
            'order.confirmation',
            'customer.orders',
            'profile.edit'
        ];
        
        return in_array($request->route()?->getName(), $hideAdsRoutes);
    }
}