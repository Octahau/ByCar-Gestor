<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use \Illuminate\Database\QueryException;
use App\Models\GastoCorriente;
use App\Models\User;
use \Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class GastosCorrientesController extends Controller
{
    public function index()
    {
        $gastos = GastoCorriente::with( 'user')->get();

        $formatted = $gastos->map(function ($g) {
            $user = $g->user;
            return [
                'id' => $g->gastos_corrientes_id,
                'fecha' => $g->fecha ? $g->fecha->format('Y-m-d') : '',
                'motivo' => $g->motivo ?? '',
                'descripcion' => $g->descripcion ?? '',
                'importe' => number_format($g->importe, 2, ',', '.'),
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
                'motivo' => 'required|string|max:255',
                'descripcion' => 'required|string|max:255',
                'importe' => 'required|string|max:255',
                'fondo' => 'required|string|max:255',
                'operador' => 'required|string|max:255',
            ]);

            if ($validator->fails()) {
                Log::error('Validación fallida en gasto corriente', $validator->errors()->toArray());

                return response()->json([
                    'success' => false,
                    'errors'  => $validator->errors(),
                ], 422);
            }

            $data = $validator->validated();

            $usuario = User::find(intval($data['operador']));
            if (!$usuario) {
                Log::error('Vendedor no encontrado', $data['operador']);

                return response()->json([
                    'success' => false,
                    'errors'  => ['vendedor' => ['Vendedor no encontrado']],
                ], 404);
            }

            $importe = floatval($data['importe']) ?? 0;
            $fechaVenta = isset($data['fecha'])
                ? Carbon::parse($data['fecha'])->format('Y-m-d')
                : now()->format('Y-m-d');


            $gasto = GastoCorriente::create([
                'fecha' => $fechaVenta,
                'motivo' => $data['motivo'],
                'descripcion' => $data['descripcion'],
                'importe' => $importe,
                'fondo' => $data['fondo'],
                'usuario_id' => $usuario->id,
            ]);
            if (!$gasto) {
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
                'data' => $formattedGasto
            ], 201);
        } catch (QueryException $e) {
            Log::error('Error de consulta al crear el gasto corriente', ['error' => $e->getMessage()]);

            return response()->json(
                [
                    'message' => 'Error al crear el gasto corriente',
                    'error' => $e->getMessage()
                ],
                500
            );
        }
    }

    public function getGastoTotal()
    {
        // Suma total de los gastos corrientes en ARS
        $totalArs = GastoCorriente::sum('importe');

        return response()->json([
            'success' => true,
            'importeTotal' => $totalArs,
        ]);
    }
}
