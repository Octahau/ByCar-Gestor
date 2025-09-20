<?php

use App\Models\User;

it('can view users page', function () {
    $user = User::factory()->create(['tipo' => 'admin']);

    $this->actingAs($user)
        ->get('/usuarios')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('usuarios')
            ->has('usuarios')
        );
});

it('can create a new user', function () {
    $user = User::factory()->create(['tipo' => 'admin']);

    $userData = [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'dni' => '12345678',
        'tipo' => 'empleado',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ];

    $this->actingAs($user)
        ->post('/usuarios', $userData)
        ->assertSuccessful()
        ->assertJson([
            'success' => true,
            'message' => 'Usuario creado correctamente',
        ]);

    $this->assertDatabaseHas('users', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'dni' => '12345678',
        'tipo' => 'empleado',
    ]);
});

it('validates required fields when creating user', function () {
    $user = User::factory()->create(['tipo' => 'admin']);

    $this->actingAs($user)
        ->postJson('/usuarios', [])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['name', 'email', 'dni', 'tipo', 'password']);
});

it('validates unique email and dni when creating user', function () {
    $user = User::factory()->create(['tipo' => 'admin']);
    $existingUser = User::factory()->create(['email' => 'existing@example.com', 'dni' => '87654321']);

    $userData = [
        'name' => 'Test User',
        'email' => 'existing@example.com', // Same email
        'dni' => '87654321', // Same DNI
        'tipo' => 'empleado',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ];

    $this->actingAs($user)
        ->postJson('/usuarios', $userData)
        ->assertStatus(422)
        ->assertJsonValidationErrors(['email', 'dni']);
});

it('can view a specific user', function () {
    $user = User::factory()->create(['tipo' => 'admin']);
    $targetUser = User::factory()->create();

    $this->actingAs($user)
        ->get("/usuarios/{$targetUser->id}")
        ->assertSuccessful()
        ->assertJson([
            'success' => true,
            'user' => [
                'id' => $targetUser->id,
                'name' => $targetUser->name,
                'email' => $targetUser->email,
            ],
        ]);
});

it('can update a user', function () {
    $user = User::factory()->create(['tipo' => 'admin']);
    $targetUser = User::factory()->create();

    $updateData = [
        'name' => 'Updated Name',
        'email' => 'updated@example.com',
        'dni' => '11111111',
        'tipo' => 'admin',
    ];

    $this->actingAs($user)
        ->put("/usuarios/{$targetUser->id}", $updateData)
        ->assertSuccessful()
        ->assertJson([
            'success' => true,
            'message' => 'Usuario actualizado correctamente',
        ]);

    $this->assertDatabaseHas('users', [
        'id' => $targetUser->id,
        'name' => 'Updated Name',
        'email' => 'updated@example.com',
        'dni' => '11111111',
        'tipo' => 'admin',
    ]);
});

it('can update user password', function () {
    $user = User::factory()->create(['tipo' => 'admin']);
    $targetUser = User::factory()->create(['email' => 'target@example.com', 'dni' => '11111111']);

    $updateData = [
        'name' => 'Updated Name',
        'email' => 'updated@example.com',
        'dni' => '22222222',
        'tipo' => 'admin',
        'password' => 'newpassword123',
        'password_confirmation' => 'newpassword123',
    ];

    $this->actingAs($user)
        ->putJson("/usuarios/{$targetUser->id}", $updateData)
        ->assertSuccessful();

    $targetUser->refresh();
    expect(Hash::check('newpassword123', $targetUser->password))->toBeTrue();
});

it('can delete a user', function () {
    $user = User::factory()->create(['tipo' => 'admin']);
    $targetUser = User::factory()->create();

    $this->actingAs($user)
        ->delete("/usuarios/{$targetUser->id}")
        ->assertSuccessful()
        ->assertJson([
            'success' => true,
            'message' => 'Usuario eliminado correctamente',
        ]);

    $this->assertDatabaseMissing('users', [
        'id' => $targetUser->id,
    ]);
});

it('cannot delete own user', function () {
    $user = User::factory()->create(['tipo' => 'admin']);

    $this->actingAs($user)
        ->delete("/usuarios/{$user->id}")
        ->assertStatus(400)
        ->assertJson([
            'success' => false,
            'message' => 'No puedes eliminar tu propio usuario',
        ]);

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
    ]);
});

it('returns 404 when user not found', function () {
    $user = User::factory()->create(['tipo' => 'admin']);

    $this->actingAs($user)
        ->getJson('/usuarios/999999')
        ->assertStatus(404);
});

it('can get employees list', function () {
    $user = User::factory()->create(['tipo' => 'admin']); // Make sure user is admin
    $employee1 = User::factory()->create(['tipo' => 'empleado']);
    $employee2 = User::factory()->create(['tipo' => 'empleado']);
    $admin = User::factory()->create(['tipo' => 'admin']);

    $response = $this->actingAs($user)
        ->get('/empleados')
        ->assertSuccessful();

    $employees = $response->json();
    // Now includes both employees and admins (4 total: user, employee1, employee2, admin)
    expect($employees)->toHaveCount(4);
    
    // Verify that both employees and admins are included
    $names = collect($employees)->pluck('name')->toArray();
    expect($names)->toContain($employee1->name);
    expect($names)->toContain($employee2->name);
    expect($names)->toContain($admin->name);
    expect($names)->toContain($user->name);
});

it('blocks non-admin users from accessing users module', function () {
    $user = User::factory()->create(['tipo' => 'empleado']);

    $this->actingAs($user)
        ->get('/usuarios')
        ->assertRedirect('/403');
});

it('blocks non-admin users from accessing balance mensual', function () {
    $user = User::factory()->create(['tipo' => 'empleado']);

    $this->actingAs($user)
        ->get('/balance-mensual')
        ->assertRedirect('/403');
});
