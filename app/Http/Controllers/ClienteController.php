<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ClienteController extends Controller
{
    public function index()
    {
        return inertia('clientes'); // resources/js/Pages/clientes.tsx
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nombre'   => 'required|string|max:255',
            'dni'      => 'required|string|max:255|unique:clientes,dni',
            'email'    => 'nullable|email|max:255',
            'telefono' => 'nullable|string|max:20',
        ]);

        $cliente = \App\Models\Cliente::create($validatedData);

        return response()->json([
            'success' => true,
            'cliente' => $cliente,
        ]);
    }
}
