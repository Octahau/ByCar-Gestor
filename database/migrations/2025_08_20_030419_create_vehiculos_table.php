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
        Schema::create('vehiculos', function (Blueprint $table) {
            $table->id('vehiculo_id'); // Clave primaria personalizada
            $table->string('marca')->nullable();
            $table->string('modelo')->nullable();
            $table->string('dominio')->unique(); // dominio único
            $table->integer('anio')->nullable();
            $table->string('color')->nullable();
            $table->integer('kilometraje')->nullable(); // Kilometraje opcional
            $table->decimal('precioARS', 10, 2)->nullable(); // Precio en ARS con decimales
            $table->string('precioUSD',10,2)->nullable(); // Precio en USD, opcional
            $table->timestamps(); // created_at y updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehiculos');
    }
};
