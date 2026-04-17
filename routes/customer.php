<?php

use App\Http\Controllers\Customer\ShopController;
use App\Http\Controllers\Customer\CartController;
use App\Http\Controllers\Customer\CheckoutController;
use App\Http\Controllers\Customer\OrderController;
use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| Customer Frontend Routes
|--------------------------------------------------------------------------
|
| Public routes (browsing) and protected routes (cart, checkout, orders)
|
*/

// ==================== PUBLIC ROUTES (No Login Required) ====================
// Anyone can browse products
Route::get('/landing', [ShopController::class, 'landing'])->name('landing');
Route::get('/shop', [ShopController::class, 'index'])->name('shop.index');
Route::get('/product/{product:slug}', [ShopController::class, 'show'])->name('shop.show');

// ==================== PROTECTED ROUTES (Login Required) ====================
Route::middleware(['auth'])->group(function () {
    
    // Shopping Cart - Requires login to persist cart
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
    Route::patch('/cart/{cartItem}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{cartItem}', [CartController::class, 'remove'])->name('cart.remove');
    Route::post('/cart/update-selection', [CartController::class, 'updateSelection'])->name('cart.update-selection');
    
    // Checkout - Requires login
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
    
    // Order Confirmation - Requires login and order ownership
    Route::get('/order-confirmation/{order}', [OrderController::class, 'confirmation'])->name('order.confirmation');
    
    // My Orders - Customer order history
    Route::get('/my-orders', [OrderController::class, 'index'])->name('customer.orders');
    Route::get('/my-orders/{order}', [OrderController::class, 'show'])->name('customer.orders.show');
});