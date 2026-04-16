<?php

namespace App\Http\Controllers;

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
        $freeThreshold = config('shipping.free_threshold');
        $baseFee = config('shipping.base_fee');
        
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
            'free_threshold' => config('shipping.free_threshold'),
            'base_fee' => config('shipping.base_fee'),
        ];
    }
}