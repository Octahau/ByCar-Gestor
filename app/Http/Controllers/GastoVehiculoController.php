<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use \Illuminate\Database\QueryException;
use App\Models\GastoVehiculo;
use App\Models\User;
use \Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use App\Models\Vehiculo;

class GastoVehiculoController extends Controller
{
    public function index()
    {
        $gastos = GastoVehiculo::with('vehiculo', 'user')->get();

        $formatted = $gastos->map(function ($g) {
            $usuario = $g->user;
            $vehiculo = $g->vehiculo;
            return [
                'id' => $g->gasto_vehiculo_id,
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

            $vehiculo = Vehiculo::where('dominio', $data['dominio'])->first();
            if (!$vehiculo) {
                Log::error('Vehiculo no encontrado', $data['dominio']);

                return response()->json([
                    'success' => false,
                    'errors'  => ['vehiculo' => ['Vehiculo no encontrado']],
                ], 404);
            }

            $importe_ars = floatval($data['importe']) ?? 0;
            $importe_usd =  $importe_ars ?? 0;


            $fechaGasto = isset($data['fecha'])
                ? Carbon::parse($data['fecha'])->format('Y-m-d')
                : now()->format('Y-m-d');


            $gasto = GastoVehiculo::create([
                'vehiculo_id' => $vehiculo->vehiculo_id,
                'tipo_gasto' => $data['tipo_gasto'],
                'descripcion' => $data['descripcion'] ?? '',
                'user_id' => $usuario->id,
                'importe_ars' => $importe_ars,
                'importe_usd' => $importe_usd,
                'fecha' => $fechaGasto,
            ]);

            if (!$gasto) {
                Log::error('Error al crear el gasto vehiculo', $gasto);

                return response()->json([
                    'success' => false,
                    'message' => 'No se pudo registrar el gasto vehiculo',
                ], 500);
            }

            $formattedGasto = [
                'id' => $gasto->gasto_vehiculo_id,
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
                'data' => $formattedGasto
            ], 201);
        } catch (QueryException $e) {
            Log::error('Error de consulta al crear el gasto vehiculo', ['error' => $e->getMessage()]);

            return response()->json(
                [
                    'message' => 'Error al crear el gasto vehiculo',
                    'error' => $e->getMessage()
                ],
                500
            );
        }
    }

    public function getGastoTotal()
    {
        $totalArs = GastoVehiculo::sum('importe_ars');

        return response()->json([
            'success' => true,
            'importeTotalArs' => $totalArs,
        ]);
    }
}
