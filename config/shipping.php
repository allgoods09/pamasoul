<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Shipping Configuration
    |--------------------------------------------------------------------------
    |
    | Configure shipping fees and free shipping thresholds
    |
    */

    'free_threshold' => env('SHIPPING_FREE_THRESHOLD', 5000),
    'base_fee' => env('SHIPPING_BASE_FEE', 50),
];