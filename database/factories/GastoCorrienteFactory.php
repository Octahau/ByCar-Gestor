<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\GastoCorriente>
 */
class GastoCorrienteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'fecha' => $this->faker->date(),
            'item' => $this->faker->word(),
            'descripcion' => $this->faker->sentence(),
            'importe' => $this->faker->randomFloat(2, 100, 5000),
            'fondo' => $this->faker->randomElement(['Caja', 'Banco', 'Efectivo']),
            'usuario_id' => \App\Models\User::factory(),
        ];
    }
}
