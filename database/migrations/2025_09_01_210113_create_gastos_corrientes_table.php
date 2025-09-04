<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('gastos_corrientes', function (Blueprint $table) {
            $table->id();
            $table->date('fecha');
            $table->string('operador');
            $table->string('item'); // o motivo
            $table->string('descripcion');
            $table->decimal('importe', 12, 2);
            $table->decimal('fondo', 12, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gastos_corrientes');
    }
};
