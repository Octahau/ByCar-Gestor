<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Vehiculo;
use App\Models\Venta;
use App\Models\Cliente;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use \Carbon\Carbon;
use Exception;
use \Illuminate\Database\QueryException;


class VentasController extends Controller
{
    public function index()
    {
        // Cargamos las ventas con los vehículos relacionados
        $ventas = Venta::with('vehiculo')->get();

        $formatted = $ventas->map(function ($v) {
            $vehiculo = $v->vehiculo; // relación correcta
            return [
                'id' => $v->venta_id,
                'marca' => $vehiculo->marca ?? '',
                'modelo' => $vehiculo->modelo ?? '',
                'dominio' => $vehiculo->dominio ?? '',
                'procedencia' => $v->procedencia ?? '',
                'valor_venta_ars' => $v->valor_venta_ars ?? 0,
                'valor_venta_usd' => $v->valor_venta_usd ?? 0,
                'ganancia_real_ars' => $v->ganancia_real_ars ?? 0,
                'ganancia_real_usd' => $v->ganancia_real_usd ?? 0,
                'fecha' => $v->fecha ? $v->fecha->format('Y-m-d') : '',
                'vendedor' =>  '',
            ];
        });

        return Inertia::render('ventas', [
            'ventas' => $formatted,
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'dniCliente'       => 'required|string|max:255',
                'dominio'          => 'required|string|max:255',
                'procedencia'      => 'nullable|string|max:255',
                'valor_venta_ars'  => 'nullable|numeric',
                'valor_venta_usd'  => 'nullable|numeric',
                'fecha_venta'      => 'nullable|date',
                'vendedor'         => 'nullable|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors'  => $validator->errors(),
                ], 422);
            }

            $data = $validator->validated();

            $cliente = Cliente::where('dni', $data['dniCliente'])->first();
            if (!$cliente) {
                return response()->json([
                    'success' => false,
                    'errors'  => ['dniCliente' => ['Cliente no encontrado']],
                ], 404);
            }

            $vehiculo = Vehiculo::where('dominio', strtoupper($data['dominio']))->first();
            if (!$vehiculo) {
                return response()->json([
                    'success' => false,
                    'errors'  => ['dominio' => ['Vehículo no encontrado']],
                ], 404);
            }

            $compraArs = $vehiculo->precioARS ?? 0;
            $compraUsd = $vehiculo->precioUSD ?? 0;

            $gananciaRealUsd = $data['valor_venta_usd'] - $compraUsd;
            $gananciaRealArs =  $data['valor_venta_ars'] - $compraArs;

            $fechaVenta = isset($data['fecha_venta'])
                ? Carbon::parse($data['fecha_venta'])->format('Y-m-d')
                : now()->format('Y-m-d');

            $venta = Venta::create([
                'cliente_id'        => $cliente->cliente_id,
                'vehicle_id'       => $vehiculo->vehicle_id,
                'procedencia'       => $data['procedencia'] ?? null,
                'valor_venta_ars'   => $data['valor_venta_ars'] ?? 0,
                'valor_venta_usd'   => $data['valor_venta_usd'] ?? 0,
                'ganancia_real_ars' => $gananciaRealArs,
                'ganancia_real_usd' => $gananciaRealUsd,
                'fecha'       => $fechaVenta ?? now(),
            ]);

            if ($venta) {
                $vehiculo->estado = 'VENDIDO';
                $vehiculo->save();
            }
            return response()->json([
                'success' => true,
                'venta'   => $venta,
                'message' => 'Venta registrada correctamente',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al registrar la venta: ' . $e->getMessage(),
            ], 500);
        }
    }
}
