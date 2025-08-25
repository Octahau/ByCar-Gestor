<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Vehiculo;
use App\Models\Venta;

use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class VentasController extends Controller
{
    public function index()
    {
        return Inertia::render('ventas'); // resources/js/Pages/ventas.tsx
    }

    public function store(Request $request)
    {
        // Validación
        $validator = Validator::make($request->all(), [
            'vehicle_id'       => 'required|exists:vehiculos,vehicle_id',
            'procedencia'       => 'nullable|string|max:255',
            'valor_venta_ars'   => 'nullable|numeric',
            'valor_venta_usd'   => 'nullable|numeric',
            'ganancia_real_ars' => 'nullable|numeric',
            'ganancia_real_usd' => 'nullable|numeric',
            'fecha_venta'       => 'nullable|date',
            'vendedor'          => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors(),
            ], 422);
        }

        // Crear venta
        $venta = Venta::create($validator->validated());

        return response()->json([
            'success' => true,
            'venta'   => $venta,
            'message' => 'Venta registrada correctamente',
        ]);
    }
    

}