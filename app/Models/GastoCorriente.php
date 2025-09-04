<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GastoCorriente extends Model
{
    // Nombre de la tabla
    protected $table = 'gastos_corrientes';

    // Llave primaria 
    protected $primaryKey = 'gastos_corrientes_id';

    // Los campos que se pueden asignar masivamente
    protected $fillable = [
        'fecha',
        'motivo',
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
