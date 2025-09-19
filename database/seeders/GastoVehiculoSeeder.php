<?php

namespace Database\Seeders;

use App\Models\GastoVehiculo;
use Illuminate\Database\Seeder;

class GastoVehiculoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $gastosVehiculos = [
            // Gastos para Toyota Corolla (vehiculo_id: 1)
            [
                'vehiculo_id' => 1,
                'tipo_gasto' => 'Mantenimiento',
                'descripcion' => 'Cambio de aceite y filtros',
                'operador' => 'Octavio Haurigot',
                'importe_ars' => 45000.00,
                'importe_usd' => 45.00,
                'fecha' => '2024-01-15',
            ],
            [
                'vehiculo_id' => 1,
                'tipo_gasto' => 'Combustible',
                'descripcion' => 'Carga completa de nafta',
                'operador' => 'Octavio Haurigot',
                'importe_ars' => 25000.00,
                'importe_usd' => 25.00,
                'fecha' => '2024-01-20',
            ],
            [
                'vehiculo_id' => 1,
                'tipo_gasto' => 'Reparación',
                'descripcion' => 'Reparación de frenos delanteros',
                'operador' => 'María López',
                'importe_ars' => 85000.00,
                'importe_usd' => 85.00,
                'fecha' => '2024-02-10',
            ],

            // Gastos para Ford Fiesta (vehiculo_id: 2)
            [
                'vehiculo_id' => 2,
                'tipo_gasto' => 'Limpieza',
                'descripcion' => 'Lavado completo y encerado',
                'operador' => 'Carlos Gómez',
                'importe_ars' => 15000.00,
                'importe_usd' => 15.00,
                'fecha' => '2024-01-18',
            ],
            [
                'vehiculo_id' => 2,
                'tipo_gasto' => 'Mantenimiento',
                'descripcion' => 'Revisión técnica obligatoria',
                'operador' => 'Octavio Haurigot',
                'importe_ars' => 35000.00,
                'importe_usd' => 35.00,
                'fecha' => '2024-02-05',
            ],
            [
                'vehiculo_id' => 2,
                'tipo_gasto' => 'Combustible',
                'descripcion' => 'Carga de combustible',
                'operador' => 'Laura Fernández',
                'importe_ars' => 22000.00,
                'importe_usd' => 22.00,
                'fecha' => '2024-02-15',
            ],

            // Gastos para Volkswagen Gol (vehiculo_id: 3)
            [
                'vehiculo_id' => 3,
                'tipo_gasto' => 'Reparación',
                'descripcion' => 'Cambio de neumáticos',
                'operador' => 'María López',
                'importe_ars' => 120000.00,
                'importe_usd' => 120.00,
                'fecha' => '2024-01-25',
            ],
            [
                'vehiculo_id' => 3,
                'tipo_gasto' => 'Mantenimiento',
                'descripcion' => 'Alineación y balanceado',
                'operador' => 'Carlos Gómez',
                'importe_ars' => 18000.00,
                'importe_usd' => 18.00,
                'fecha' => '2024-01-26',
            ],
            [
                'vehiculo_id' => 3,
                'tipo_gasto' => 'Combustible',
                'descripcion' => 'Carga de nafta',
                'operador' => 'Octavio Haurigot',
                'importe_ars' => 28000.00,
                'importe_usd' => 28.00,
                'fecha' => '2024-02-08',
            ],

            // Gastos para Chevrolet Onix (vehiculo_id: 4)
            [
                'vehiculo_id' => 4,
                'tipo_gasto' => 'Mantenimiento',
                'descripcion' => 'Cambio de filtro de aire',
                'operador' => 'Laura Fernández',
                'importe_ars' => 12000.00,
                'importe_usd' => 12.00,
                'fecha' => '2024-01-30',
            ],
            [
                'vehiculo_id' => 4,
                'tipo_gasto' => 'Reparación',
                'descripcion' => 'Reparación de aire acondicionado',
                'operador' => 'María López',
                'importe_ars' => 95000.00,
                'importe_usd' => 95.00,
                'fecha' => '2024-02-12',
            ],
            [
                'vehiculo_id' => 4,
                'tipo_gasto' => 'Combustible',
                'descripcion' => 'Carga completa',
                'operador' => 'Carlos Gómez',
                'importe_ars' => 26000.00,
                'importe_usd' => 26.00,
                'fecha' => '2024-02-18',
            ],

            // Gastos para Renault Kangoo (vehiculo_id: 5)
            [
                'vehiculo_id' => 5,
                'tipo_gasto' => 'Mantenimiento',
                'descripcion' => 'Cambio de aceite y filtros',
                'operador' => 'Octavio Haurigot',
                'importe_ars' => 42000.00,
                'importe_usd' => 42.00,
                'fecha' => '2024-02-01',
            ],
            [
                'vehiculo_id' => 5,
                'tipo_gasto' => 'Limpieza',
                'descripcion' => 'Limpieza interior y exterior',
                'operador' => 'Laura Fernández',
                'importe_ars' => 20000.00,
                'importe_usd' => 20.00,
                'fecha' => '2024-02-14',
            ],
            [
                'vehiculo_id' => 5,
                'tipo_gasto' => 'Combustible',
                'descripcion' => 'Carga de gasoil',
                'operador' => 'María López',
                'importe_ars' => 32000.00,
                'importe_usd' => 32.00,
                'fecha' => '2024-02-20',
            ],

            // Gastos para Peugeot 208 (vehiculo_id: 6)
            [
                'vehiculo_id' => 6,
                'tipo_gasto' => 'Reparación',
                'descripcion' => 'Reparación de embrague',
                'operador' => 'Carlos Gómez',
                'importe_ars' => 150000.00,
                'importe_usd' => 150.00,
                'fecha' => '2024-01-28',
            ],
            [
                'vehiculo_id' => 6,
                'tipo_gasto' => 'Mantenimiento',
                'descripcion' => 'Revisión post-reparación',
                'operador' => 'Octavio Haurigot',
                'importe_ars' => 25000.00,
                'importe_usd' => 25.00,
                'fecha' => '2024-02-02',
            ],
            [
                'vehiculo_id' => 6,
                'tipo_gasto' => 'Combustible',
                'descripcion' => 'Carga de nafta',
                'operador' => 'Laura Fernández',
                'importe_ars' => 24000.00,
                'importe_usd' => 24.00,
                'fecha' => '2024-02-16',
            ],

            // Gastos para Honda Civic (vehiculo_id: 7)
            [
                'vehiculo_id' => 7,
                'tipo_gasto' => 'Mantenimiento',
                'descripcion' => 'Cambio de bujías',
                'operador' => 'María López',
                'importe_ars' => 35000.00,
                'importe_usd' => 35.00,
                'fecha' => '2024-02-03',
            ],
            [
                'vehiculo_id' => 7,
                'tipo_gasto' => 'Limpieza',
                'descripcion' => 'Detallado completo',
                'operador' => 'Carlos Gómez',
                'importe_ars' => 30000.00,
                'importe_usd' => 30.00,
                'fecha' => '2024-02-11',
            ],
            [
                'vehiculo_id' => 7,
                'tipo_gasto' => 'Combustible',
                'descripcion' => 'Carga completa',
                'operador' => 'Octavio Haurigot',
                'importe_ars' => 29000.00,
                'importe_usd' => 29.00,
                'fecha' => '2024-02-19',
            ],

            // Gastos para Fiat Cronos (vehiculo_id: 8)
            [
                'vehiculo_id' => 8,
                'tipo_gasto' => 'Mantenimiento',
                'descripcion' => 'Cambio de correa de distribución',
                'operador' => 'Laura Fernández',
                'importe_ars' => 80000.00,
                'importe_usd' => 80.00,
                'fecha' => '2024-01-22',
            ],
            [
                'vehiculo_id' => 8,
                'tipo_gasto' => 'Reparación',
                'descripcion' => 'Reparación de sistema eléctrico',
                'operador' => 'María López',
                'importe_ars' => 65000.00,
                'importe_usd' => 65.00,
                'fecha' => '2024-02-07',
            ],
            [
                'vehiculo_id' => 8,
                'tipo_gasto' => 'Combustible',
                'descripcion' => 'Carga de nafta',
                'operador' => 'Carlos Gómez',
                'importe_ars' => 23000.00,
                'importe_usd' => 23.00,
                'fecha' => '2024-02-17',
            ],

            // Gastos para Nissan Versa (vehiculo_id: 9)
            [
                'vehiculo_id' => 9,
                'tipo_gasto' => 'Mantenimiento',
                'descripcion' => 'Cambio de filtro de combustible',
                'operador' => 'Octavio Haurigot',
                'importe_ars' => 15000.00,
                'importe_usd' => 15.00,
                'fecha' => '2024-01-29',
            ],
            [
                'vehiculo_id' => 9,
                'tipo_gasto' => 'Limpieza',
                'descripcion' => 'Lavado y encerado',
                'operador' => 'Laura Fernández',
                'importe_ars' => 18000.00,
                'importe_usd' => 18.00,
                'fecha' => '2024-02-13',
            ],
            [
                'vehiculo_id' => 9,
                'tipo_gasto' => 'Combustible',
                'descripcion' => 'Carga completa',
                'operador' => 'María López',
                'importe_ars' => 27000.00,
                'importe_usd' => 27.00,
                'fecha' => '2024-02-21',
            ],

            // Gastos para Toyota Hilux (vehiculo_id: 10)
            [
                'vehiculo_id' => 10,
                'tipo_gasto' => 'Mantenimiento',
                'descripcion' => 'Cambio de aceite y filtros',
                'operador' => 'Carlos Gómez',
                'importe_ars' => 55000.00,
                'importe_usd' => 55.00,
                'fecha' => '2024-01-16',
            ],
            [
                'vehiculo_id' => 10,
                'tipo_gasto' => 'Reparación',
                'descripcion' => 'Reparación de suspensión',
                'operador' => 'Octavio Haurigot',
                'importe_ars' => 120000.00,
                'importe_usd' => 120.00,
                'fecha' => '2024-02-09',
            ],
            [
                'vehiculo_id' => 10,
                'tipo_gasto' => 'Combustible',
                'descripcion' => 'Carga de gasoil',
                'operador' => 'Laura Fernández',
                'importe_ars' => 45000.00,
                'importe_usd' => 45.00,
                'fecha' => '2024-02-22',
            ],
        ];

        foreach ($gastosVehiculos as $gasto) {
            GastoVehiculo::create($gasto);
        }
    }
}
