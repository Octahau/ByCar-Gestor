<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use App\Enums\UserType;
use \Illuminate\Database\QueryException;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('registro');
    }
    /* public function store(Request $request)
    {
        try{
            $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'dni' => 'required|string|max:20|unique:users,dni',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6|confirmed', // Laravel busca password_confirmation
        ]);

        $user = User::create([
            'name' => $validated['nombre'] . ' ' . $validated['apellido'],
            'dni' => $validated['dni'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'tipo' => UserType::Empleado->value, // usamos el enum
        ]);

        // Retornar JSON con el usuario creado
        return response()->json([
            'success' => true,
            'message' => 'Usuario registrado correctamente',
            'user' => $user,
        ], 201);
        }
        catch (QueryException $e) {
            logger('Error DB: ', ['message' => $e->getMessage()]);
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
        
    } */
}
