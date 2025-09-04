<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('gasto_vehiculo', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehiculo_id')
                ->constrained('vehiculos', 'vehiculo_id')
                ->onDelete('cascade'); // Si se borra el vehículo, se borran sus gastos
            $table->string('tipo_gasto')->nullable(); // Ej: Mantenimiento, Combustible
            $table->text('descripcion')->nullable(); // Detalles del gasto
            $table->string('operador')->nullable(); // Nombre del operador
            $table->decimal('importe_ars', 12, 2)->default(0);
            $table->decimal('importe_usd', 12, 2)->default(0);
            $table->date('fecha')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gasto_vehiculo');
    }
};
