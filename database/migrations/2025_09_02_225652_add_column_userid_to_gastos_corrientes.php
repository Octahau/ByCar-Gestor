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
        Schema::table('gastos_corrientes', function (Blueprint $table) {
            $table->foreignId('usuario_id')->nullable()->constrained('users')->onDelete('set null')->after('some_column');
        });
    }

    public function down(): void
    {
        Schema::table('gastos_corrientes', function (Blueprint $table) {
            $table->dropForeign(['usuario_id']);
            $table->dropColumn('usuario_id');
        });
    }
};
