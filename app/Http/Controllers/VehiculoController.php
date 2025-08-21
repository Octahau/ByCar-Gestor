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
                'marca' => 'required|string|max:255',
                'modelo' => 'required|string|max:255',
                'dominio' => 'required|string|max:255|unique:vehiculos,dominio',
                'anio' => 'required|integer|min:1900|max:' . date('Y'),
                'color' => 'required|string|max:50',
                'kilometraje' => 'required|numeric|min:0',
                'precioARS' => 'required|numeric|min:0',
                'precioUSD' => 'required|numeric|min:0',
                'ubicacion' => 'required|string|max:255',
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
            'año' => (int) $v->anio,
            'color' => $v->color,
            'kilometraje' => (int) $v->kilometraje,
            'km' => (int) $v->kilometraje,
            'precio_ars' => (int) $v->precioARS,
            'precio_usd' => (int) $v->precioUSD,
            'ingreso' => $v->created_at->toDateString(),
            'ubicacion' => $v->ubicacion,
        ];
    });

    return Inertia::render('vehiculos', [
        'vehiculos' => $formatted,
    ]);
}

}
