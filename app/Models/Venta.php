<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Venta extends Model
{
    use HasFactory;

    protected $table = 'ventas';
    protected $primaryKey = 'venta_id';

    protected $fillable = [
        'cliente_id',
        'usuario_id',
        'vehiculo_id',
        'procedencia',
        'valor_venta_ars',
        'valor_venta_usd',
        'ganancia_real_ars',
        'ganancia_real_usd',
        'vendedor',
        'fecha',
    ];

    protected $casts = [
        'fecha' => 'date',
    ];

    // Relación: una venta pertenece a un vehículo
    public function vehiculo()
    {
        return $this->belongsTo(Vehiculo::class, 'vehiculo_id', 'vehiculo_id');
    }
    // Relación: una venta pertenece a un usuario
    public function user()
    {
        return $this->belongsTo(User::class, 'usuario_id', 'id');
    }
}
