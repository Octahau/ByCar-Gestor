<?php

namespace Database\Seeders;

use App\Models\GastoCorriente;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class GastoCorrienteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener usuarios existentes
        $users = User::all();

        if ($users->isEmpty()) {
            $this->command->warn('No hay usuarios en la base de datos. Creando gastos corrientes sin usuario_id.');
            $usuarioId = null;
        } else {
            $usuarioId = $users->first()->id;
        }

        $gastosCorrientes = [
            [
                'fecha' => Carbon::now()->subDays(1),
                'item' => 'Combustible',
                'descripcion' => 'Carga de combustible para vehículos de la empresa',
                'importe' => 45000.00,
                'fondo' => 100000.00,
                'usuario_id' => $usuarioId,
            ],
            [
                'fecha' => Carbon::now()->subDays(2),
                'item' => 'Limpieza',
                'descripcion' => 'Productos de limpieza para oficina y vehículos',
                'importe' => 15000.00,
                'fondo' => 100000.00,
                'usuario_id' => $usuarioId,
            ],
            [
                'fecha' => Carbon::now()->subDays(3),
                'item' => 'Mantenimiento',
                'descripcion' => 'Mantenimiento preventivo de vehículos',
                'importe' => 85000.00,
                'fondo' => 500000.00,
                'usuario_id' => $usuarioId,
            ],
            [
                'fecha' => Carbon::now()->subDays(4),
                'item' => 'Papelería',
                'descripcion' => 'Material de oficina y papelería',
                'importe' => 12000.00,
                'fondo' => 100000.00,
                'usuario_id' => $usuarioId,
            ],
            [
                'fecha' => Carbon::now()->subDays(5),
                'item' => 'Seguros',
                'descripcion' => 'Pago de seguros de vehículos',
                'importe' => 120000.00,
                'fondo' => 500000.00,
                'usuario_id' => $usuarioId,
            ],
            [
                'fecha' => Carbon::now()->subDays(6),
                'item' => 'Combustible',
                'descripcion' => 'Carga de combustible para viajes',
                'importe' => 38000.00,
                'fondo' => 100000.00,
                'usuario_id' => $usuarioId,
            ],
            [
                'fecha' => Carbon::now()->subDays(7),
                'item' => 'Limpieza',
                'descripcion' => 'Servicio de limpieza de oficina',
                'importe' => 25000.00,
                'fondo' => 500000.00,
                'usuario_id' => $usuarioId,
            ],
            [
                'fecha' => Carbon::now()->subDays(8),
                'item' => 'Mantenimiento',
                'descripcion' => 'Reparación de aire acondicionado',
                'importe' => 65000.00,
                'fondo' => 500000.00,
                'usuario_id' => $usuarioId,
            ],
            [
                'fecha' => Carbon::now()->subDays(9),
                'item' => 'Papelería',
                'descripcion' => 'Impresión de documentos y formularios',
                'importe' => 8000.00,
                'fondo' => 100000.00,
                'usuario_id' => $usuarioId,
            ],
            [
                'fecha' => Carbon::now()->subDays(10),
                'item' => 'Combustible',
                'descripcion' => 'Carga de combustible para vehículos',
                'importe' => 52000.00,
                'fondo' => 100000.00,
                'usuario_id' => $usuarioId,
            ],
            [
                'fecha' => Carbon::now()->subDays(11),
                'item' => 'Limpieza',
                'descripcion' => 'Productos de limpieza para vehículos',
                'importe' => 18000.00,
                'fondo' => 100000.00,
                'usuario_id' => $usuarioId,
            ],
            [
                'fecha' => Carbon::now()->subDays(12),
                'item' => 'Mantenimiento',
                'descripcion' => 'Cambio de aceite y filtros',
                'importe' => 35000.00,
                'fondo' => 500000.00,
                'usuario_id' => $usuarioId,
            ],
            [
                'fecha' => Carbon::now()->subDays(13),
                'item' => 'Papelería',
                'descripcion' => 'Material de oficina y suministros',
                'importe' => 14000.00,
                'fondo' => 100000.00,
                'usuario_id' => $usuarioId,
            ],
            [
                'fecha' => Carbon::now()->subDays(14),
                'item' => 'Combustible',
                'descripcion' => 'Carga de combustible para viajes de trabajo',
                'importe' => 42000.00,
                'fondo' => 100000.00,
                'usuario_id' => $usuarioId,
            ],
            [
                'fecha' => Carbon::now()->subDays(15),
                'item' => 'Limpieza',
                'descripcion' => 'Servicio de limpieza mensual',
                'importe' => 30000.00,
                'fondo' => 500000.00,
                'usuario_id' => $usuarioId,
            ],
            [
                'fecha' => Carbon::now()->subDays(16),
                'item' => 'Mantenimiento',
                'descripcion' => 'Reparación de frenos',
                'importe' => 75000.00,
                'fondo' => 500000.00,
                'usuario_id' => $usuarioId,
            ],
            [
                'fecha' => Carbon::now()->subDays(17),
                'item' => 'Papelería',
                'descripcion' => 'Impresión y encuadernación de documentos',
                'importe' => 10000.00,
                'fondo' => 100000.00,
                'usuario_id' => $usuarioId,
            ],
            [
                'fecha' => Carbon::now()->subDays(18),
                'item' => 'Combustible',
                'descripcion' => 'Carga de combustible para vehículos de venta',
                'importe' => 48000.00,
                'fondo' => 100000.00,
                'usuario_id' => $usuarioId,
            ],
            [
                'fecha' => Carbon::now()->subDays(19),
                'item' => 'Limpieza',
                'descripcion' => 'Productos de limpieza especializados',
                'importe' => 22000.00,
                'fondo' => 100000.00,
                'usuario_id' => $usuarioId,
            ],
            [
                'fecha' => Carbon::now()->subDays(20),
                'item' => 'Mantenimiento',
                'descripcion' => 'Mantenimiento general de vehículos',
                'importe' => 95000.00,
                'fondo' => 500000.00,
                'usuario_id' => $usuarioId,
            ],
        ];

        foreach ($gastosCorrientes as $gasto) {
            GastoCorriente::create($gasto);
        }

        $this->command->info('20 gastos corrientes de prueba creados exitosamente.');
    }
}
