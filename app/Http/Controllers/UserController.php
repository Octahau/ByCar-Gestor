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
        return Inertia::render('usuarios');
    }
    public function empleados()
    {
        $empleados = User::where('tipo', 'empleado')
            ->get(['id', 'name']); 
        return response()->json($empleados);
    }
}
