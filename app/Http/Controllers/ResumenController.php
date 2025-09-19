<?php

namespace App\Http\Controllers;

use App\Models\GastoCorriente;
use App\Models\GastoVehiculo;
use App\Models\Vehiculo;
use App\Models\Venta;

class ResumenController extends Controller
{
    /**
     * Obtener resumen de vehículos disponibles
     */
    public function getVehiculos()
    {
        // Obtener el mes actual y anterior
        $mesActual = now()->month;
        $añoActual = now()->year;

        $mesAnterior = $mesActual == 1 ? 12 : $mesActual - 1;
        $añoAnterior = $mesActual == 1 ? $añoActual - 1 : $añoActual;

        // Contar vehículos disponibles del mes actual
        $cantidadActual = Vehiculo::where('estado', 'disponible')
            ->whereMonth('fecha', $mesActual)
            ->whereYear('fecha', $añoActual)
            ->count();

        // Contar vehículos disponibles del mes anterior
        $cantidadAnterior = Vehiculo::where('estado', 'disponible')
            ->whereMonth('fecha', $mesAnterior)
            ->whereYear('fecha', $añoAnterior)
            ->count();

        // Calcular porcentaje de cambio
        $porcentaje = 0;
        if ($cantidadAnterior > 0) {
            $porcentaje = (($cantidadActual - $cantidadAnterior) / $cantidadAnterior) * 100;
        } elseif ($cantidadActual > 0) {
            $porcentaje = 100; // Si no había vehículos el mes anterior pero sí este mes
        }

        return response()->json([
            'cantidad' => $cantidadActual,
            'porcentaje' => round($porcentaje, 1),
            'tendencia' => $porcentaje >= 0 ? 'positiva' : 'negativa',
        ]);
    }

    /**
     * Obtener resumen de ventas realizadas
     */
    public function getVentas()
    {
        // Obtener el mes actual y anterior
        $mesActual = now()->month;
        $añoActual = now()->year;

        $mesAnterior = $mesActual == 1 ? 12 : $mesActual - 1;
        $añoAnterior = $mesActual == 1 ? $añoActual - 1 : $añoActual;

        // Contar ventas del mes actual
        $cantidadActual = Venta::whereMonth('fecha', $mesActual)
            ->whereYear('fecha', $añoActual)
            ->count();

        // Contar ventas del mes anterior
        $cantidadAnterior = Venta::whereMonth('fecha', $mesAnterior)
            ->whereYear('fecha', $añoAnterior)
            ->count();

        // Calcular porcentaje de cambio
        $porcentaje = 0;
        if ($cantidadAnterior > 0) {
            $porcentaje = (($cantidadActual - $cantidadAnterior) / $cantidadAnterior) * 100;
        } elseif ($cantidadActual > 0) {
            $porcentaje = 100; // Si no había ventas el mes anterior pero sí este mes
        }

        return response()->json([
            'cantidad' => $cantidadActual,
            'porcentaje' => round($porcentaje, 1),
            'tendencia' => $porcentaje >= 0 ? 'positiva' : 'negativa',
        ]);
    }

    /**
     * Obtener resumen de gastos corrientes
     */
    public function getGastosCorrientes()
    {
        // Obtener el mes actual y anterior
        $mesActual = now()->month;
        $añoActual = now()->year;

        $mesAnterior = $mesActual == 1 ? 12 : $mesActual - 1;
        $añoAnterior = $mesActual == 1 ? $añoActual - 1 : $añoActual;

        // Sumar gastos del mes actual
        $totalActual = GastoCorriente::whereMonth('fecha', $mesActual)
            ->whereYear('fecha', $añoActual)
            ->sum('importe');

        // Sumar gastos del mes anterior
        $totalAnterior = GastoCorriente::whereMonth('fecha', $mesAnterior)
            ->whereYear('fecha', $añoAnterior)
            ->sum('importe');

        // Calcular porcentaje de cambio
        $porcentaje = 0;
        if ($totalAnterior > 0) {
            $porcentaje = (($totalActual - $totalAnterior) / $totalAnterior) * 100;
        } elseif ($totalActual > 0) {
            $porcentaje = 100; // Si no había gastos el mes anterior pero sí este mes
        }

        return response()->json([
            'success' => true,
            'importeTotal' => $totalActual,
            'porcentaje' => round($porcentaje, 1),
            'tendencia' => $porcentaje >= 0 ? 'positiva' : 'negativa',
        ]);
    }

