<?php

use App\Models\User;

it('can access balance mensual page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/balance-mensual')
        ->assertSuccessful();
});

it('guests are redirected to login', function () {
    $this->get('/balance-mensual')->assertRedirect('/login');
});
