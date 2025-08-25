<?php

namespace App\Enums;

enum EstadoVehiculo: string
{
    case DISPONIBLE = 'disponible';
    case NO_DISPONIBLE = 'no_disponible';
    case VENDIDO = 'vendido';
}
