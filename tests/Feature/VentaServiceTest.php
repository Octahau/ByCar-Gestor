<?php

use App\DTOs\VentaData;
use App\Models\Cliente;
use App\Models\GastoVehiculo;
use App\Models\User;
use App\Models\Vehiculo;
use App\Services\VentaService;
use Carbon\Carbon;

it('calculates vehicle profit correctly', function () {
    // Arrange
    $vehiculo = Vehiculo::factory()->create([
        'precioARS' => 1000,
        'precioUSD' => 100,
    ]);

    GastoVehiculo::factory()->create([
        'vehiculo_id' => $vehiculo->vehiculo_id,
        'importe_ars' => 100,
        'importe_usd' => 10,
    ]);

    $ventaData = new VentaData(
        dniCliente: '12345678',
        dominio: 'ABC123',
        valorVentaArs: 1200,
        valorVentaUsd: 120,
        fecha: Carbon::now()
    );

    $service = new VentaService(
        app(\App\Repositories\Contracts\VentaRepositoryInterface::class),
        app(\App\Repositories\Contracts\VehiculoRepositoryInterface::class),
        app(\App\Repositories\Contracts\ClienteRepositoryInterface::class)
    );

    // Act
    $ganancia = $service->calcularGanancia($vehiculo, $ventaData);

    // Assert
    expect($ganancia->ars)->toBe(100.0);
    expect($ganancia->usd)->toBe(10.0);
    expect($ganancia->porcentajeArs)->toBe(10.0);
    expect($ganancia->porcentajeUsd)->toBe(10.0);
});

it('creates a sale successfully', function () {
    // Arrange
    $cliente = Cliente::factory()->create(['dni' => '12345678']);
    $vehiculo = Vehiculo::factory()->create(['dominio' => 'ABC123']);
    $vendedor = User::factory()->create();

    $ventaData = new VentaData(
        dniCliente: '12345678',
        dominio: 'ABC123',
        valorVentaArs: 1200,
        valorVentaUsd: 120,
        fecha: Carbon::now(),
        vendedorId: $vendedor->id
    );

    $service = new VentaService(
        app(\App\Repositories\Contracts\VentaRepositoryInterface::class),
        app(\App\Repositories\Contracts\VehiculoRepositoryInterface::class),
        app(\App\Repositories\Contracts\ClienteRepositoryInterface::class)
    );

    // Act
    $result = $service->crearVenta($ventaData);

    // Assert
    expect($result)->toHaveKey('venta');
    expect($result)->toHaveKey('ganancia');
    expect($result['venta']->cliente_id)->toBe($cliente->cliente_id);
    expect($result['venta']->vehiculo_id)->toBe($vehiculo->vehiculo_id);
    expect($result['venta']->usuario_id)->toBe($vendedor->id);
});

it('throws exception when client not found', function () {
    $ventaData = new VentaData(
        dniCliente: '12345678',
        dominio: 'NONEXISTENT',
        valorVentaArs: 1200,
        valorVentaUsd: 120,
        fecha: Carbon::now()
    );

    $service = new VentaService(
        app(\App\Repositories\Contracts\VentaRepositoryInterface::class),
        app(\App\Repositories\Contracts\VehiculoRepositoryInterface::class),
        app(\App\Repositories\Contracts\ClienteRepositoryInterface::class)
    );

    expect(fn () => $service->crearVenta($ventaData))
        ->toThrow(\App\Exceptions\ClienteNotFoundException::class);
});

it('throws exception when vehicle not found', function () {
    Cliente::factory()->create(['dni' => '12345678']);

    $ventaData = new VentaData(
        dniCliente: '12345678',
        dominio: 'NONEXISTENT',
        valorVentaArs: 1200,
        valorVentaUsd: 120,
        fecha: Carbon::now()
    );

    $service = new VentaService(
        app(\App\Repositories\Contracts\VentaRepositoryInterface::class),
        app(\App\Repositories\Contracts\VehiculoRepositoryInterface::class),
        app(\App\Repositories\Contracts\ClienteRepositoryInterface::class)
    );

    expect(fn () => $service->crearVenta($ventaData))
        ->toThrow(\App\Exceptions\VehiculoNotFoundException::class);
});
