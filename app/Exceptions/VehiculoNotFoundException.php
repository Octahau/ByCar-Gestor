<?php

namespace App\Exceptions;

class VehiculoNotFoundException extends BusinessException
{
    public function __construct(string $dominio)
    {
        parent::__construct("Vehículo con dominio {$dominio} no encontrado", 404);
    }
}
