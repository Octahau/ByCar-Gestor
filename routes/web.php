<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\VehiculoController;
use App\Http\Controllers\VentasController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::resource('vehiculos', VehiculoController::class);
Route::resource('/ventas', VentasController::class);
Route::resource('/registro', UserController::class);

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
