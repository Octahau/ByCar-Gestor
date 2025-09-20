<?php

namespace App\Repositories\Contracts;

use App\Models\Vehiculo;
use Illuminate\Database\Eloquent\Collection;

interface VehiculoRepositoryInterface
{
    public function findByDominio(string $dominio): ?Vehiculo;

    public function getDisponibles(): Collection;

    public function getByMonth(int $month, int $year): Collection;

    public function getConGastos(): Collection;

    public function create(array $data): Vehiculo;

    public function findById(int $id): ?Vehiculo;

    public function update(Vehiculo $vehiculo, array $data): Vehiculo;

    public function delete(int $id): bool;

    public function updateEstado(int $id, string $estado): bool;
}
