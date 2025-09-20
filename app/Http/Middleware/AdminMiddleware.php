<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Verificar que el usuario esté autenticado
        if (! auth()->check()) {
            return redirect()->route('login');
        }

        // Verificar que el usuario sea de tipo 'admin'
        if (auth()->user()->tipo !== 'admin') {
            return redirect()->route('forbidden');
        }

        return $next($request);
    }
}
