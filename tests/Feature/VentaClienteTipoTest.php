<?php

use App\Enums\TipoCliente;
use App\Models\Cliente;
use App\Models\User;
use App\Models\Vehiculo;
use App\Models\Venta;

it('changes cliente tipo to comprador when a sale is created', function () {
    // Autenticar un usuario
    $user = User::factory()->create();
    $this->actingAs($user);
    // Crear un cliente interesado
    $cliente = Cliente::factory()->create([
        'tipo' => TipoCliente::Interesado,
    ]);

    // Crear un vehículo disponible
    $vehiculo = Vehiculo::factory()->create([
        'estado' => 'disponible',
    ]);

    // Crear un usuario vendedor
    $vendedor = User::factory()->create();

    // Datos de la venta
    $ventaData = [
        'dniCliente' => $cliente->dni,
        'dominio' => $vehiculo->dominio,
        'procedencia' => 'Test procedencia',
        'valor_venta_ars' => 1000000,
        'valor_venta_usd' => 1000,
        'fecha_venta' => now()->format('Y-m-d'),
        'vendedor' => (string) $vendedor->id,
    ];

    // Realizar la venta
    $response = $this->postJson('/ventas', $ventaData);

    // Verificar que la venta se creó exitosamente
    $response->assertSuccessful();
    $response->assertJson(['success' => true]);

    // Verificar que el cliente ahora es comprador
    $cliente->refresh();
    expect($cliente->tipo)->toBe(TipoCliente::Comprador);

    // Verificar que el vehículo está marcado como vendido
    $vehiculo->refresh();
    expect($vehiculo->estado)->toBe('VENDIDO');
});

it('reverts cliente tipo to interesado when a sale is deleted', function () {
    // Autenticar un usuario
    $user = User::factory()->create();
    $this->actingAs($user);
    // Crear un cliente comprador
    $cliente = Cliente::factory()->create([
        'tipo' => TipoCliente::Comprador,
    ]);

    // Crear un vehículo vendido
    $vehiculo = Vehiculo::factory()->create([
        'estado' => 'VENDIDO',
    ]);

    // Crear un usuario vendedor
    $vendedor = User::factory()->create();

    // Crear una venta
    $venta = Venta::factory()->create([
        'cliente_id' => $cliente->cliente_id,
        'vehiculo_id' => $vehiculo->vehiculo_id,
        'usuario_id' => $vendedor->id,
    ]);

    // Eliminar la venta
    $response = $this->deleteJson("/ventas/{$venta->venta_id}");

    // Verificar que la venta se eliminó exitosamente
    $response->assertSuccessful();
    $response->assertJson(['success' => true]);

    // Verificar que el cliente volvió a ser interesado
    $cliente->refresh();
    expect($cliente->tipo)->toBe(TipoCliente::Interesado);

    // Verificar que el vehículo volvió a estar disponible
    $vehiculo->refresh();
    expect($vehiculo->estado)->toBe('disponible');
});
