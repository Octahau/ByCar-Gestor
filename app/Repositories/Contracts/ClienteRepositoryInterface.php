<?php

namespace App\Repositories\Contracts;

use App\Models\Cliente;

interface ClienteRepositoryInterface
{
    public function findByDni(string $dni): ?Cliente;

    public function create(array $data): Cliente;

    public function update(int $id, array $data): bool;

    public function delete(int $id): bool;

    public function updateTipo(int $id, string $tipo): bool;
}
