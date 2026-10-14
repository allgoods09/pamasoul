<?php

use App\Http\Controllers\Admin\AnalyticsController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
|
| All routes here are prefixed with 'admin' and have 'auth' and 'admin'
| middleware applied automatically from web.php
|
*/

// Admin Dashboard
Route::get('/', fn () => redirect()->route('admin.dashboard'));
Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

// ==================== PRODUCT MANAGEMENT ====================
Route::resource('products', ProductController::class)->except('show');
Route::post('/products/bulk-delete', [ProductController::class, 'bulkDelete'])->name('products.bulk-delete');
Route::post('/products/bulk-update-stock', [ProductController::class, 'bulkUpdateStock'])->name('products.bulk-update-stock');
Route::post('/products/{product}/toggle-availability', [ProductController::class, 'toggleAvailability'])->name('products.toggle-availability');
Route::get('/products/export/csv', [ProductController::class, 'export'])->name('products.export');

// ==================== CATEGORY MANAGEMENT ====================
Route::resource('categories', CategoryController::class)->except(['show', 'edit', 'create']);

// ==================== ORDER MANAGEMENT ====================
Route::get('/orders/export', [OrderController::class, 'export'])->name('orders.export');
Route::resource('orders', OrderController::class)->only(['index', 'show']);
Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.update-status');
Route::post('/orders/bulk-update-status', [OrderController::class, 'bulkUpdateStatus'])->name('orders.bulk-update-status');
Route::get('/orders/{order}/invoice', [OrderController::class, 'invoice'])->name('orders.invoice');
Route::post('/orders/{order}/send-email', [OrderController::class, 'sendStatusEmail'])->name('orders.send-email');
Route::post('/orders/shipping-settings', [OrderController::class, 'updateShippingSettings'])->name('orders.shipping-settings');

// ==================== ANALYTICS ====================
Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics.index');
Route::get('/analytics/export-pdf', [AnalyticsController::class, 'exportPdf'])->name('analytics.export-pdf');
Route::get('/analytics/export-csv', [AnalyticsController::class, 'exportCsv'])->name('analytics.export-csv');

// ==================== USER MANAGEMENT ====================
Route::post('/users/bulk-role', [UserController::class, 'bulkUpdateRole'])->name('users.bulk-role');
Route::post('/users/bulk-delete', [UserController::class, 'bulkDelete'])->name('users.bulk-delete');
Route::resource('users', UserController::class)->except(['show', 'edit', 'create', 'update']);
Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show');
Route::patch('/users/{user}/role', [UserController::class, 'updateRole'])->name('users.update-role');
