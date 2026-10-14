<?php

namespace App\Http\Controllers;

use App\Support\CartSummary;

abstract class Controller
{
    protected function calculateShipping($subtotal)
    {
        return CartSummary::shipping((float) $subtotal);
    }

    protected function getShippingConfig()
    {
        return CartSummary::shippingConfig();
    }
}
