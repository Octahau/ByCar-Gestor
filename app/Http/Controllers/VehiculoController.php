<?php

namespace App\Http\Controllers;

use App\DTOs\ApiResponse;
use App\Http\Requests\StoreVehiculoRequest;
use App\Http\Requests\UpdateVehiculoRequest;
use App\Models\Vehiculo;
use App\Repositories\Contracts\VehiculoRepositoryInterface;
use Inertia\Inertia;

class VehiculoController extends Controller
{
    public function __construct(
        private VehiculoRepositoryInterface $vehiculoRepository
    ) {}

    /*
     * Store a newly created vehicle in storage.
     */
    public function store(StoreVehiculoRequest $request)
    {
        try {
            $data = $request->validated();
            $data['estado'] = \App\Enums\EstadoVehiculo::DISPONIBLE->value;

            $vehiculo = $this->vehiculoRepository->create($data);

            $formattedVehiculo = [
                'id' => $vehiculo->vehiculo_id,
                'marca' => $vehiculo->marca,
                'modelo' => $vehiculo->modelo,
                'dominio' => $vehiculo->dominio,
                'anio' => (int) $vehiculo->anio,
                'color' => $vehiculo->color,
                'kilometraje' => (int) $vehiculo->kilometraje,
                'precioARS' => (int) $vehiculo->precioARS,
                'precioUSD' => (int) $vehiculo->precioUSD,
                'precio_venta_sugerido_ars' => $vehiculo->precio_venta_sugerido_ars ? (float) $vehiculo->precio_venta_sugerido_ars : null,
                'precio_venta_sugerido_usd' => $vehiculo->precio_venta_sugerido_usd ? (float) $vehiculo->precio_venta_sugerido_usd : null,
                'ubicacion' => $vehiculo->ubicacion,
                'fecha' => $vehiculo->fecha,
                'infoAuto' => $vehiculo->infoAuto,
                'estado' => $vehiculo->estado,
                'tipo' => $vehiculo->tipo?->value ?? 'auto',
            ];

            return response()->json([
                'success' => true,
                'vehiculo' => $formattedVehiculo,
                'message' => 'Vehículo creado correctamente',
            ]);
        } catch (\Exception $e) {
            return ApiResponse::error('Error al crear vehículo: '.$e->getMessage());
        }
    }

    /**
     * Display a listing of the vehicles.
     */
    public function index()
    {
        $vehiculos = $this->vehiculoRepository->getConGastos();

        $formatted = $vehiculos->map(function ($v) {
            // Calcular gastos acumulados
            $gastosArs = $v->gastos->sum('importe_ars') ?? 0;
            $gastosUsd = $v->gastos->sum('importe_usd') ?? 0;

            return [
                'id' => $v->vehiculo_id,
                'marca' => $v->marca,
                'modelo' => $v->modelo,
                'dominio' => $v->dominio,
                'anio' => (int) $v->anio,
                'color' => $v->color,
                'kilometraje' => (int) $v->kilometraje,
                'precioARS' => (int) $v->precioARS,
                'precioUSD' => (int) $v->precioUSD,
                'precio_venta_sugerido_ars' => $v->precio_venta_sugerido_ars ? (float) $v->precio_venta_sugerido_ars : null,
                'precio_venta_sugerido_usd' => $v->precio_venta_sugerido_usd ? (float) $v->precio_venta_sugerido_usd : null,
                'ubicacion' => $v->ubicacion,
                'fecha' => $v->fecha,
                'infoAuto' => $v->infoAuto,
                'estado' => $v->estado,
                'tipo' => $v->tipo?->value ?? 'auto',
                'gastos_acumulados_ars' => (float) $gastosArs,
                'gastos_acumulados_usd' => (float) $gastosUsd,
            ];
        });

        return Inertia::render('vehiculos', [
            'vehiculos' => $formatted,
        ]);
    }

    public function getVehiculos()
    {
        // Obtener el mes actual y anterior
        $mesActual = now()->month;
        $añoActual = now()->year;

        $mesAnterior = $mesActual == 1 ? 12 : $mesActual - 1;
        $añoAnterior = $mesActual == 1 ? $añoActual - 1 : $añoActual;

        // Contar vehículos del mes actual
        $cantidadActual = Vehiculo::whereMonth('fecha', $mesActual)
            ->whereYear('fecha', $añoActual)
            ->count();

        // Contar vehículos del mes anterior
        $cantidadAnterior = Vehiculo::whereMonth('fecha', $mesAnterior)
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
     * Update the specified vehicle in storage.
     */
    public function update(UpdateVehiculoRequest $request, $id)
    {
        try {
            $vehiculo = $this->vehiculoRepository->findById($id);

            if (! $vehiculo) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vehículo no encontrado',
                ], 404);
            }

            $data = $request->validated();
            $this->vehiculoRepository->update($vehiculo, $data);

            $updatedVehiculo = $this->vehiculoRepository->findById($id);

            return response()->json([
                'success' => true,
                'vehiculo' => [
                    'id' => $updatedVehiculo->vehiculo_id,
                    'marca' => $updatedVehiculo->marca,
                    'modelo' => $updatedVehiculo->modelo,
                    'dominio' => $updatedVehiculo->dominio,
                    'anio' => (int) $updatedVehiculo->anio,
                    'color' => $updatedVehiculo->color,
                    'kilometraje' => (int) $updatedVehiculo->kilometraje,
                    'precioARS' => (int) $updatedVehiculo->precioARS,
                    'precioUSD' => (int) $updatedVehiculo->precioUSD,
                    'precio_venta_sugerido_ars' => $updatedVehiculo->precio_venta_sugerido_ars ? (float) $updatedVehiculo->precio_venta_sugerido_ars : null,
                    'precio_venta_sugerido_usd' => $updatedVehiculo->precio_venta_sugerido_usd ? (float) $updatedVehiculo->precio_venta_sugerido_usd : null,
                    'ubicacion' => $updatedVehiculo->ubicacion,
                    'fecha' => $updatedVehiculo->fecha,
                    'infoAuto' => $updatedVehiculo->infoAuto,
                    'estado' => $updatedVehiculo->estado,
                    'tipo' => $updatedVehiculo->tipo?->value ?? 'auto',
                ],
                'message' => 'Vehículo actualizado correctamente',
            ]);

        } catch (\Exception $e) {
            return ApiResponse::error('Error al actualizar vehículo: '.$e->getMessage());
        }
    }

    /**
     * Remove the specified vehicle from storage.
     */
    public function destroy($id)
    {
        try {
            $vehiculo = Vehiculo::where('vehiculo_id', $id)->first();

            if (! $vehiculo) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vehículo no encontrado',
                ], 404);
            }

            // Verificar si el vehículo tiene ventas asociadas
            $ventasCount = \App\Models\Venta::where('vehiculo_id', $vehiculo->vehiculo_id)->count();
            if ($ventasCount > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede eliminar un vehículo que tiene ventas asociadas',
                ], 400);
            }

            // Eliminar gastos asociados primero (por si acaso)
            \App\Models\GastoVehiculo::where('vehiculo_id', $vehiculo->vehiculo_id)->delete();

            // Eliminar el vehículo
            $vehiculo->delete();

            return response()->json([
                'success' => true,
                'message' => 'Vehículo eliminado correctamente',
            ]);

        } catch (\Exception $e) {
            logger('Error al eliminar vehículo: ', ['message' => $e->getMessage()]);

            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar vehículo: '.$e->getMessage(),
            ], 500);
        }
    }
}
