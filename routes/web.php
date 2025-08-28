<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\VehiculoController;
use App\Http\Controllers\VentasController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ClienteController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () 
{
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('vehiculos', VehiculoController::class);
    Route::resource('ventas', VentasController::class);
    Route::resource('clientes', ClienteController::class);
});

Route::get('/registro', [RegisteredUserController::class, 'create'])
    ->name('registro.create');

Route::post('/registro', [RegisteredUserController::class, 'store'])
    ->name('registro.store');

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])
        ->name('login'); // Muestra el formulario de login

    Route::post('login', [AuthenticatedSessionController::class, 'store'])
        ->name('login.store'); // Procesa los datos del login
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
