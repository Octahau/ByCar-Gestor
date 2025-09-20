<?php

namespace App\Http\Controllers;

use App\Services\StatsService;

class ResumenController extends Controller
{
    public function __construct(
        private StatsService $statsService
    ) {}

    /**
     * Obtener resumen de vehículos disponibles
     */
    public function getVehiculos()
    {
        try {
            $stats = $this->statsService->getVehiculosStats();

            return response()->json($stats->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener estadísticas de vehículos: '.$e->getMessage()], 500);
        }
    }

    /**
     * Obtener resumen de ventas realizadas
     */
    public function getVentas()
    {
        try {
            $stats = $this->statsService->getVentasStats();

            return response()->json($stats->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener estadísticas de ventas: '.$e->getMessage()], 500);
        }
    }

    /**
     * Obtener resumen de gastos corrientes
     */
    public function getGastosCorrientes()
    {
        try {
            $stats = $this->statsService->getGastosCorrientesStats();

            return response()->json($stats->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener estadísticas de gastos corrientes: '.$e->getMessage()], 500);
        }
    }

    /**
     * Obtener resumen de gastos de vehículos
     */
    public function getGastosVehiculos()
    {
        try {
            $stats = $this->statsService->getGastosVehiculosStats();

            return response()->json($stats->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener estadísticas de gastos de vehículos: '.$e->getMessage()], 500);
        }
    }

    /**
     * Obtener datos históricos de gastos corrientes
     */
    public function getGastosCorrientesHistoricos()
    {
        try {
            $data = $this->statsService->getGastosCorrientesHistoricos();

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener datos históricos de gastos corrientes: '.$e->getMessage()], 500);
        }
    }

    /**
     * Obtener datos históricos de gastos de vehículos
     */
    public function getGastosVehiculosHistoricos()
    {
        try {
            $data = $this->statsService->getGastosVehiculosHistoricos();

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener datos históricos de gastos de vehículos: '.$e->getMessage()], 500);
        }
    }

    /**
     * Obtener datos históricos de ventas
     */
    public function getVentasHistoricas()
    {
        try {
            $data = $this->statsService->getVentasHistoricas();

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener datos históricos de ventas: '.$e->getMessage()], 500);
        }
    }

    /**
     * Obtener ganancia total acumulada del año actual
     */
    public function getGananciaTotalAcumulada()
    {
        try {
            $gananciaTotal = $this->statsService->getGananciaTotalAcumulada();

            return response()->json(['gananciaTotal' => $gananciaTotal]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener ganancia total acumulada: '.$e->getMessage()], 500);
        }
    }

    /**
     * Obtener ganancia del mes actual
     */
    public function getGananciaMesActual()
    {
        try {
            $stats = $this->statsService->getGananciaMesActual();

            return response()->json($stats->toArray());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener ganancia del mes actual: '.$e->getMessage()], 500);
        }
    }

    /**
     * Obtener datos combinados de ventas y gastos totales para el gráfico superpuesto
     */
    public function getVentasGastosCombinados()
    {
        try {
            $data = $this->statsService->getVentasGastosCombinados();

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener datos combinados: '.$e->getMessage()], 500);
        }
    }
}
