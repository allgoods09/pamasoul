<?php

namespace App\Http\Controllers;

use App\Models\Setting;

abstract class Controller
{
    /**
     * Calculate shipping fee based on subtotal
     * 
     * @param float $subtotal
     * @return float
     */
    protected function calculateShipping($subtotal)
    {
        $freeThreshold = (float) Setting::get('shipping.free_threshold', 5000);
        $baseFee = (float) Setting::get('shipping.base_fee', 50);
        
        if ($subtotal >= $freeThreshold) {
            return 0;
        }
        
        return $baseFee;
    }
    
    /**
     * Get shipping configuration for frontend
     * 
     * @return array
     */
    protected function getShippingConfig()
    {
        return [
            'free_threshold' => (float) Setting::get('shipping.free_threshold', 5000),
            'base_fee' => (float) Setting::get('shipping.base_fee', 50),
        ];
    }
}