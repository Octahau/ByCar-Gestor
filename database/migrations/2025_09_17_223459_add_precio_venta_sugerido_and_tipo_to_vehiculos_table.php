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
        Schema::table('vehiculos', function (Blueprint $table) {
            $table->decimal('precio_venta_sugerido_ars', 15, 2)->nullable()->after('precioARS');
            $table->decimal('precio_venta_sugerido_usd', 15, 2)->nullable()->after('precio_venta_sugerido_ars');
            $table->enum('tipo', ['auto', 'camioneta'])->default('auto')->after('estado');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehiculos', function (Blueprint $table) {
            $table->dropColumn(['precio_venta_sugerido_ars', 'precio_venta_sugerido_usd', 'tipo']);
        });
    }
};
