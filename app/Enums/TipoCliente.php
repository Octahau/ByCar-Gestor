<?php

namespace App\Enums;

enum TipoCliente: string
{
    case Interesado = 'interesado';
    case Comprador = 'comprador';

    public function label(): string
    {
        return match ($this) {
            self::Interesado => 'Interesado',
            self::Comprador => 'Comprador',
        };
    }

    public static function options(): array
    {
        return [
            self::Interesado->value => self::Interesado->label(),
            self::Comprador->value => self::Comprador->label(),
        ];
    }
}
