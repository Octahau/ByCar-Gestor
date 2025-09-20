<?php

namespace App\Services;

use App\DTOs\GananciaCalculada;
use App\DTOs\VentaData;
use App\Enums\TipoCliente;
use App\Exceptions\ClienteNotFoundException;
use App\Exceptions\VehiculoNotFoundException;
use App\Models\GastoVehiculo;
use App\Models\User;
use App\Repositories\Contracts\ClienteRepositoryInterface;
use App\Repositories\Contracts\VehiculoRepositoryInterface;
use App\Repositories\Contracts\VentaRepositoryInterface;

class VentaService
{
    public function __construct(
        private VentaRepositoryInterface $ventaRepository,
        private VehiculoRepositoryInterface $vehiculoRepository,
        private ClienteRepositoryInterface $clienteRepository
    ) {}

    public function crearVenta(VentaData $ventaData): array
    {
        // Validar cliente
        $cliente = $this->clienteRepository->findByDni($ventaData->dniCliente);
        if (! $cliente) {
            throw new ClienteNotFoundException($ventaData->dniCliente);
        }

        // Validar vehículo
        $vehiculo = $this->vehiculoRepository->findByDominio($ventaData->dominio);
        if (! $vehiculo) {
            throw new VehiculoNotFoundException($ventaData->dominio);
        }

        // Validar vendedor
        $vendedor = User::find($ventaData->vendedorId);
        if (! $vendedor) {
            throw new \Exception('Vendedor no encontrado');
        }

        // Calcular ganancia
        $ganancia = $this->calcularGanancia($vehiculo, $ventaData);

        // Crear venta
        $venta = $this->ventaRepository->create([
            'cliente_id' => $cliente->cliente_id,
            'vehiculo_id' => $vehiculo->vehiculo_id,
            'usuario_id' => $vendedor->id,
            'procedencia' => $ventaData->procedencia,
            'valor_venta_ars' => $ventaData->valorVentaArs,
            'valor_venta_usd' => $ventaData->valorVentaUsd,
            'ganancia_real_ars' => $ganancia->ars,
            'ganancia_real_usd' => $ganancia->usd,
            'fecha' => $ventaData->fecha,
        ]);

        // Actualizar estado del vehículo
        $this->vehiculoRepository->updateEstado($vehiculo->vehiculo_id, 'VENDIDO');

        // Actualizar tipo del cliente
        $this->clienteRepository->updateTipo($cliente->cliente_id, TipoCliente::Comprador->value);

        return [
            'venta' => $venta,
            'ganancia' => $ganancia,
        ];
    }

    public function calcularGanancia($vehiculo, VentaData $ventaData): GananciaCalculada
    {
        $compraArs = (float) ($vehiculo->precioARS ?? 0);
        $compraUsd = (float) ($vehiculo->precioUSD ?? 0);

        // Calcular gastos del vehículo
        $gastos = GastoVehiculo::where('vehiculo_id', $vehiculo->vehiculo_id)->get();
        $gastoArs = $gastos->sum(function ($gasto) {
            return (float) $gasto->importe_ars;
        });
        $gastoUsd = $gastos->sum(function ($gasto) {
            return (float) $gasto->importe_usd;
        });

        $gananciaArs = $ventaData->valorVentaArs - $compraArs - $gastoArs;
        $gananciaUsd = $ventaData->valorVentaUsd - $compraUsd - $gastoUsd;

        $porcentajeArs = $compraArs > 0 ? ($gananciaArs / $compraArs) * 100 : 0;
        $porcentajeUsd = $compraUsd > 0 ? ($gananciaUsd / $compraUsd) * 100 : 0;

        return new GananciaCalculada(
            ars: $gananciaArs,
            usd: $gananciaUsd,
            porcentajeArs: $porcentajeArs,
            porcentajeUsd: $porcentajeUsd
        );
    }
}
