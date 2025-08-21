'use client';
import { DataTable } from '@/components/data-table';
import FiltrosModal from '@/components/vehicles/modal-filtros';
import AddVehiculoModal from '@/components/vehicles/modal-vehicle';
import AppLayout from '@/layouts/app-layout';
import { Vehiculo } from '@/types';
import { Head } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function Vehiculos() {
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal de filtros
    const [open, setOpen] = useState(false);
    const [filtrosSeleccionados, setFiltrosSeleccionados] = useState<string[]>([]);
    const opcionesFiltros = ['Marca', 'Modelo', 'Color', 'Año', 'Ubicación'];

    const toggleFiltro = (filtro: string) => {
        setFiltrosSeleccionados((prev) => (prev.includes(filtro) ? prev.filter((f) => f !== filtro) : [...prev, filtro]));
    };

    const fetchVehiculos = async () => {
        try {
            const response = await fetch('/vehiculos', { headers: { Accept: 'application/json' } });
            const result = await response.json();

            if (result.success && Array.isArray(result.vehiculos)) {
                const formatted = result.vehiculos.map((v: any) => ({
                    id: v.id,
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
            } else {
                toast.error('Error al cargar los vehículos: ' + (result.message || ''));
            }
        } catch (error) {
            toast.error('Error al traer vehículos: ' + (error instanceof Error ? error.message : ''));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehiculos();
    }, []);

    const handleVehiculoCreado = (veh: Vehiculo) => {
        setVehiculos((prev) => [...prev, veh]);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Vehículos', href: '/vehiculos' }]}>
            <Head title="Vehículos" />
            <div className="p-4">
                <h1 className="mb-4 text-xl font-bold">Vehículos disponibles</h1>

                {/* Botones y buscador */}
                <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                    {/* Izquierda: botones */}
                    <div className="flex gap-2">
                        <AddVehiculoModal onVehiculoCreado={handleVehiculoCreado} />

                        {/* Botón de modificar columnas */}
                    </div>

                    {/* Derecha: Filtrar + input */}
                    <div className="mt-2 flex items-center gap-2 lg:mt-0">
                        <FiltrosModal /> {/* Este incluye el botón y el modal */}
                        <div className="relative w-full lg:w-64">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="w-full rounded-md border px-10 py-2" // px-10 deja espacio para el ícono
                            />
                        </div>
                    </div>
                </div>

                {/* Tabla */}
                <DataTable data={vehiculos} />
            </div>
        </AppLayout>
    );
}
