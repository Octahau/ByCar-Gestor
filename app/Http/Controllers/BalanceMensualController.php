<?php

namespace App\Http\Controllers;

use App\Models\Venta;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BalanceMensualController extends Controller
{
    public function index(Request $request)
    {
        // Obtener el año del request o usar el año actual
        $año = $request->get('año', now()->year);

        // Obtener todas las ventas con los usuarios relacionados del año especificado
        $ventas = Venta::with('user')
            ->whereYear('fecha', $año)
            ->get();

        // Obtener todos los vendedores únicos
        $vendedores = $ventas->pluck('user.name')
            ->filter()
            ->unique()
            ->sort()
            ->values();

        // Obtener el rango de fechas de las ventas
        $fechas = $ventas->pluck('fecha')
            ->filter()
            ->sort()
            ->values();

        if ($fechas->isEmpty()) {
            return Inertia::render('BalanceMensual', [
                'balanceData' => [],
                'vendedores' => $vendedores,
                'meses' => [],
                'totales' => [],
            ]);
        }

        $fechaInicio = $fechas->first();
        $fechaFin = $fechas->last();

        // Generar todos los meses entre la fecha de inicio y fin
        $meses = [];
        $current = Carbon::parse($fechaInicio)->startOfMonth();
        $end = Carbon::parse($fechaFin)->startOfMonth();

        while ($current->lte($end)) {
            $meses[] = [
                'nombre' => $current->locale('es')->format('F Y'),
                'año' => $current->year,
                'mes' => $current->month,
                'fecha' => $current->format('Y-m'),
            ];
            $current->addMonth();
        }

        // Calcular datos por mes y vendedor
        $balanceData = [];
        $totales = [
            'vendedores' => [],
        ];

        // Inicializar totales por vendedor
        foreach ($vendedores as $vendedor) {
            $totales['vendedores'][$vendedor] = [
                'ventas' => 0,
                'valor_ars' => 0,
                'valor_usd' => 0,
            ];
        }

        foreach ($meses as $mes) {
            $mesData = [
                'mes' => $mes['nombre'],
                'año' => $mes['año'],
                'mes_numero' => $mes['mes'],
                'vendedores' => [],
            ];

            $mesTotal = [
                'ventas' => 0,
                'valor_ars' => 0,
                'valor_usd' => 0,
            ];

            foreach ($vendedores as $vendedor) {
                // Filtrar ventas del vendedor en este mes
                $ventasVendedor = $ventas->filter(function ($venta) use ($vendedor, $mes) {
                    return $venta->user &&
                           $venta->user->name === $vendedor &&
                           $venta->fecha &&
                           $venta->fecha->year === $mes['año'] &&
                           $venta->fecha->month === $mes['mes'];
                });

                $cantidadVentas = $ventasVendedor->count();
                $valorArs = $ventasVendedor->sum('valor_venta_ars');
                $valorUsd = $ventasVendedor->sum('valor_venta_usd');

                $mesData['vendedores'][$vendedor] = [
                    'ventas' => $cantidadVentas,
                    'valor_ars' => $valorArs,
                    'valor_usd' => $valorUsd,
                ];

                // Acumular totales del mes
                $mesTotal['ventas'] += $cantidadVentas;
                $mesTotal['valor_ars'] += $valorArs;
                $mesTotal['valor_usd'] += $valorUsd;

                // Acumular totales por vendedor
                $totales['vendedores'][$vendedor]['ventas'] += $cantidadVentas;
                $totales['vendedores'][$vendedor]['valor_ars'] += $valorArs;
                $totales['vendedores'][$vendedor]['valor_usd'] += $valorUsd;
            }

            $mesData['total'] = $mesTotal;
            $balanceData[] = $mesData;
        }

        // Calcular totales generales
        $totales['general'] = [
            'ventas' => array_sum(array_column($totales['vendedores'], 'ventas')),
            'valor_ars' => array_sum(array_column($totales['vendedores'], 'valor_ars')),
            'valor_usd' => array_sum(array_column($totales['vendedores'], 'valor_usd')),
        ];

        return Inertia::render('BalanceMensual', [
            'balanceData' => $balanceData,
            'vendedores' => $vendedores,
            'meses' => $meses,
            'totales' => $totales,
            'añoActual' => $año,
            'añosDisponibles' => $this->getAñosDisponibles(),
        ]);
    }

    private function getAñosDisponibles()
    {
        // Obtener todos los años únicos de las ventas (PostgreSQL compatible)
        $años = Venta::selectRaw('EXTRACT(YEAR FROM fecha) as año')
            ->distinct()
            ->orderBy('año', 'desc')
            ->pluck('año')
            ->filter()
            ->values();

        // Si no hay ventas, devolver solo el año actual
        if ($años->isEmpty()) {
            return [now()->year];
        }

        return $años->toArray();
    }
}
