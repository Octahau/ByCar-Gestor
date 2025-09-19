<?php

namespace App\Http\Controllers;

use App\Enums\TipoCliente;
use App\Models\Cliente;
use App\Models\GastoVehiculo;
use App\Models\User;
use App\Models\Vehiculo;
use App\Models\Venta;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class VentasController extends Controller
{
    public function index()
    {
        // Cargamos las ventas con los vehículos relacionados
        $ventas = Venta::with('vehiculo', 'user')->get();

        $formatted = $ventas->map(function ($v) {
            $vehiculo = $v->vehiculo;
            $user = $v->user;

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
                'vendedor' => $user->name ?? '',
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
                'dniCliente' => 'required|string|max:255',
                'dominio' => 'required|string|max:255',
                'procedencia' => 'nullable|string|max:255',
                'valor_venta_ars' => 'nullable|numeric',
                'valor_venta_usd' => 'nullable|numeric',
                'fecha_venta' => 'nullable|date',
                'vendedor' => 'nullable|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                ], 422);
            }

            $data = $validator->validated();

            $cliente = Cliente::where('dni', $data['dniCliente'])->first();
            if (! $cliente) {
                return response()->json([
                    'success' => false,
                    'errors' => ['dniCliente' => ['Cliente no encontrado']],
                ], 404);
            }

            $vehiculo = Vehiculo::where('dominio', strtoupper($data['dominio']))->first();
            if (! $vehiculo) {
                return response()->json([
                    'success' => false,
                    'errors' => ['dominio' => ['Vehículo no encontrado']],
                ], 404);
            }

            $usuario = User::find(intval($data['vendedor']));
            if (! $usuario) {
                return response()->json([
                    'success' => false,
                    'errors' => ['vendedor' => ['Vendedor no encontrado']],
                ], 404);
            }

            $compraArs = $vehiculo->precioARS ?? 0;
            $compraUsd = $vehiculo->precioUSD ?? 0;

            $valorVentaUsd = isset($data['valor_venta_usd']) ? floatval($data['valor_venta_usd']) : 0;
            $valorVentaArs = isset($data['valor_venta_ars']) ? floatval($data['valor_venta_ars']) : 0;

            $gastoArs = 0;
            $gastoUsd = 0;

            $gastosVehiculo = GastoVehiculo::where('vehiculo_id', $vehiculo->vehiculo_id)->get();

            foreach ($gastosVehiculo as $gasto) {
                $gastoArs += $gasto->importe_ars ?? 0;
                $gastoUsd += $gasto->importe_usd ?? 0;
            }

            $gananciaRealUsd = ($valorVentaUsd ?? 0) - ($compraUsd ?? 0) - $gastoUsd;
            $gananciaRealArs = ($valorVentaArs ?? 0) - ($compraArs ?? 0) - $gastoArs;

            $fechaVenta = isset($data['fecha_venta'])
                ? Carbon::parse($data['fecha_venta'])->format('Y-m-d')
                : now()->format('Y-m-d');

            $venta = Venta::create([
                'cliente_id' => $cliente->cliente_id,
                'vehiculo_id' => $vehiculo->vehiculo_id,
                'procedencia' => $data['procedencia'] ?? null,
                'valor_venta_ars' => $data['valor_venta_ars'] ?? 0,
                'valor_venta_usd' => $data['valor_venta_usd'] ?? 0,
                'ganancia_real_ars' => $gananciaRealArs,
                'ganancia_real_usd' => $gananciaRealUsd,
                'fecha' => $fechaVenta ?? now(),
                'usuario_id' => $usuario->id ?? null,
            ]);

            if ($venta) {
                // Actualizar el estado del vehículo a VENDIDO
                $vehiculo->estado = 'VENDIDO';
                $vehiculo->save();

                // Actualizar el tipo del cliente a COMPRADOR
                $cliente->tipo = TipoCliente::Comprador;
                $cliente->save();

                $formattedVenta = [
                    'id' => $venta->venta_id,
                    'marca' => $vehiculo->marca ?? '',
                    'modelo' => $vehiculo->modelo ?? '',
                    'dominio' => $vehiculo->dominio ?? '',
                    'procedencia' => $venta->procedencia ?? '',
                    'valor_venta_ars' => $venta->valor_venta_ars ?? 0,
                    'valor_venta_usd' => $venta->valor_venta_usd ?? 0,
                    'ganancia_real_ars' => $venta->ganancia_real_ars ?? 0,
                    'ganancia_real_usd' => $venta->ganancia_real_usd ?? 0,
                    'fecha' => $venta->fecha ? Carbon::parse($venta->fecha)->format('Y-m-d') : '',
                    'vendedor' => $usuario->name ?? '',
                ];

                return response()->json([
                    'success' => true,
                    'venta' => $formattedVenta,
                    'message' => 'Venta registrada correctamente',
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'No se pudo registrar la venta',
            ], 500);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al registrar la venta: '.$e->getMessage(),
            ], 500);
        }
    }

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

    public function getGananciaTotalAcumulada()
    {
        // Sumar todas las ganancias reales de todas las ventas
        $gananciaTotal = Venta::sum('ganancia_real_ars');

        return response()->json([
            'success' => true,
            'gananciaTotal' => (float) $gananciaTotal,
        ]);
    }

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

    /**
     * Display the detail page for a specific sale.
     */
    public function detalle($id)
    {
        try {
            $venta = Venta::with(['vehiculo', 'user', 'cliente'])->where('venta_id', $id)->first();

            if (! $venta) {
                return redirect()->route('ventas.index')->with('error', 'Venta no encontrada');
            }

            $vehiculo = $venta->vehiculo;
            $user = $venta->user;
            $cliente = $venta->cliente;

            // Obtener gastos del vehículo
            $gastosVehiculo = GastoVehiculo::where('vehiculo_id', $vehiculo->vehiculo_id)->get();
            $totalGastosArs = $gastosVehiculo->sum('importe_ars');
            $totalGastosUsd = $gastosVehiculo->sum('importe_usd');

            $ventaFormatted = [
                'id' => $venta->venta_id,
                'marca' => $vehiculo->marca ?? '',
                'modelo' => $vehiculo->modelo ?? '',
                'dominio' => $vehiculo->dominio ?? '',
                'procedencia' => $venta->procedencia ?? '',
                'valor_venta_ars' => $venta->valor_venta_ars ?? 0,
                'valor_venta_usd' => $venta->valor_venta_usd ?? 0,
                'ganancia_real_ars' => $venta->ganancia_real_ars ?? 0,
                'ganancia_real_usd' => $venta->ganancia_real_usd ?? 0,
                'fecha' => $venta->fecha ? $venta->fecha->format('Y-m-d') : '',
                'vendedor' => $user->name ?? '',
            ];

            return Inertia::render('ventas/detalle', [
                'venta' => $ventaFormatted,
            ]);

        } catch (Exception $e) {
            return redirect()->route('ventas.index')->with('error', 'Error al cargar la venta: '.$e->getMessage());
        }
    }

    /**
     * Display the specified sale with complete information.
     */
    public function show($id)
    {
        try {
            $venta = Venta::with(['vehiculo', 'user', 'cliente'])->where('venta_id', $id)->first();

            if (! $venta) {
                return response()->json([
                    'success' => false,
                    'message' => 'Venta no encontrada',
                ], 404);
            }

            $vehiculo = $venta->vehiculo;
            $user = $venta->user;
            $cliente = $venta->cliente;

            // Obtener gastos del vehículo
            $gastosVehiculo = GastoVehiculo::where('vehiculo_id', $vehiculo->vehiculo_id)->get();
            $totalGastosArs = $gastosVehiculo->sum('importe_ars');
            $totalGastosUsd = $gastosVehiculo->sum('importe_usd');

            $ventaCompleta = [
                'venta' => [
                    'id' => $venta->venta_id,
                    'procedencia' => $venta->procedencia ?? '',
                    'valor_venta_ars' => $venta->valor_venta_ars ?? 0,
                    'valor_venta_usd' => $venta->valor_venta_usd ?? 0,
                    'ganancia_real_ars' => $venta->ganancia_real_ars ?? 0,
                    'ganancia_real_usd' => $venta->ganancia_real_usd ?? 0,
                    'fecha' => $venta->fecha ? $venta->fecha->format('Y-m-d') : '',
                    'created_at' => $venta->created_at ? $venta->created_at->format('Y-m-d H:i:s') : '',
                ],
                'vehiculo' => [
                    'id' => $vehiculo->vehiculo_id,
                    'marca' => $vehiculo->marca ?? '',
                    'modelo' => $vehiculo->modelo ?? '',
                    'dominio' => $vehiculo->dominio ?? '',
                    'anio' => $vehiculo->anio ?? '',
                    'color' => $vehiculo->color ?? '',
                    'kilometraje' => $vehiculo->kilometraje ?? 0,
                    'precio_compra_ars' => $vehiculo->precioARS ?? 0,
                    'precio_compra_usd' => $vehiculo->precioUSD ?? 0,
                    'precio_venta_sugerido_ars' => $vehiculo->precio_venta_sugerido_ars ?? null,
                    'precio_venta_sugerido_usd' => $vehiculo->precio_venta_sugerido_usd ?? null,
                    'ubicacion' => $vehiculo->ubicacion ?? '',
                    'estado' => $vehiculo->estado ?? '',
                    'info_auto' => $vehiculo->infoAuto ?? '',
                    'fecha_ingreso' => $vehiculo->fecha ? $vehiculo->fecha->format('Y-m-d') : '',
                    'total_gastos_ars' => $totalGastosArs,
                    'total_gastos_usd' => $totalGastosUsd,
                ],
                'cliente' => [
                    'id' => $cliente->cliente_id,
                    'nombre' => $cliente->nombre ?? '',
                    'dni' => $cliente->dni ?? '',
                    'email' => $cliente->email ?? '',
                    'telefono' => $cliente->telefono ?? '',
                    'tipo' => $cliente->tipo->value ?? 'interesado',
                    'observaciones' => $cliente->observaciones ?? '',
                ],
                'vendedor' => [
                    'id' => $user->id,
                    'name' => $user->name ?? '',
                    'email' => $user->email ?? '',
                ],
            ];

            return response()->json([
                'success' => true,
                'data' => $ventaCompleta,
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener información de la venta: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified sale in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'procedencia' => 'nullable|string|max:255',
                'valor_venta_ars' => 'nullable|numeric',
                'valor_venta_usd' => 'nullable|numeric',
                'fecha' => 'nullable|date',
                'vendedor' => 'nullable|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                ], 422);
            }

            $data = $validator->validated();

            $venta = Venta::where('venta_id', $id)->first();

            if (! $venta) {
                return response()->json([
                    'success' => false,
                    'message' => 'Venta no encontrada',
                ], 404);
            }

            // Obtener el vehículo relacionado para recalcular ganancias
            $vehiculo = Vehiculo::where('vehiculo_id', $venta->vehiculo_id)->first();

            if (! $vehiculo) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vehículo relacionado no encontrado',
                ], 404);
            }

            // Recalcular ganancias si se actualizan los valores de venta
            $valorVentaUsd = isset($data['valor_venta_usd']) ? floatval($data['valor_venta_usd']) : $venta->valor_venta_usd;
            $valorVentaArs = isset($data['valor_venta_ars']) ? floatval($data['valor_venta_ars']) : $venta->valor_venta_ars;

            $compraArs = $vehiculo->precioARS ?? 0;
            $compraUsd = $vehiculo->precioUSD ?? 0;

            $gastoArs = 0;
            $gastoUsd = 0;

            $gastosVehiculo = GastoVehiculo::where('vehiculo_id', $vehiculo->vehiculo_id)->get();

            foreach ($gastosVehiculo as $gasto) {
                $gastoArs += $gasto->importe_ars ?? 0;
                $gastoUsd += $gasto->importe_usd ?? 0;
            }

            $gananciaRealUsd = $valorVentaUsd - $compraUsd - $gastoUsd;
            $gananciaRealArs = $valorVentaArs - $compraArs - $gastoArs;

            // Actualizar la venta
            $venta->update([
                'procedencia' => $data['procedencia'] ?? $venta->procedencia,
                'valor_venta_ars' => $valorVentaArs,
                'valor_venta_usd' => $valorVentaUsd,
                'ganancia_real_ars' => $gananciaRealArs,
                'ganancia_real_usd' => $gananciaRealUsd,
                'fecha' => isset($data['fecha']) ? Carbon::parse($data['fecha'])->format('Y-m-d') : $venta->fecha,
            ]);

            // Obtener el usuario actualizado si se proporciona
            $usuario = $venta->user;
            if (isset($data['vendedor']) && $data['vendedor']) {
                $usuario = User::where('name', $data['vendedor'])->first();
                if ($usuario) {
                    $venta->usuario_id = $usuario->id;
                    $venta->save();
                }
            }

            $formattedVenta = [
                'id' => $venta->venta_id,
                'marca' => $vehiculo->marca ?? '',
                'modelo' => $vehiculo->modelo ?? '',
                'dominio' => $vehiculo->dominio ?? '',
                'procedencia' => $venta->procedencia ?? '',
                'valor_venta_ars' => $venta->valor_venta_ars ?? 0,
                'valor_venta_usd' => $venta->valor_venta_usd ?? 0,
                'ganancia_real_ars' => $venta->ganancia_real_ars ?? 0,
                'ganancia_real_usd' => $venta->ganancia_real_usd ?? 0,
                'fecha' => $venta->fecha ? Carbon::parse($venta->fecha)->format('Y-m-d') : '',
                'vendedor' => $usuario->name ?? '',
            ];

            return response()->json([
                'success' => true,
                'venta' => $formattedVenta,
                'message' => 'Venta actualizada correctamente',
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar venta: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified sale from storage.
     */
    public function destroy($id)
    {
        try {
            $venta = Venta::where('venta_id', $id)->first();

            if (! $venta) {
                return response()->json([
                    'success' => false,
                    'message' => 'Venta no encontrada',
                ], 404);
            }

            // Obtener el vehículo y cliente relacionados
            $vehiculo = Vehiculo::where('vehiculo_id', $venta->vehiculo_id)->first();
            $cliente = Cliente::where('cliente_id', $venta->cliente_id)->first();

            if ($vehiculo) {
                // Cambiar el estado del vehículo de vuelta a 'disponible'
                $vehiculo->estado = 'disponible';
                $vehiculo->save();
            }

            if ($cliente) {
                // Revertir el tipo del cliente a 'interesado'
                $cliente->tipo = TipoCliente::Interesado;
                $cliente->save();
            }

            // Eliminar la venta
            $venta->delete();

            return response()->json([
                'success' => true,
                'message' => 'Venta eliminada correctamente',
            ]);

        } catch (\Exception $e) {
            logger('Error al eliminar venta: ', ['message' => $e->getMessage()]);

            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar venta: '.$e->getMessage(),
            ], 500);
        }
    }
}
