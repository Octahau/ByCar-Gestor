<?php

namespace App\DTOs;

use Carbon\Carbon;

class VentaData
{
    public function __construct(
        public readonly string $dniCliente,
        public readonly string $dominio,
        public readonly float $valorVentaArs,
        public readonly float $valorVentaUsd,
        public readonly Carbon $fecha,
        public readonly ?string $procedencia = null,
        public readonly ?int $vendedorId = null
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            dniCliente: $data['dniCliente'],
            dominio: $data['dominio'],
            valorVentaArs: (float) $data['valor_venta_ars'],
            valorVentaUsd: (float) $data['valor_venta_usd'],
            fecha: Carbon::parse($data['fecha_venta'] ?? now()),
            procedencia: $data['procedencia'] ?? null,
            vendedorId: isset($data['vendedor']) ? (int) $data['vendedor'] : null
        );
    }
}
