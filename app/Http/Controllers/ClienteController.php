<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Cliente;
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
            ];
        });

        return Inertia::render('clientes', [
            'clientes' => $formatted,
        ]);    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nombre'   => 'required|string|max:255',
            'dni'      => 'required|string|max:255|unique:clientes,dni',
            'email'    => 'nullable|email|max:255',
            'telefono' => 'nullable|string|max:20',
        ]);

        $cliente = Cliente::create($validatedData);

        return response()->json([
            'success' => true,
            'cliente' => $cliente,
        ]);
    }
}
