<?php

namespace App\Enums;

enum MotivosGastosCorrientes: string
{
    case INSUMOS = 'Insumos';
    case COMBUSTIBLE = 'Combustible';
    case MANTENIMIENTO = 'Mantenimiento';
    case FAMILIA = 'Familia';
    case LAVALLE = 'Lavalle';
    case IPUESTOS = 'Impuestos';
    case OTROS = 'Otros';
    
}
