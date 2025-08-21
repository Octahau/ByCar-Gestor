<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehiculo extends Model
{

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'vehicle_id';
    // app/Models/Vehiculo.php
    protected $fillable = ['marca', 'modelo', 'dominio', 'anio', 'color', 'kilometraje', 'precioARS', 'precioUSD', 'ubicacion'];
}
