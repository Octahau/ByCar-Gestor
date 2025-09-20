<?php

namespace App\DTOs;

class HistoricData
{
    public function __construct(
        public readonly string $mes,
        public readonly string $nombreMes,
        public readonly float $total
    ) {}

    public function toArray(): array
    {
        return [
            'mes' => $this->mes,
            'nombreMes' => $this->nombreMes,
            'total' => $this->total,
        ];
    }
}
