<?php

use App\Models\User;

it('gets vehicle stats successfully', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/vehiculos-cantidad')
        ->assertSuccessful()
        ->assertJsonStructure([
            'cantidad',
            'porcentaje',
            'tendencia',
        ]);
});

it('gets sales stats successfully', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/ventas-cantidad')
        ->assertSuccessful()
        ->assertJsonStructure([
            'cantidad',
            'porcentaje',
            'tendencia',
        ]);
});

it('gets current expenses stats successfully', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/gastos-corrientes-cantidad')
        ->assertSuccessful()
        ->assertJsonStructure([
            'cantidad',
            'porcentaje',
            'tendencia',
            'importe',
        ]);
});

it('gets vehicle expenses stats successfully', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/gasto-vehiculo-cantidad')
        ->assertSuccessful()
        ->assertJsonStructure([
            'cantidad',
            'porcentaje',
            'tendencia',
            'importe',
        ]);
});

it('gets historical current expenses data', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/gastos-corrientes-historicos')
        ->assertSuccessful()
        ->assertJsonStructure([
            '*' => [
                'mes',
                'nombreMes',
                'total',
            ],
        ]);
});

it('gets historical vehicle expenses data', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/gastos-vehiculos-historicos')
        ->assertSuccessful()
        ->assertJsonStructure([
            '*' => [
                'mes',
                'nombreMes',
                'total',
            ],
        ]);
});

it('gets historical sales data', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/ventas-historicas')
        ->assertSuccessful()
        ->assertJsonStructure([
            '*' => [
                'mes',
                'nombreMes',
                'total',
            ],
        ]);
});

it('gets combined sales and expenses data', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/ventas-gastos-combinados')
        ->assertSuccessful()
        ->assertJsonStructure([
            '*' => [
                'mes',
                'nombreMes',
                'ventas',
                'gastosCorrientes',
                'gastosVehiculos',
                'costoAdquisicion',
                'gastoTotal',
            ],
        ]);
});

it('gets total accumulated profit', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/ganancia-total-acumulada')
        ->assertSuccessful()
        ->assertJsonStructure([
            'gananciaTotal',
        ]);
});

it('gets current month profit', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/ganancia-mes-actual')
        ->assertSuccessful()
        ->assertJsonStructure([
            'cantidad',
            'porcentaje',
            'tendencia',
            'importe',
        ]);
});

it('requires authentication for all stats endpoints', function () {
    $this->get('/vehiculos-cantidad')->assertRedirect('/login');
    $this->get('/ventas-cantidad')->assertRedirect('/login');
    $this->get('/gastos-corrientes-cantidad')->assertRedirect('/login');
    $this->get('/gasto-vehiculo-cantidad')->assertRedirect('/login');
    $this->get('/gastos-corrientes-historicos')->assertRedirect('/login');
    $this->get('/gastos-vehiculos-historicos')->assertRedirect('/login');
    $this->get('/ventas-historicas')->assertRedirect('/login');
    $this->get('/ventas-gastos-combinados')->assertRedirect('/login');
    $this->get('/ganancia-total-acumulada')->assertRedirect('/login');
    $this->get('/ganancia-mes-actual')->assertRedirect('/login');
});
