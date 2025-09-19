<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GastoCorriente extends Model
{
    use HasFactory;

    // Nombre de la tabla
    protected $table = 'gastos_corrientes';

    // Los campos que se pueden asignar masivamente
    protected $fillable = [
        'fecha',
        'item',
        'descripcion',
        'importe',
        'fondo',
        'usuario_id',
    ];

    protected $casts = [
        'fecha' => 'date',
        'importe' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'usuario_id', 'id');
    }
}
