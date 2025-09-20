<?php

use App\Models\GastoVehiculo;
use App\Models\User;
use App\Models\Vehiculo;
use App\Models\Venta;

it('can delete a vehicle without sales', function () {
    $user = User::factory()->create();
    $vehiculo = Vehiculo::factory()->create(['estado' => 'disponible']);

    $this->actingAs($user)
        ->delete("/vehiculos/{$vehiculo->vehiculo_id}")
        ->assertSuccessful()
        ->assertJson([
            'success' => true,
            'message' => 'Vehículo eliminado correctamente',
        ]);

    $this->assertDatabaseMissing('vehiculos', [
        'vehiculo_id' => $vehiculo->vehiculo_id,
    ]);
});

it('cannot delete a vehicle with sales', function () {
    $user = User::factory()->create();
    $cliente = \App\Models\Cliente::factory()->create();
    $vehiculo = Vehiculo::factory()->create(['estado' => 'vendido']);
    $venta = Venta::factory()->create([
        'vehiculo_id' => $vehiculo->vehiculo_id,
        'cliente_id' => $cliente->cliente_id,
        'usuario_id' => $user->id,
    ]);

    $this->actingAs($user)
        ->delete("/vehiculos/{$vehiculo->vehiculo_id}")
        ->assertStatus(400)
        ->assertJson([
            'success' => false,
            'message' => 'No se puede eliminar un vehículo que tiene ventas asociadas',
        ]);

    $this->assertDatabaseHas('vehiculos', [
        'vehiculo_id' => $vehiculo->vehiculo_id,
    ]);
});

it('returns 404 when vehicle not found', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->delete('/vehiculos/999999')
        ->assertStatus(404)
        ->assertJson([
            'success' => false,
            'message' => 'Vehículo no encontrado',
        ]);
});

it('deletes vehicle expenses when deleting vehicle', function () {
    $user = User::factory()->create();
    $vehiculo = Vehiculo::factory()->create(['estado' => 'disponible']);
    $gasto = GastoVehiculo::factory()->create(['vehiculo_id' => $vehiculo->vehiculo_id]);

    $this->actingAs($user)
        ->delete("/vehiculos/{$vehiculo->vehiculo_id}")
        ->assertSuccessful();

    $this->assertDatabaseMissing('gasto_vehiculo', [
        'id' => $gasto->id,
    ]);
});
