<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Vehiculo>
 */
class VehiculoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'marca' => $this->faker->randomElement(['Toyota', 'Ford', 'Chevrolet', 'Honda', 'Nissan']),
            'modelo' => $this->faker->word(),
            'dominio' => $this->faker->unique()->regexify('[A-Z]{3}[0-9]{3}'),
            'anio' => $this->faker->numberBetween(2010, 2024),
            'color' => $this->faker->colorName(),
            'kilometraje' => $this->faker->numberBetween(0, 200000),
            'precioARS' => $this->faker->numberBetween(100000, 5000000),
            'precioUSD' => $this->faker->numberBetween(1000, 10000),
            'ubicacion' => $this->faker->city(),
            'fecha' => $this->faker->date(),
            'infoAuto' => $this->faker->sentence(),
            'estado' => $this->faker->randomElement(['disponible', 'VENDIDO']),
        ];
    }
}
