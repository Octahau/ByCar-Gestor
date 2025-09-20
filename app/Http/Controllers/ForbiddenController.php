<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class ForbiddenController extends Controller
{
    public function index()
    {
        return Inertia::render('403');
    }
}
