<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Venta>
 */
class VentaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'procedencia' => $this->faker->optional()->word(),
            'valor_venta_ars' => $this->faker->numberBetween(500000, 6000000),
            'valor_venta_usd' => $this->faker->numberBetween(1000, 12000),
            'ganancia_real_ars' => $this->faker->numberBetween(50000, 500000),
            'ganancia_real_usd' => $this->faker->numberBetween(100, 2000),
            'fecha' => $this->faker->date(),
        ];
    }
}
