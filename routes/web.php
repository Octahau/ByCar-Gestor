<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\BalanceMensualController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\ForbiddenController;
use App\Http\Controllers\GastosCorrientesController;
use App\Http\Controllers\GastoVehiculoController;
use App\Http\Controllers\ResumenController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VehiculoController;
use App\Http\Controllers\VentasController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/403', [ForbiddenController::class, 'index'])->name('forbidden');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('vehiculos', VehiculoController::class);
    Route::resource('ventas', VentasController::class);
    Route::get('/ventas/{venta}/detalle', [VentasController::class, 'detalle'])->name('ventas.detalle');
    Route::resource('clientes', ClienteController::class);
    Route::resource('usuarios', UserController::class)->middleware('admin');
    Route::resource('GastosCorrientes', GastosCorrientesController::class);
    Route::resource('GastosVehiculos', GastoVehiculoController::class);
    Route::get('/balance-mensual', [BalanceMensualController::class, 'index'])->name('balance.mensual')->middleware('admin');

    Route::get('/empleados', [UserController::class, 'empleados'])->name('empleados.index')->middleware('admin');

    // Rutas del dashboard - centralizadas en ResumenController
    Route::get('/vehiculos-cantidad', [ResumenController::class, 'getVehiculos'])->name('vehiculos.cantidad')->middleware('auth');
    Route::get('/ventas-cantidad', [ResumenController::class, 'getVentas'])->name('ventas.cantidad')->middleware('auth');
    Route::get('/gastos-corrientes-cantidad', [ResumenController::class, 'getGastosCorrientes'])->name('gastos.cantidad')->middleware('auth');
    Route::get('/gasto-vehiculo-cantidad', [ResumenController::class, 'getGastosVehiculos'])->name('gastos.vehiculo.cantidad')->middleware('auth');

    // Rutas para datos históricos de gráficas
    Route::get('/gastos-corrientes-historicos', [ResumenController::class, 'getGastosCorrientesHistoricos'])->name('gastos.corrientes.historicos')->middleware('auth');
    Route::get('/gastos-vehiculos-historicos', [ResumenController::class, 'getGastosVehiculosHistoricos'])->name('gastos.vehiculos.historicos')->middleware('auth');
    Route::get('/ventas-historicas', [ResumenController::class, 'getVentasHistoricas'])->name('ventas.historicas')->middleware('auth');
    Route::get('/ventas-gastos-combinados', [ResumenController::class, 'getVentasGastosCombinados'])->name('ventas.gastos.combinados')->middleware('auth');
    Route::get('/ganancia-total-acumulada', [ResumenController::class, 'getGananciaTotalAcumulada'])->name('ganancia.total.acumulada')->middleware('auth');
    Route::get('/ganancia-mes-actual', [ResumenController::class, 'getGananciaMesActual'])->name('ganancia.mes.actual')->middleware('auth');
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

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
