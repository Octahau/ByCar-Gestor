<?php

namespace App\Repositories;

use App\Models\Cliente;
use App\Repositories\Contracts\ClienteRepositoryInterface;

class ClienteRepository implements ClienteRepositoryInterface
{
    public function findByDni(string $dni): ?Cliente
    {
        return Cliente::where('dni', $dni)->first();
    }

    public function create(array $data): Cliente
    {
        return Cliente::create($data);
    }

    public function update(int $id, array $data): bool
    {
        return Cliente::where('cliente_id', $id)->update($data);
    }

    public function delete(int $id): bool
    {
        return Cliente::where('cliente_id', $id)->delete();
    }

    public function updateTipo(int $id, string $tipo): bool
    {
        return Cliente::where('cliente_id', $id)->update(['tipo' => $tipo]);
    }
}
