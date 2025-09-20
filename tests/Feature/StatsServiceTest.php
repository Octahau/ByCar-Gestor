<?php

use App\Models\GastoCorriente;
use App\Models\Vehiculo;
use App\Services\StatsService;

it('gets vehicle stats correctly', function () {
    // Arrange
    Vehiculo::factory()->count(5)->create([
        'estado' => 'disponible',
        'fecha' => now(),
    ]);

    Vehiculo::factory()->count(3)->create([
        'estado' => 'disponible',
        'fecha' => now()->subMonth(),
    ]);

    $service = new StatsService(
        app(\App\Repositories\Contracts\VentaRepositoryInterface::class)
    );

    // Act
    $stats = $service->getVehiculosStats();

    // Assert
    expect($stats->cantidad)->toBe(5);
    expect($stats->porcentaje)->toBeGreaterThan(0);
    expect($stats->tendencia)->toBe('positiva');
});

it('gets current expenses stats correctly', function () {
    // Arrange
    GastoCorriente::factory()->count(3)->create([
        'importe' => 1000,
        'fecha' => now(),
    ]);

    GastoCorriente::factory()->count(2)->create([
        'importe' => 500,
        'fecha' => now()->subMonth(),
    ]);

    $service = new StatsService(
        app(\App\Repositories\Contracts\VentaRepositoryInterface::class)
    );

    // Act
    $stats = $service->getGastosCorrientesStats();

    // Assert
    expect($stats->importe)->toBe(3000.0);
    expect($stats->porcentaje)->toBeGreaterThan(0);
    expect($stats->tendencia)->toBe('positiva');
});

it('calculates percentage correctly when previous is zero', function () {
    // Arrange
    GastoCorriente::factory()->create([
        'importe' => 1000,
        'fecha' => now(),
    ]);

    $service = new StatsService(
        app(\App\Repositories\Contracts\VentaRepositoryInterface::class)
    );

    // Act
    $stats = $service->getGastosCorrientesStats();

    // Assert
    expect($stats->importe)->toBe(1000.0);
    expect($stats->porcentaje)->toBe(100.0);
    expect($stats->tendencia)->toBe('positiva');
});

it('calculates percentage correctly when current is zero', function () {
    // Arrange
    GastoCorriente::factory()->create([
        'importe' => 1000,
        'fecha' => now()->subMonth(),
    ]);

    $service = new StatsService(
        app(\App\Repositories\Contracts\VentaRepositoryInterface::class)
    );

    // Act
    $stats = $service->getGastosCorrientesStats();

    // Assert
    expect($stats->importe)->toBe(0.0);
    expect($stats->porcentaje)->toBe(-100.0);
    expect($stats->tendencia)->toBe('negativa');
});
