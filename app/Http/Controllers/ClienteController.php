<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClienteController extends Controller
{
    public function index()
    {
        $clientes = Cliente::all();

        $formatted = $clientes->map(function ($v) {
            return [
                'id' => $v->cliente_id,
                'nombre' => $v->nombre ?? '',
                'dni' => $v->dni ?? '',
                'email' => $v->email ?? '',
                'telefono' => $v->telefono ?? '',
                'tipo' => $v->tipo->value ?? 'interesado',
                'observaciones' => $v->observaciones ?? '',
            ];
        });

        return Inertia::render('clientes', [
            'clientes' => $formatted,
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nombre' => 'required|string|max:255',
            'dni' => 'required|string|max:255|unique:clientes,dni',
            'email' => 'nullable|email|max:255',
            'telefono' => 'nullable|string|max:20',
            'tipo' => 'required|string|in:interesado,comprador',
            'observaciones' => 'nullable|string',
        ]);

        $cliente = Cliente::create($validatedData);

        return response()->json([
            'success' => true,
            'cliente' => [
                'id' => $cliente->cliente_id,
                'nombre' => $cliente->nombre,
                'dni' => $cliente->dni,
                'email' => $cliente->email,
                'telefono' => $cliente->telefono,
                'tipo' => $cliente->tipo->value,
                'observaciones' => $cliente->observaciones,
            ],
        ]);
    }

    public function update(Request $request, $id)
    {
        $cliente = Cliente::where('cliente_id', $id)->firstOrFail();

        $validatedData = $request->validate([
            'nombre' => 'required|string|max:255',
            'dni' => 'required|string|max:255|unique:clientes,dni,'.$cliente->cliente_id.',cliente_id',
            'email' => 'nullable|email|max:255',
            'telefono' => 'required|string|max:20',
            'tipo' => 'required|string|in:interesado,comprador',
            'observaciones' => 'nullable|string',
        ]);

        $cliente->update($validatedData);

        return response()->json([
            'success' => true,
            'cliente' => [
                'id' => $cliente->cliente_id,
                'nombre' => $cliente->nombre,
                'dni' => $cliente->dni,
                'email' => $cliente->email,
                'telefono' => $cliente->telefono,
                'tipo' => $cliente->tipo->value,
                'observaciones' => $cliente->observaciones,
            ],
        ]);
    }

    public function destroy($id)
    {
        $cliente = Cliente::where('cliente_id', $id)->firstOrFail();
        $cliente->delete();

        return response()->json([
            'success' => true,
            'message' => 'Cliente eliminado exitosamente',
        ]);
    }
}
