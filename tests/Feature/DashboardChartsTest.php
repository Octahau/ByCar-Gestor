<?php

use App\Models\GastoCorriente;
use App\Models\GastoVehiculo;
use App\Models\User;
use App\Models\Vehiculo;
use App\Models\Venta;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

it('can fetch gastos corrientes historicos', function () {
    // Crear algunos gastos corrientes de prueba
    GastoCorriente::factory()->create([
        'fecha' => now()->subMonths(2),
        'importe' => 1000,
        'usuario_id' => $this->user->id,
    ]);

    GastoCorriente::factory()->create([
        'fecha' => now()->subMonth(),
        'importe' => 1500,
        'usuario_id' => $this->user->id,
    ]);

    $response = $this->get('/gastos-corrientes-historicos');

    $response->assertSuccessful();
    $response->assertJsonStructure([
        'success',
        'data' => [
            '*' => [
                'mes',
                'nombreMes',
                'total',
            ],
        ],
    ]);
});

it('can fetch gastos vehiculos historicos', function () {
    $vehiculo = Vehiculo::factory()->create();

    // Crear algunos gastos de vehículos de prueba
    GastoVehiculo::factory()->create([
        'vehiculo_id' => $vehiculo->vehiculo_id,
        'fecha' => now()->subMonths(2),
        'importe_ars' => 2000,
    ]);

    GastoVehiculo::factory()->create([
        'vehiculo_id' => $vehiculo->vehiculo_id,
        'fecha' => now()->subMonth(),
        'importe_ars' => 2500,
    ]);

    $response = $this->get('/gastos-vehiculos-historicos');

    $response->assertSuccessful();
    $response->assertJsonStructure([
        'success',
        'data' => [
            '*' => [
                'mes',
                'nombreMes',
                'total',
            ],
        ],
    ]);
});

it('can fetch ventas historicas', function () {
    $vehiculo = Vehiculo::factory()->create();
    $cliente = \App\Models\Cliente::factory()->create();

    // Crear algunas ventas de prueba
    Venta::factory()->create([
        'vehiculo_id' => $vehiculo->vehiculo_id,
        'cliente_id' => $cliente->cliente_id,
        'fecha' => now()->subMonths(2),
        'valor_venta_ars' => 50000,
        'usuario_id' => $this->user->id,
    ]);

    Venta::factory()->create([
        'vehiculo_id' => $vehiculo->vehiculo_id,
        'cliente_id' => $cliente->cliente_id,
        'fecha' => now()->subMonth(),
        'valor_venta_ars' => 75000,
        'usuario_id' => $this->user->id,
    ]);

    $response = $this->get('/ventas-historicas');

    $response->assertSuccessful();
    $response->assertJsonStructure([
        'success',
        'data' => [
            '*' => [
                'mes',
                'nombreMes',
                'total',
            ],
        ],
    ]);
});

it('returns empty data when no records exist', function () {
    $response = $this->get('/gastos-corrientes-historicos');

    $response->assertSuccessful();
    $response->assertJsonStructure([
        'success',
        'data' => [
            '*' => [
                'mes',
                'nombreMes',
                'total',
            ],
        ],
    ]);

    $data = $response->json('data');
    expect($data)->toHaveCount(12);
    expect($data[0]['total'])->toBe(0);
});

it('can fetch ganancia total acumulada', function () {
    $vehiculo = Vehiculo::factory()->create();
    $cliente = \App\Models\Cliente::factory()->create();

    // Crear algunas ventas con ganancias
    Venta::factory()->create([
        'vehiculo_id' => $vehiculo->vehiculo_id,
        'cliente_id' => $cliente->cliente_id,
        'ganancia_real_ars' => 50000,
        'usuario_id' => $this->user->id,
    ]);

    Venta::factory()->create([
        'vehiculo_id' => $vehiculo->vehiculo_id,
        'cliente_id' => $cliente->cliente_id,
        'ganancia_real_ars' => 30000,
        'usuario_id' => $this->user->id,
    ]);

    $response = $this->get('/ganancia-total-acumulada');

    $response->assertSuccessful();
    $response->assertJsonStructure([
        'success',
        'gananciaTotal',
    ]);

    $data = $response->json();
    expect($data['gananciaTotal'])->toBe(80000);
});

it('can fetch ganancia mes actual', function () {
    $vehiculo = Vehiculo::factory()->create();
    $cliente = \App\Models\Cliente::factory()->create();

    // Crear ventas del mes actual
    Venta::factory()->create([
        'vehiculo_id' => $vehiculo->vehiculo_id,
        'cliente_id' => $cliente->cliente_id,
        'fecha' => now(),
        'ganancia_real_ars' => 25000,
        'usuario_id' => $this->user->id,
    ]);

    // Crear ventas del mes anterior
    Venta::factory()->create([
        'vehiculo_id' => $vehiculo->vehiculo_id,
        'cliente_id' => $cliente->cliente_id,
        'fecha' => now()->subMonth(),
        'ganancia_real_ars' => 15000,
        'usuario_id' => $this->user->id,
    ]);

    $response = $this->get('/ganancia-mes-actual');

    $response->assertSuccessful();
    $response->assertJsonStructure([
        'success',
        'gananciaMes',
        'porcentaje',
        'tendencia',
    ]);

    $data = $response->json();
    expect($data['gananciaMes'])->toBe(25000);
    expect($data['tendencia'])->toBe('positiva');
});
