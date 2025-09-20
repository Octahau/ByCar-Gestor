<?php

namespace App\Exceptions;

class ClienteNotFoundException extends BusinessException
{
    public function __construct(string $dni)
    {
        parent::__construct("Cliente con DNI {$dni} no encontrado", 404);
    }
}
