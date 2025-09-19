<?php

namespace App\Http\Controllers;

use App\Enums\EstadoVehiculo;
use App\Models\Vehiculo;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class VehiculoController extends Controller
{
    /*
     * Store a newly created vehicle in storage.
     */
    public function store(Request $request)
    {
        logger('Datos recibidos:', $request->all());

        $datos = [
            'marca' => $request->input('marca'),
            'modelo' => $request->input('modelo'),
            'dominio' => $request->input('dominio'),
            'anio' => $request->input('anio'),
            'color' => $request->input('color'),
            'kilometraje' => $request->input('kilometraje'),
            'precioARS' => $request->input('precioARS'),
            'precioUSD' => $request->input('precioUSD'),
            'precio_venta_sugerido_ars' => $request->input('precio_venta_sugerido_ars'),
            'precio_venta_sugerido_usd' => $request->input('precio_venta_sugerido_usd'),
            'ubicacion' => $request->input('ubicacion'),
            'fecha' => $request->input('fecha'),
            'infoAuto' => $request->input('infoAuto'),
            'tipo' => $request->input('tipo'),
        ];

        try {
            $validated = Validator::make($datos, [
                'marca' => 'nullable|string|max:255',
                'modelo' => 'nullable|string|max:255',
                'dominio' => 'nullable|string|max:255|unique:vehiculos,dominio',
                'anio' => 'nullable|integer|min:1900|max:'.date('Y'),
                'color' => 'nullable|string|max:50',
                'kilometraje' => 'nullable|numeric|min:0',
                'precioARS' => 'nullable|numeric|min:0',
                'precioUSD' => 'nullable|numeric|min:0',
                'precio_venta_sugerido_ars' => 'nullable|numeric|min:0',
                'precio_venta_sugerido_usd' => 'nullable|numeric|min:0',
                'ubicacion' => 'nullable|string|max:255',
                'fecha' => 'nullable|date',
                'infoAuto' => 'nullable|string|max:255',
                'tipo' => 'nullable|string|in:auto,camioneta',
            ])->validate();

            if (Vehiculo::where('dominio', $datos['dominio'])->exists()) {
                return response()->json([
                    'success' => false,
                    'error' => 'Ya existe un vehículo con ese dominio.',
                ], 400);
            }

            $validated['estado'] = EstadoVehiculo::DISPONIBLE->value;

            $vehiculo = Vehiculo::create($validated);

            return response()->json([
                'success' => true,
                'vehiculo' => [
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
                ],
            ]);

        } catch (QueryException $e) {
            logger('Error DB: ', ['message' => $e->getMessage()]);

            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        } catch (\Exception $e) {
            logger('Error general: ', ['message' => $e->getMessage()]);

            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display a listing of the vehicles.
     */
    public function index(Request $request)
    {
        $vehiculos = Vehiculo::with('gastos')->get();

        $formatted = $vehiculos->map(function ($v) {
            // Calcular gastos acumulados
            $gastosArs = $v->gastos->sum('importe_ars') ?? 0;
            $gastosUsd = $v->gastos->sum('importe_usd') ?? 0;

            return [
                'id' => $v->vehiculo_id, // asegurate que la columna se llama "id" en la tabla
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
    public function update(Request $request, $id)
    {
        logger('Datos recibidos para actualizar:', $request->all());

        $datos = [
            'marca' => $request->input('marca'),
            'modelo' => $request->input('modelo'),
            'dominio' => $request->input('dominio'),
            'anio' => $request->input('anio'),
            'color' => $request->input('color'),
            'kilometraje' => $request->input('kilometraje'),
            'precioARS' => $request->input('precioARS'),
            'precioUSD' => $request->input('precioUSD'),
            'precio_venta_sugerido_ars' => $request->input('precio_venta_sugerido_ars'),
            'precio_venta_sugerido_usd' => $request->input('precio_venta_sugerido_usd'),
            'ubicacion' => $request->input('ubicacion'),
            'fecha' => $request->input('fecha'),
            'infoAuto' => $request->input('infoAuto'),
            'estado' => $request->input('estado'),
            'tipo' => $request->input('tipo'),
        ];

        try {
            $vehiculo = Vehiculo::where('vehiculo_id', $id)->first();

            if (! $vehiculo) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vehículo no encontrado',
                ], 404);
            }

            $validated = Validator::make($datos, [
                'marca' => 'nullable|string|max:255',
                'modelo' => 'nullable|string|max:255',
                'dominio' => 'nullable|string|max:255|unique:vehiculos,dominio,'.$vehiculo->vehiculo_id.',vehiculo_id',
                'anio' => 'nullable|integer|min:1900|max:'.date('Y'),
                'color' => 'nullable|string|max:50',
                'kilometraje' => 'nullable|numeric|min:0',
                'precioARS' => 'nullable|numeric|min:0',
                'precioUSD' => 'nullable|numeric|min:0',
                'precio_venta_sugerido_ars' => 'nullable|numeric|min:0',
                'precio_venta_sugerido_usd' => 'nullable|numeric|min:0',
                'ubicacion' => 'nullable|string|max:255',
                'fecha' => 'nullable|date',
                'infoAuto' => 'nullable|string|max:255',
                'estado' => 'nullable|string|max:50',
                'tipo' => 'nullable|string|in:auto,camioneta',
            ])->validate();

            $vehiculo->update($validated);

            return response()->json([
                'success' => true,
                'vehiculo' => [
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
                ],
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors(),
            ], 422);
        } catch (QueryException $e) {
            logger('Error DB: ', ['message' => $e->getMessage()]);

            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        } catch (\Exception $e) {
            logger('Error general: ', ['message' => $e->getMessage()]);

            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
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
