<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use App\Enums\UserType;
use Illuminate\Http\JsonResponse;
use \Illuminate\Database\QueryException;
use Symfony\Component\HttpFoundation\Response;
use Inertia\Response as InertiaResponse;


class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): InertiaResponse
    {
        return Inertia::render('registro');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): Response
    {
        try {

            $validated = $request->validate([
                'nombre' => 'required|string|max:255',
                'apellido' => 'required|string|max:255',
                'dni' => 'required|string|max:20|unique:users,dni',
                'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
            ]);

            $user = User::create([
                'name' => $validated['nombre'] . ' ' . $validated['apellido'],
                'dni' => $validated['dni'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'tipo' =>  'Empleado',
            ]);

            event(new Registered($user));

            Auth::login($user);
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'user' => $user,
                    'redirect' => route('dashboard'),
                ]);
            }

            return redirect()->intended(route('dashboard'));
        } catch (QueryException $e) {
            logger('Error DB: ', ['message' => $e->getMessage()]);
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }
}
