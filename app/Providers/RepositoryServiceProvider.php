<?php

namespace App\Providers;

use App\Repositories\ClienteRepository;
use App\Repositories\Contracts\ClienteRepositoryInterface;
use App\Repositories\Contracts\VehiculoRepositoryInterface;
use App\Repositories\Contracts\VentaRepositoryInterface;
use App\Repositories\VehiculoRepository;
use App\Repositories\VentaRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(VentaRepositoryInterface::class, VentaRepository::class);
        $this->app->bind(VehiculoRepositoryInterface::class, VehiculoRepository::class);
        $this->app->bind(ClienteRepositoryInterface::class, ClienteRepository::class);
    }

    public function boot(): void
    {
        //
    }
}
