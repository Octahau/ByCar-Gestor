<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GastoVehiculo extends Model
{
    protected $table = 'gasto_vehiculo';
    protected $primaryKey = 'gasto_vehiculo_id';
    protected $fillable = [
        'vehiculo_id',
        'tipo_gasto',
        'descripcion',
        'user_id',
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
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
