<?php

namespace App\DTOs;

class GananciaCalculada
{
    public function __construct(
        public readonly float $ars,
        public readonly float $usd,
        public readonly float $porcentajeArs,
        public readonly float $porcentajeUsd
    ) {}

    public function toArray(): array
    {
        return [
            'ganancia_real_ars' => $this->ars,
            'ganancia_real_usd' => $this->usd,
            'porcentaje_ars' => $this->porcentajeArs,
            'porcentaje_usd' => $this->porcentajeUsd,
        ];
    }
}
