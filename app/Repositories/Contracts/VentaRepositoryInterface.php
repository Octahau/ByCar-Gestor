<?php

namespace App\Repositories\Contracts;

use App\Models\Venta;
use Illuminate\Database\Eloquent\Collection;

interface VentaRepositoryInterface
{
    public function findByVehiculo(int $vehiculoId): ?Venta;

    public function getHistoricas(int $meses = 12): Collection;

    public function getByMonth(int $month, int $year): Collection;

    public function getGananciaTotal(int $year): float;

    public function getGananciaByMonth(int $month, int $year): float;

    public function create(array $data): Venta;

    public function update(int $id, array $data): bool;

    public function delete(int $id): bool;
}
