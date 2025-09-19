<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GastoVehiculo extends Model
{
    use HasFactory;

    protected $table = 'gasto_vehiculo';

    protected $fillable = [
        'vehiculo_id',
        'tipo_gasto',
        'descripcion',
        'operador',
        'importe_ars',
        'importe_usd',
        'fecha',
    ];

    protected $casts = [
        'fecha' => 'date:Y-m-d',
    ];

    public function vehiculo()
    {
        return $this->belongsTo(Vehiculo::class, 'vehiculo_id', 'vehiculo_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'operador', 'name');
    }
}
