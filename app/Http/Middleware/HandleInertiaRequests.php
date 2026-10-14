<?php

namespace App\Http\Middleware;

use App\Support\CartSummary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

  // ← ADD THIS

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
            'shippingConfig' => CartSummary::shippingConfig(),
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
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
            'profile.edit',
        ];

        return in_array($request->route()?->getName(), $hideAdsRoutes);
    }
}
