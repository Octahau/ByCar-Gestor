<?php

namespace App\Services;

use App\DTOs\HistoricData;
use App\DTOs\StatsData;
use App\Models\GastoCorriente;
use App\Models\GastoVehiculo;
use App\Models\Vehiculo;
use App\Repositories\Contracts\VentaRepositoryInterface;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class StatsService
{
    public function __construct(
        private VentaRepositoryInterface $ventaRepository
    ) {}

    public function getVehiculosStats(): StatsData
    {
        $cacheKey = 'stats.vehiculos.'.now()->format('Y-m');

        return Cache::remember($cacheKey, 300, function () {
            $mesActual = now()->month;
            $añoActual = now()->year;
            $mesAnterior = $mesActual == 1 ? 12 : $mesActual - 1;
            $añoAnterior = $mesActual == 1 ? $añoActual - 1 : $añoActual;

            $cantidadActual = Vehiculo::where('estado', 'disponible')
                ->whereMonth('fecha', $mesActual)
                ->whereYear('fecha', $añoActual)
                ->count();

            $cantidadAnterior = Vehiculo::where('estado', 'disponible')
                ->whereMonth('fecha', $mesAnterior)
                ->whereYear('fecha', $añoAnterior)
                ->count();

            $porcentaje = $this->calcularPorcentaje($cantidadActual, $cantidadAnterior);

            return new StatsData(
                cantidad: $cantidadActual,
                porcentaje: $porcentaje,
                tendencia: $porcentaje >= 0 ? 'positiva' : 'negativa'
            );
        });
    }

    public function getVentasStats(): StatsData
    {
        $cacheKey = 'stats.ventas.'.now()->format('Y-m');

        return Cache::remember('stats.ventas.'.now()->format('Y-m'), 300, function () {
            $mesActual = now()->month;
            $añoActual = now()->year;
            $mesAnterior = $mesActual == 1 ? 12 : $mesActual - 1;
            $añoAnterior = $mesActual == 1 ? $añoActual - 1 : $añoActual;

            $cantidadActual = $this->ventaRepository->getByMonth($mesActual, $añoActual)->count();
            $cantidadAnterior = $this->ventaRepository->getByMonth($mesAnterior, $añoAnterior)->count();

            $porcentaje = $this->calcularPorcentaje($cantidadActual, $cantidadAnterior);

            return new StatsData(
                cantidad: $cantidadActual,
                porcentaje: $porcentaje,
                tendencia: $porcentaje >= 0 ? 'positiva' : 'negativa'
            );
        });
    }

    public function getGastosCorrientesStats(): StatsData
    {
        $cacheKey = 'stats.gastos.corrientes.'.now()->format('Y-m');

        return Cache::remember($cacheKey, 300, function () {
            $mesActual = now()->month;
            $añoActual = now()->year;
            $mesAnterior = $mesActual == 1 ? 12 : $mesActual - 1;
            $añoAnterior = $mesActual == 1 ? $añoActual - 1 : $añoActual;

            $totalActual = GastoCorriente::whereMonth('fecha', $mesActual)
                ->whereYear('fecha', $añoActual)
                ->sum('importe');

            $totalAnterior = GastoCorriente::whereMonth('fecha', $mesAnterior)
                ->whereYear('fecha', $añoAnterior)
                ->sum('importe');

            $porcentaje = $this->calcularPorcentaje($totalActual, $totalAnterior);

            return new StatsData(
                cantidad: 0,
                porcentaje: $porcentaje,
                tendencia: $porcentaje >= 0 ? 'positiva' : 'negativa',
                importe: $totalActual
            );
        });
    }

    public function getGastosVehiculosStats(): StatsData
    {
        $cacheKey = 'stats.gastos.vehiculos.'.now()->format('Y-m');

        return Cache::remember($cacheKey, 300, function () {
            $mesActual = now()->month;
            $añoActual = now()->year;
            $mesAnterior = $mesActual == 1 ? 12 : $mesActual - 1;
            $añoAnterior = $mesActual == 1 ? $añoActual - 1 : $añoActual;

            $totalActual = GastoVehiculo::whereMonth('fecha', $mesActual)
                ->whereYear('fecha', $añoActual)
                ->sum(DB::raw('CAST(importe_ars AS DECIMAL)'));

            $totalAnterior = GastoVehiculo::whereMonth('fecha', $mesAnterior)
                ->whereYear('fecha', $añoAnterior)
                ->sum(DB::raw('CAST(importe_ars AS DECIMAL)'));

            $porcentaje = $this->calcularPorcentaje($totalActual, $totalAnterior);

            return new StatsData(
                cantidad: 0,
                porcentaje: $porcentaje,
                tendencia: $porcentaje >= 0 ? 'positiva' : 'negativa',
                importe: $totalActual
            );
        });
    }

    public function getGastosCorrientesHistoricos(): array
    {
        $cacheKey = 'historicos.gastos.corrientes';

        return Cache::remember($cacheKey, 600, function () {
            $datos = [];
            $fechaActual = now();

            for ($i = 11; $i >= 0; $i--) {
                $fecha = $fechaActual->copy()->subMonths($i);
                $mes = $fecha->format('Y-m');
                $nombreMes = $fecha->format('M Y');

                $total = GastoCorriente::whereYear('fecha', $fecha->year)
                    ->whereMonth('fecha', $fecha->month)
                    ->sum('importe');

                $datos[] = new HistoricData($mes, $nombreMes, (float) $total);
            }

            return array_map(fn ($data) => $data->toArray(), $datos);
        });
    }

    public function getGastosVehiculosHistoricos(): array
    {
        $cacheKey = 'historicos.gastos.vehiculos';

        return Cache::remember($cacheKey, 600, function () {
            $datos = [];
            $fechaActual = now();

            for ($i = 11; $i >= 0; $i--) {
                $fecha = $fechaActual->copy()->subMonths($i);
                $mes = $fecha->format('Y-m');
                $nombreMes = $fecha->format('M Y');

                $total = GastoVehiculo::whereYear('fecha', $fecha->year)
                    ->whereMonth('fecha', $fecha->month)
                    ->sum('importe_ars');

                $datos[] = new HistoricData($mes, $nombreMes, (float) $total);
            }

            return array_map(fn ($data) => $data->toArray(), $datos);
        });
    }

    public function getVentasHistoricas(): array
    {
        $cacheKey = 'historicos.ventas';

        return Cache::remember($cacheKey, 600, function () {
            $datos = [];
            $fechaActual = now();

            for ($i = 11; $i >= 0; $i--) {
                $fecha = $fechaActual->copy()->subMonths($i);
                $mes = $fecha->format('Y-m');
                $nombreMes = $fecha->format('M Y');

                $total = $this->ventaRepository->getByMonth($fecha->month, $fecha->year)
                    ->sum('valor_venta_ars');

                $datos[] = new HistoricData($mes, $nombreMes, (float) $total);
            }

            return array_map(fn ($data) => $data->toArray(), $datos);
        });
    }

    public function getGananciaTotalAcumulada(): float
    {
        $cacheKey = 'ganancia.total.'.now()->year;

        return Cache::remember($cacheKey, 300, function () {
            return $this->ventaRepository->getGananciaTotal(now()->year);
        });
    }

    public function getGananciaMesActual(): StatsData
    {
        $cacheKey = 'ganancia.mes.'.now()->format('Y-m');

        return Cache::remember($cacheKey, 300, function () {
            $mesActual = now()->month;
            $añoActual = now()->year;
            $mesAnterior = $mesActual == 1 ? 12 : $mesActual - 1;
            $añoAnterior = $mesActual == 1 ? $añoActual - 1 : $añoActual;

            $gananciaActual = $this->ventaRepository->getGananciaByMonth($mesActual, $añoActual);
            $gananciaAnterior = $this->ventaRepository->getGananciaByMonth($mesAnterior, $añoAnterior);

            $porcentaje = $this->calcularPorcentaje($gananciaActual, $gananciaAnterior);

            return new StatsData(
                cantidad: 0,
                porcentaje: $porcentaje,
                tendencia: $porcentaje >= 0 ? 'positiva' : 'negativa',
                importe: $gananciaActual
            );
        });
    }

    public function getVentasGastosCombinados(): array
    {
        $cacheKey = 'combinados.ventas.gastos';

        return Cache::remember($cacheKey, 600, function () {
            $datos = [];
            $fechaActual = now();

            for ($i = 11; $i >= 0; $i--) {
                $fecha = $fechaActual->copy()->subMonths($i);
                $mes = $fecha->format('Y-m');
                $nombreMes = $fecha->format('M Y');

                // Obtener datos del mes
                $ventas = $this->ventaRepository->getByMonth($fecha->month, $fecha->year)
                    ->sum('valor_venta_ars');

                $gastosCorrientes = GastoCorriente::whereYear('fecha', $fecha->year)
                    ->whereMonth('fecha', $fecha->month)
                    ->sum('importe');

                $gastosVehiculos = GastoVehiculo::whereYear('fecha', $fecha->year)
                    ->whereMonth('fecha', $fecha->month)
                    ->sum('importe_ars');

                $costoAdquisicion = Vehiculo::whereYear('fecha', $fecha->year)
                    ->whereMonth('fecha', $fecha->month)
                    ->sum('precioARS');

                $gastoTotal = $gastosCorrientes + $gastosVehiculos + $costoAdquisicion;

                $datos[] = [
                    'mes' => $mes,
                    'nombreMes' => $nombreMes,
                    'ventas' => (float) $ventas,
                    'gastosCorrientes' => (float) $gastosCorrientes,
                    'gastosVehiculos' => (float) $gastosVehiculos,
                    'costoAdquisicion' => (float) $costoAdquisicion,
                    'gastoTotal' => (float) $gastoTotal,
                ];
            }

            return $datos;
        });
    }

    private function calcularPorcentaje(float $actual, float $anterior): float
    {
        if ($anterior > 0) {
            return (($actual - $anterior) / $anterior) * 100;
        } elseif ($actual > 0) {
            return 100;
        }

        return 0;
    }
}
