'use client';
import { DataTable } from '@/components/data-table'; // ajusta el path según tu proyecto
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AddVehiculoModal from '@/components/vehicles/modal-vehicle';
import AppLayout from '@/layouts/app-layout';
import { Vehiculo } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Vehiculos() {
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
    const [search, setSearch] = useState('');

    // Cargar vehículos desde backend al montar
    const fetchVehiculos = async () => {
        try {
            const response = await fetch('/api/vehiculos'); // Ajusta la ruta según tu API
            const result = await response.json();

            if (result.success) {
                // Mapear datos para que coincidan con la estructura de Vehiculo
                const formatted = result.vehiculos.map((v: any) => ({
                    id: v.vehicle_id,
                    marca: v.marca,
                    modelo: v.modelo,
                    dominio: v.dominio,
                    anio: Number(v.anio),
                    color: v.color,
                    kilometraje: Number(v.kilometraje),
                    precioARS: Number(v.precioARS),
                    precioUSD: Number(v.precioUSD),
                    ubicacion: v.ubicacion ?? '',
                }));
                setVehiculos(formatted);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchVehiculos();
    }, []);

    // Función que se pasa al modal para agregar un vehículo al estado en tiempo real
    const handleAddVehiculo = (nuevoVehiculo: Vehiculo) => {
        setVehiculos((prev) => [nuevoVehiculo, ...prev]);
    };

    // Filtrar datos según el input de búsqueda
    const filteredData = vehiculos.filter((v) => Object.values(v).some((val) => String(val).toLowerCase().includes(search.toLowerCase())));

    return (
        <AppLayout breadcrumbs={[{ title: 'Vehículos', href: '/vehiculos' }]}>
            <Head title="Vehículos" />
            <div className="p-4">
                <h1 className="mb-4 text-xl font-bold">Vehículos disponibles</h1>

                {/* Botones y buscador */}
                <div className="mb-4 flex flex-col items-start justify-between gap-2 lg:flex-row lg:items-center">
                    <div className="flex gap-2">
                        <AddVehiculoModal
                            onVehiculoCreado={(nuevoVehiculo) => {
                                const formatted: Vehiculo = {
                                    id: nuevoVehiculo.id,
                                    marca: nuevoVehiculo.marca,
                                    modelo: nuevoVehiculo.modelo,
                                    dominio: nuevoVehiculo.dominio,
                                    anio: Number(nuevoVehiculo.anio),
                                    color: nuevoVehiculo.color,
                                    kilometraje: Number(nuevoVehiculo.kilometraje),
                                    precioARS: Number(nuevoVehiculo.precioARS),
                                    precioUSD: Number(nuevoVehiculo.precioUSD),
                                    ubicacion: '',
                                };
                                setVehiculos((prev) => [formatted, ...prev]);
                            }}
                        />
                        <Button onClick={() => alert('Abrir filtros avanzados')}>Filtros / Buscar</Button>
                    </div>
                    <div className="mt-2 lg:mt-0">
                        <Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full lg:w-64" />
                    </div>
                </div>

                {/* Tabla */}
                <DataTable data={filteredData} />
            </div>
        </AppLayout>
    );
}
