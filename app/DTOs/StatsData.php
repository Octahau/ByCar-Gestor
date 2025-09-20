<?php

namespace App\DTOs;

class StatsData
{
    public function __construct(
        public readonly int $cantidad,
        public readonly float $porcentaje,
        public readonly string $tendencia,
        public readonly ?float $importe = null
    ) {}

    public function toArray(): array
    {
        $data = [
            'cantidad' => $this->cantidad,
            'porcentaje' => round($this->porcentaje, 1),
            'tendencia' => $this->tendencia,
        ];

        if ($this->importe !== null) {
            $data['importe'] = $this->importe;
        }

        return $data;
    }
}
