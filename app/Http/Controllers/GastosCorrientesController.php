<?php

namespace App\Http\Controllers;

use App\Models\GastoCorriente;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class GastosCorrientesController extends Controller
{
    public function index()
    {
        $gastos = GastoCorriente::with('user')->get();

        $formatted = $gastos->map(function ($g) {
            $user = $g->user;

            return [
                'id' => $g->id,
                'fecha' => $g->fecha ? $g->fecha->format('Y-m-d') : '',
                'item' => $g->item ?? '',
                'descripcion' => $g->descripcion ?? '',
                'importe' => (float) $g->importe,
                'fondo' => $g->fondo ?? '',
                'operador' => $user->name ?? '',
            ];
        });

        return Inertia::render('GastosCorrientes', [
            'gastos' => $formatted,
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'fecha' => 'required|date',
                'item' => 'required|string|max:255',
                'descripcion' => 'required|string|max:255',
                'importe' => 'required|numeric|min:0',
                'fondo' => 'required|string|max:255',
                'usuario_id' => 'required|integer|exists:users,id',
            ]);

            if ($validator->fails()) {
                Log::error('Validación fallida en gasto corriente', $validator->errors()->toArray());

                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                ], 422);
            }

            $data = $validator->validated();

            $usuario = User::find($data['usuario_id']);
            if (! $usuario) {
                Log::error('Usuario no encontrado', ['usuario_id' => $data['usuario_id']]);

                return response()->json([
                    'success' => false,
                    'errors' => ['usuario_id' => ['Usuario no encontrado']],
                ], 404);
            }

            $importe = floatval($data['importe']) ?? 0;
            $fechaVenta = isset($data['fecha'])
                ? Carbon::parse($data['fecha'])->format('Y-m-d')
                : now()->format('Y-m-d');

            $gasto = GastoCorriente::create([
                'fecha' => $fechaVenta,
                'item' => $data['item'],
                'descripcion' => $data['descripcion'],
                'importe' => $importe,
                'fondo' => $data['fondo'],
                'usuario_id' => $data['usuario_id'],
            ]);
            if (! $gasto) {
                Log::error('Error al crear el gasto corriente', $gasto);

                return response()->json([
                    'success' => false,
                    'message' => 'No se pudo registrar el gasto corriente',
                ], 500);
            }

            $formattedGasto = [
                'id' => $gasto->gastos_corrientes_id,
                'fecha' => $gasto->fecha ? $gasto->fecha->format('Y-m-d') : '',
                'motivo' => $gasto->motivo ?? '',
                'descripcion' => $gasto->descripcion ?? '',
                'importe' => number_format($gasto->importe, 2, ',', '.'),
                'fondo' => $gasto->fondo ?? '',
                'operador' => $usuario->name ?? '',
            ];

            return response()->json([
                'success' => true,
                'message' => 'Gasto corriente creado exitosamente',
                'data' => $formattedGasto,
            ], 201);
        } catch (QueryException $e) {
            Log::error('Error de consulta al crear el gasto corriente', ['error' => $e->getMessage()]);

            return response()->json(
                [
                    'message' => 'Error al crear el gasto corriente',
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
                'fecha' => 'required|date',
                'item' => 'required|string|max:255',
                'descripcion' => 'nullable|string|max:255',
                'importe' => 'required|numeric|min:0',
                'fondo' => 'required|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                ], 422);
            }

            $gasto = GastoCorriente::find($id);
            if (! $gasto) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gasto no encontrado',
                ], 404);
            }

            $data = $validator->validated();

            $gasto->update([
                'fecha' => $data['fecha'],
                'item' => $data['item'],
                'descripcion' => $data['descripcion'] ?? '',
                'importe' => floatval($data['importe']),
                'fondo' => $data['fondo'],
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
            $gasto = GastoCorriente::find($id);
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

    public function getGastosHistoricos()
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
}
