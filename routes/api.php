<?php

use App\Http\Controllers\Api\AdController;
use Illuminate\Support\Facades\Route;

Route::get('/ads', [AdController::class, 'getAds']);
Route::post('/ads/{ad}/click', [AdController::class, 'trackClick']);
Route::get('/test', function() {
    return response()->json(['message' => 'API is working!']);
});