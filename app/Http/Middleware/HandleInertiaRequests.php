<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\Auth;

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
                'free_threshold' => config('shipping.free_threshold', 5000),
                'base_fee' => config('shipping.base_fee', 50),
            ],
        ]);
    }
}