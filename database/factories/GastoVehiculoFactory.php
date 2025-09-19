<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\GastoVehiculo>
 */
class GastoVehiculoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'vehiculo_id' => \App\Models\Vehiculo::factory(),
            'tipo_gasto' => $this->faker->randomElement(['Mantenimiento', 'Reparación', 'Combustible', 'Seguro']),
            'descripcion' => $this->faker->sentence(),
            'operador' => $this->faker->name(),
            'importe_ars' => $this->faker->randomFloat(2, 500, 10000),
            'importe_usd' => $this->faker->randomFloat(2, 10, 200),
            'fecha' => $this->faker->date(),
        ];
    }
}
