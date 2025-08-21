<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Vehiculo;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;
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
            "marca" => $request->input("marca"),
            "modelo" => $request->input("modelo"),
            "dominio" => $request->input("dominio"),
            "anio" => $request->input("anio"),
            "color" => $request->input("color"),
            "kilometraje" => $request->input("kilometraje"),
            "precioARS" => $request->input("precioARS"),
            "precioUSD" => $request->input("precioUSD"),
            "ubicacion" => $request->input("ubicacion"),
        ];

        try {
            $validated = Validator::make($datos, [
                'marca' => 'nullable|string|max:255',
                'modelo' => 'nullable|string|max:255',
                'dominio' => 'nullable|string|max:255|unique:vehiculos,dominio',
                'anio' => 'nullable|integer|min:1900|max:' . date('Y'),
                'color' => 'nullable|string|max:50',
                'kilometraje' => 'nullable|numeric|min:0',
                'precioARS' => 'nullable|numeric|min:0',
                'precioUSD' => 'nullable|numeric|min:0',
                'ubicacion' => 'nullable|string|max:255',
            ])->validate();

            logger('Datos validados antes de crear:', $validated);

            $vehiculo = Vehiculo::create($validated);

            return response()->json(['success' => true, 'vehiculo' => $vehiculo]);
        } catch (\Illuminate\Database\QueryException $e) {
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
        $vehiculos = Vehiculo::all();

        $formatted = $vehiculos->map(function ($v) {
            return [
                'id' => $v->vehicle_id,
                'marca' => $v->marca,
                'modelo' => $v->modelo,
                'dominio' => $v->dominio,
                'anio' => (int) $v->anio,
                'color' => $v->color,
                'kilometraje' => (int) $v->kilometraje,
                'precioARS' => (int) $v->precioARS,
                'precioUSD' => (int) $v->precioUSD,
                'ingreso' => $v->created_at->toDateString(),
                'ubicacion' => $v->ubicacion,
            ];
        });

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'vehiculos' => $formatted,
            ]);
        }
        
        return Inertia::render('vehiculos', [
            'vehiculos' => $formatted,
        ]);
    }
}
