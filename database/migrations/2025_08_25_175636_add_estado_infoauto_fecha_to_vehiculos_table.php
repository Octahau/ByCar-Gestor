<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up()
{
    Schema::table('vehiculos', function (Blueprint $table) {
        $table->string('estado')->nullable();       // ejemplo: disponible, vendido, reservado
        $table->text('infoAuto')->nullable();       // info extra
        $table->date('fecha')->nullable();          // fecha adquisición
    });
}

public function down()
{
    Schema::table('vehiculos', function (Blueprint $table) {
        $table->dropColumn(['estado', 'infoAuto', 'fecha']);
    });
}

};
