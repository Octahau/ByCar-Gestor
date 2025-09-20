<?php

namespace App\Repositories;

use App\Models\Venta;
use App\Repositories\Contracts\VentaRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class VentaRepository implements VentaRepositoryInterface
{
    public function findByVehiculo(int $vehiculoId): ?Venta
    {
        return Venta::where('vehiculo_id', $vehiculoId)->first();
    }

    public function getHistoricas(int $meses = 12): Collection
    {
        return Venta::select(
            DB::raw('YEAR(fecha) as year'),
            DB::raw('MONTH(fecha) as month'),
            DB::raw('SUM(valor_venta_ars) as total_ventas'),
            DB::raw('SUM(ganancia_real_ars) as total_ganancias')
        )
            ->where('fecha', '>=', now()->subMonths($meses))
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();
    }

    public function getByMonth(int $month, int $year): Collection
    {
        return Venta::whereMonth('fecha', $month)
            ->whereYear('fecha', $year)
            ->get();
    }

    public function getGananciaTotal(int $year): float
    {
        return Venta::whereYear('fecha', $year)
            ->sum('ganancia_real_ars');
    }

    public function getGananciaByMonth(int $month, int $year): float
    {
        return Venta::whereMonth('fecha', $month)
            ->whereYear('fecha', $year)
            ->sum('ganancia_real_ars');
    }

    public function create(array $data): Venta
    {
        return Venta::create($data);
    }

    public function update(int $id, array $data): bool
    {
        return Venta::where('venta_id', $id)->update($data);
    }

    public function delete(int $id): bool
    {
        return Venta::where('venta_id', $id)->delete();
    }
}
