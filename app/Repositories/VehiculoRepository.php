<?php

namespace App\Repositories;

use App\Models\Vehiculo;
use App\Repositories\Contracts\VehiculoRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class VehiculoRepository implements VehiculoRepositoryInterface
{
    public function findByDominio(string $dominio): ?Vehiculo
    {
        return Vehiculo::where('dominio', strtoupper($dominio))->first();
    }

    public function getDisponibles(): Collection
    {
        return Vehiculo::where('estado', 'disponible')->get();
    }

    public function getByMonth(int $month, int $year): Collection
    {
        return Vehiculo::whereMonth('fecha', $month)
            ->whereYear('fecha', $year)
            ->get();
    }

    public function getConGastos(): Collection
    {
        return Vehiculo::with('gastos')->get();
    }

    public function create(array $data): Vehiculo
    {
        return Vehiculo::create($data);
    }

    public function findById(int $id): ?Vehiculo
    {
        return Vehiculo::where('vehiculo_id', $id)->first();
    }

    public function update(Vehiculo $vehiculo, array $data): Vehiculo
    {
        $vehiculo->update($data);

        return $vehiculo->fresh();
    }

    public function delete(int $id): bool
    {
        return Vehiculo::where('vehiculo_id', $id)->delete();
    }

    public function updateEstado(int $id, string $estado): bool
    {
        return Vehiculo::where('vehiculo_id', $id)->update(['estado' => $estado]);
    }
}
