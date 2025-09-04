<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ventas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehiculo_id')
            ->references('vehiculo_id')->on('vehiculos')
            ->onDelete('cascade');


            $table->string('procedencia')->nullable();

            $table->decimal('valor_venta_ars', 15, 2)->nullable();
            $table->decimal('valor_venta_usd', 15, 2)->nullable();

            $table->decimal('ganancia_real_ars', 15, 2)->nullable();
            $table->decimal('ganancia_real_usd', 15, 2)->nullable();

            $table->string('vendedor')->nullable();
            $table->date('fecha')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ventas');
    }
};
