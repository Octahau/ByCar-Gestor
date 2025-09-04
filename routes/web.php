<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\VehiculoController;
use App\Http\Controllers\VentasController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\GastosCorrientesController;
use App\Http\Controllers\GastoVehiculoController;
use App\Models\GastoCorriente;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('vehiculos', VehiculoController::class);
    Route::resource('ventas', VentasController::class);
    Route::resource('clientes', ClienteController::class);
    Route::resource('GastosCorrientes', GastosCorrientesController::class);
    Route::resource('GastosVehiculos', GastoVehiculoController::class);

    Route::get('/empleados', [UserController::class, 'empleados'])->name('empleados.index');
    Route::get('/vehiculos-cantidad', [VehiculoController::class, 'getVehiculos'])->name('vehiculos.cantidad')->middleware('auth');
    Route::get('/ventas-cantidad', [VentasController::class, 'getVentas'])->name('ventas.cantidad')->middleware('auth');

    Route::get('/gastos-corrientes-cantidad', [GastosCorrientesController::class, 'getGastoTotal'])
        ->name('gastos.cantidad')
        ->middleware('auth');
    Route::get('/gasto-vehiculo-cantidad', [GastoVehiculoController::class, 'getGastoTotal'])
        ->name('gastos.vehiculo.cantidad')
        ->middleware('auth');
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
