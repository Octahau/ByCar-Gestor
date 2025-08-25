<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;


class UserController extends Controller{
    public function index()
    {
        return Inertia::render('registro'); 
    }
    public function store(Request $request)
    {
        // Validación de datos
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'dni' => 'required|string|max:20|unique:users,dni',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6|confirmed', // Laravel espera password_confirmation
        ]);

        // Crear usuario
        $user = User::create([
            'name' => $validated['nombre'] . ' ' . $validated['apellido'],
            'dni' => $validated['dni'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'tipo' => 'empleado', // valor por defecto si no lo mandás desde el form
        ]);

        return response()->json([
            'message' => 'Usuario registrado correctamente',
            'user' => $user
        ], 201);
    }
}