<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ventas', function (Blueprint $table) {
            $table->id('venta_id');
            $table->unsignedBigInteger('vehiculo_id');
            $table->unsignedBigInteger('cliente_id');
            $table->unsignedBigInteger('usuario_id');

            $table->string('procedencia')->nullable();

            $table->decimal('valor_venta_ars', 15, 2)->nullable();
            $table->decimal('valor_venta_usd', 15, 2)->nullable();

            $table->decimal('ganancia_real_ars', 15, 2)->nullable();
            $table->decimal('ganancia_real_usd', 15, 2)->nullable();

            $table->string('vendedor')->nullable();
            $table->date('fecha')->nullable();

            // Relaciones foráneas
            $table->foreign('vehiculo_id')->references('vehiculo_id')->on('vehiculos')->onDelete('cascade');
            $table->foreign('cliente_id')->references('cliente_id')->on('clientes')->onDelete('cascade');
            $table->foreign('usuario_id')->references('id')->on('users')->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ventas');
    }
};
