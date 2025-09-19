<?php

namespace App\Models;

use App\Enums\TipoVehiculo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehiculo extends Model
{
    use HasFactory;

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'vehiculo_id';

    // app/Models/Vehiculo.php
    protected $fillable = [
        'marca', 'modelo', 'dominio', 'anio', 'color', 'kilometraje',
        'precioARS', 'precioUSD', 'precio_venta_sugerido_ars', 'precio_venta_sugerido_usd',
        'ubicacion', 'estado', 'tipo', 'infoAuto', 'fecha',
    ];

    // Opcional: castear fecha a tipo date/datetime
    protected $casts = [
        'fecha' => 'date',
        'tipo' => TipoVehiculo::class,
    ];

    // Relación con gastos del vehículo
    public function gastos()
    {
        return $this->hasMany(GastoVehiculo::class, 'vehiculo_id', 'vehiculo_id');
    }
}
