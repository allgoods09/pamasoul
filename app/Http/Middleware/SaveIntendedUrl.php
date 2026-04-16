<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class SaveIntendedUrl
{
    public function handle(Request $request, Closure $next)
    {
        // Save the intended URL for guests trying to access protected routes
        if (!auth()->check() && !in_array($request->route()->getName(), ['login', 'register'])) {
            Session::put('url.intended', $request->url());
        }

        return $next($request);
    }
}