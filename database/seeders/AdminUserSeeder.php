<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Verificar si ya existen los usuarios
        if (User::where('email', 'admin@bycar.com')->exists()) {
            $this->command->info('Usuario admin ya existe: admin@bycar.com / admin123');
        } else {
            // Crear usuario administrador
            User::create([
                'name' => 'Administrador',
                'email' => 'admin@bycar.com',
                'password' => Hash::make('admin123'),
                'dni' => '11111111',
                'tipo' => 'admin',
                'email_verified_at' => now(),
            ]);
            $this->command->info('Usuario admin creado: admin@bycar.com / admin123');
        }

        if (User::where('email', 'empleado@bycar.com')->exists()) {
            $this->command->info('Usuario empleado ya existe: empleado@bycar.com / empleado123');
        } else {
            // Crear usuario empleado para pruebas
            User::create([
                'name' => 'Empleado Test',
                'email' => 'empleado@bycar.com',
                'password' => Hash::make('empleado123'),
                'dni' => '22222222',
                'tipo' => 'empleado',
                'email_verified_at' => now(),
            ]);
            $this->command->info('Usuario empleado creado: empleado@bycar.com / empleado123');
        }

        $this->command->info('Credenciales de prueba:');
        $this->command->info('Admin: admin@bycar.com / admin123');
        $this->command->info('Empleado: empleado@bycar.com / empleado123');
    }
}
