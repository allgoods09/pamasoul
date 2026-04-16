<?php

use App\Http\Controllers\Admin\AnalyticsController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\UserController;

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
Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

// ==================== PRODUCT MANAGEMENT ====================
Route::resource('products', ProductController::class);
Route::post('/products/bulk-delete', [ProductController::class, 'bulkDelete'])->name('products.bulk-delete');
Route::post('/products/bulk-update-stock', [ProductController::class, 'bulkUpdateStock'])->name('products.bulk-update-stock');
Route::post('/products/{product}/toggle-availability', [ProductController::class, 'toggleAvailability'])->name('products.toggle-availability');
Route::get('/products/export/csv', [ProductController::class, 'export'])->name('products.export');

// ==================== CATEGORY MANAGEMENT ====================
Route::resource('categories', CategoryController::class)->except(['show', 'edit', 'create']);

// ==================== ORDER MANAGEMENT ====================
Route::resource('orders', OrderController::class)->only(['index', 'show']);
Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.update-status');
Route::post('/orders/bulk-update-status', [OrderController::class, 'bulkUpdateStatus'])->name('orders.bulk-update-status');
Route::get('/orders/{order}/invoice', [OrderController::class, 'invoice'])->name('orders.invoice');

// ==================== ANALYTICS ====================
Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics.index');
Route::get('/analytics/export-pdf', [AnalyticsController::class, 'exportPdf'])->name('analytics.export-pdf');
Route::get('/analytics/export-csv', [AnalyticsController::class, 'exportCsv'])->name('analytics.export-csv');

// ==================== USER MANAGEMENT ====================
Route::resource('users', UserController::class)->except(['show', 'edit', 'create', 'update']);
Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show');
Route::patch('/users/{user}/role', [UserController::class, 'updateRole'])->name('users.update-role');
Route::post('/users/{user}/impersonate', [UserController::class, 'impersonate'])->name('users.impersonate');