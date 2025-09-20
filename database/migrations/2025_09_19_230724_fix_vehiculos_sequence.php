<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Para PostgreSQL, necesitamos sincronizar la secuencia con el valor máximo actual
        if (DB::getDriverName() === 'pgsql') {
            DB::statement("SELECT setval('vehiculos_vehiculo_id_seq', (SELECT MAX(vehiculo_id) FROM vehiculos))");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No hay nada que revertir
    }
};
