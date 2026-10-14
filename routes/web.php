<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application.
| Customer and Admin routes are separated into their own files.
|
*/

// ==================== WELCOME REDIRECT ====================
// Redirect root to customer landing page
Route::get('/', function () {
    return redirect()->route('landing');
});

Route::get('/about', function () {
    return inertia('Customer/About');
})->name('about');

Route::get('/policies', function () {
    return inertia('Customer/Policies');
})->name('policies');

Route::get('/support', function () {
    return inertia('Customer/Support');
})->name('support');

Route::get('/dashboard', fn () => redirect()->route(auth()->user()->role === 'admin' ? 'admin.dashboard' : 'shop.index'))->middleware('auth')->name('dashboard');

// ==================== PROFILE ROUTES ====================
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// ==================== CUSTOMER ROUTES ====================
// All customer routes (no prefix)
require __DIR__.'/customer.php';

// ==================== ADMIN ROUTES ====================
// All admin routes are prefixed with 'admin' and protected by 'auth' + 'admin' middleware
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    require __DIR__.'/admin.php';
});

// ==================== AUTHENTICATION ROUTES ====================
// Laravel Breeze authentication routes
require __DIR__.'/auth.php';