    /**
     * Obtener resumen de gastos de vehículos
     */
    public function getGastosVehiculos()
    {
        // Obtener el mes actual y anterior
        $mesActual = now()->month;
        $añoActual = now()->year;

        $mesAnterior = $mesActual == 1 ? 12 : $mesActual - 1;
        $añoAnterior = $mesActual == 1 ? $añoActual - 1 : $añoActual;

        // Sumar gastos del mes actual
        $totalActual = GastoVehiculo::whereMonth('fecha', $mesActual)
            ->whereYear('fecha', $añoActual)
            ->sum('importe_ars');

        // Sumar gastos del mes anterior
        $totalAnterior = GastoVehiculo::whereMonth('fecha', $mesAnterior)
            ->whereYear('fecha', $añoAnterior)
            ->sum('importe_ars');

        // Calcular porcentaje de cambio
        $porcentaje = 0;
        if ($totalAnterior > 0) {
            $porcentaje = (($totalActual - $totalAnterior) / $totalAnterior) * 100;
        } elseif ($totalActual > 0) {
            $porcentaje = 100; // Si no había gastos el mes anterior pero sí este mes
        }

        return response()->json([
            'success' => true,
            'importeTotalArs' => $totalActual,
            'porcentaje' => round($porcentaje, 1),
            'tendencia' => $porcentaje >= 0 ? 'positiva' : 'negativa',
        ]);
    }

    /**
     * Obtener datos históricos de gastos corrientes
     */
    public function getGastosCorrientesHistoricos()
    {
        // Obtener datos de los últimos 12 meses
        $datos = [];
        $fechaActual = now();

        for ($i = 11; $i >= 0; $i--) {
            $fecha = $fechaActual->copy()->subMonths($i);
            $mes = $fecha->format('Y-m');
            $nombreMes = $fecha->format('M Y');

            $total = GastoCorriente::whereYear('fecha', $fecha->year)
                ->whereMonth('fecha', $fecha->month)
                ->sum('importe');

            $datos[] = [
                'mes' => $mes,
                'nombreMes' => $nombreMes,
                'total' => (float) $total,
            ];
        }

        return response()->json([
            'success' => true,
            'data' => $datos,
        ]);
    }

    /**
     * Obtener datos históricos de gastos de vehículos
     */
    public function getGastosVehiculosHistoricos()
    {
        // Obtener datos de los últimos 12 meses
        $datos = [];
        $fechaActual = now();

        for ($i = 11; $i >= 0; $i--) {
            $fecha = $fechaActual->copy()->subMonths($i);
            $mes = $fecha->format('Y-m');
            $nombreMes = $fecha->format('M Y');

            $total = GastoVehiculo::whereYear('fecha', $fecha->year)
                ->whereMonth('fecha', $fecha->month)
                ->sum('importe_ars');

            $datos[] = [
                'mes' => $mes,
                'nombreMes' => $nombreMes,
                'total' => (float) $total,
            ];
        }

        return response()->json([
            'success' => true,
            'data' => $datos,
        ]);
    }

    /**
     * Obtener datos históricos de ventas
     */
    public function getVentasHistoricas()
    {
        // Obtener datos de los últimos 12 meses
        $datos = [];
        $fechaActual = now();

        for ($i = 11; $i >= 0; $i--) {
            $fecha = $fechaActual->copy()->subMonths($i);
            $mes = $fecha->format('Y-m');
            $nombreMes = $fecha->format('M Y');

            $totalVentas = Venta::whereYear('fecha', $fecha->year)
                ->whereMonth('fecha', $fecha->month)
                ->sum('valor_venta_ars');

            $datos[] = [
                'mes' => $mes,
                'nombreMes' => $nombreMes,
                'total' => (float) $totalVentas,
            ];
        }

        return response()->json([
            'success' => true,
            'data' => $datos,
        ]);
    }

    /**
     * Obtener ganancia total acumulada
     */
    public function getGananciaTotalAcumulada()
    {
        // Sumar todas las ganancias reales de todas las ventas
        $gananciaTotal = Venta::sum('ganancia_real_ars');

        return response()->json([
            'success' => true,
            'gananciaTotal' => (float) $gananciaTotal,
        ]);
    }

    /**
     * Obtener ganancia del mes actual
     */
    public function getGananciaMesActual()
    {
        // Obtener el mes actual
        $mesActual = now()->month;
        $añoActual = now()->year;

        // Sumar ganancias del mes actual
        $gananciaActual = Venta::whereMonth('fecha', $mesActual)
            ->whereYear('fecha', $añoActual)
            ->sum('ganancia_real_ars');

        // Sumar ganancias del mes anterior para comparación
        $mesAnterior = $mesActual == 1 ? 12 : $mesActual - 1;
        $añoAnterior = $mesActual == 1 ? $añoActual - 1 : $añoActual;

        $gananciaAnterior = Venta::whereMonth('fecha', $mesAnterior)
            ->whereYear('fecha', $añoAnterior)
            ->sum('ganancia_real_ars');

        // Calcular porcentaje de cambio
        $porcentaje = 0;
        if ($gananciaAnterior > 0) {
            $porcentaje = (($gananciaActual - $gananciaAnterior) / $gananciaAnterior) * 100;
        } elseif ($gananciaActual > 0) {
            $porcentaje = 100; // Si no había ganancias el mes anterior pero sí este mes
        }

        return response()->json([
            'success' => true,
            'gananciaMes' => (float) $gananciaActual,
            'porcentaje' => round($porcentaje, 1),
            'tendencia' => $porcentaje >= 0 ? 'positiva' : 'negativa',
        ]);
    }
}
