<?php

namespace App\Http\Controllers;

use App\Models\GastoVehiculo;
use App\Models\User;
use App\Models\Vehiculo;
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class GastoVehiculoController extends Controller
{
    public function index()
    {
        $gastos = GastoVehiculo::with('vehiculo', 'user')->get();

        $formatted = $gastos->map(function ($g) {
            $usuario = $g->user;
            $vehiculo = $g->vehiculo;

            return [
                'id' => $g->id,
                'dominio' => $vehiculo ? $vehiculo->dominio : '',
                'operador' => $usuario ? $usuario->name : '',
                'tipo_gasto' => $g->tipo_gasto ?? '',
                'descripcion' => $g->descripcion ?? '',
                'importe_ars' => $g->importe_ars !== null ? floatval($g->importe_ars) : null,
                'importe_usd' => $g->importe_usd !== null ? floatval($g->importe_usd) : null,

                'fecha' => $g->fecha ? $g->fecha->format('Y-m-d') : '',
            ];
        });

        return Inertia::render('GastosVehiculo', [
            'gastos' => $formatted,
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'dominio' => 'required|string|max:20',
                'operador' => 'required|integer|exists:users,id',
                'tipo_gasto' => 'required|string|max:100',
                'descripcion' => 'nullable|string|max:255',
                'importe' => 'required|numeric|min:0',
                'fecha' => 'nullable|date',
            ]);

            if ($validator->fails()) {
                Log::error('Validación fallida en gasto vehiculo', $validator->errors()->toArray());

                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                ], 422);
            }

            $data = $validator->validated();

            $usuario = User::find(intval($data['operador']));
            if (! $usuario) {
                Log::error('Vendedor no encontrado', $data['operador']);

                return response()->json([
                    'success' => false,
                    'errors' => ['vendedor' => ['Vendedor no encontrado']],
                ], 404);
            }

            $vehiculo = Vehiculo::where('dominio', $data['dominio'])->first();
            if (! $vehiculo) {
                Log::error('Vehiculo no encontrado', $data['dominio']);

                return response()->json([
                    'success' => false,
                    'errors' => ['vehiculo' => ['Vehiculo no encontrado']],
                ], 404);
            }

            $importe_ars = floatval($data['importe']) ?? 0;
            $importe_usd = $importe_ars ?? 0;

            $fechaGasto = isset($data['fecha'])
                ? Carbon::parse($data['fecha'])->format('Y-m-d')
                : now()->format('Y-m-d');

            $gasto = GastoVehiculo::create([
                'vehiculo_id' => $vehiculo->id,
                'tipo_gasto' => $data['tipo_gasto'],
                'descripcion' => $data['descripcion'] ?? '',
                'operador' => $usuario->name,
                'importe_ars' => $importe_ars,
                'importe_usd' => $importe_usd,
                'fecha' => $fechaGasto,
            ]);

            if (! $gasto) {
                Log::error('Error al crear el gasto vehiculo', $gasto);

                return response()->json([
                    'success' => false,
                    'message' => 'No se pudo registrar el gasto vehiculo',
                ], 500);
            }

            $formattedGasto = [
                'id' => $gasto->id,
                'dominio' => $vehiculo->dominio ?? '',
                'fecha' => $gasto->fecha ? $gasto->fecha->format('Y-m-d') : '',
                'tipo_gasto' => $gasto->tipo_gasto ?? '',
                'descripcion' => $gasto->descripcion ?? '',
                'importe_ars' => $gasto->importe_ars !== null ? floatval($gasto->importe_ars) : null,
                'importe_usd' => $gasto->importe_usd !== null ? floatval($gasto->importe_usd) : null,
                'operador' => $usuario->name ?? '',
            ];

            return response()->json([
                'success' => true,
                'message' => 'Gasto vehiculo creado exitosamente',
                'data' => $formattedGasto,
            ], 201);
        } catch (QueryException $e) {
            Log::error('Error de consulta al crear el gasto vehiculo', ['error' => $e->getMessage()]);

            return response()->json(
                [
                    'message' => 'Error al crear el gasto vehiculo',
                    'error' => $e->getMessage(),
                ],
                500
            );
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'operador' => 'required|string|max:255',
                'tipo_gasto' => 'required|string|max:100',
                'descripcion' => 'nullable|string|max:255',
                'importe_ars' => 'nullable|numeric|min:0',
                'importe_usd' => 'nullable|numeric|min:0',
                'dominio' => 'nullable|string|max:20',
                'fecha' => 'required|date',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                ], 422);
            }

            $gasto = GastoVehiculo::find($id);
            if (! $gasto) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gasto no encontrado',
                ], 404);
            }

            $data = $validator->validated();

            $gasto->update([
                'operador' => $data['operador'],
                'tipo_gasto' => $data['tipo_gasto'],
                'descripcion' => $data['descripcion'] ?? '',
                'importe_ars' => $data['importe_ars'] ?? 0,
                'importe_usd' => $data['importe_usd'] ?? 0,
                'fecha' => $data['fecha'],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Gasto actualizado correctamente',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el gasto: '.$e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $gasto = GastoVehiculo::find($id);
            if (! $gasto) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gasto no encontrado',
                ], 404);
            }

            $gasto->delete();

            return response()->json([
                'success' => true,
                'message' => 'Gasto eliminado correctamente',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el gasto: '.$e->getMessage(),
            ], 500);
        }
    }

    public function getGastoTotal()
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
}
