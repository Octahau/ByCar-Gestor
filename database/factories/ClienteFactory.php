<?php

namespace Database\Factories;

use App\Enums\TipoCliente;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Cliente>
 */
class ClienteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nombre' => $this->faker->name(),
            'dni' => $this->faker->unique()->numerify('########'),
            'email' => $this->faker->unique()->safeEmail(),
            'telefono' => $this->faker->phoneNumber(),
            'tipo' => $this->faker->randomElement([TipoCliente::Interesado, TipoCliente::Comprador]),
            'observaciones' => $this->faker->optional()->sentence(),
        ];
    }
}
