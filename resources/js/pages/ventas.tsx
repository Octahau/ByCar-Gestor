'use client';
import DateFilter from '@/components/vehiculos/date-filter';
import { DataTable } from '@/components/ventas/data-table';
import FiltrosModal from '@/components/ventas/filtros-modal';
import AddVentaModal from '@/components/ventas/venta-modal';
import AppLayout from '@/layouts/app-layout';
import { VentaTable } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
export default function Ventas() {
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [filtros, setFiltros] = useState<{ vendedores: string[] }>({
        vendedores: [],
    });

    const handleVentaCreada = (venta: VentaTable) => {
        console.log('Venta registrada:', venta);
        setVentas((prev) => [...prev, venta]); // ahora TypeScript ya no se queja
    };

    const handleFiltrosChange = (nuevosFiltros: { vendedores: string[] }) => {
        setFiltros(nuevosFiltros);
    };

    const { props } = usePage<{ ventas: VentaTable[] }>();
    const [ventas, setVentas] = useState<VentaTable[]>(props.ventas);
    console.log(ventas);
    return (
        <AppLayout breadcrumbs={[{ title: 'Ventas', href: '/ventas' }]}>
            <Head title="Ventas" />
            <div className="p-4">
                <h1 className="mb-4 text-xl font-bold">Ventas realizadas</h1>

                {/* Botón de agregar venta y controles de búsqueda/filtros */}
                <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                    {/* Izquierda: botón de agregar venta */}
                    <div className="flex gap-2">
                        <AddVentaModal onVentaCreada={handleVentaCreada} />
                    </div>

                    {/* Derecha: buscador y filtros */}
                    <div className="mb-4 flex w-full max-w-md flex-col gap-2 mr-1">
                        {/* Buscador */}
                        <div className="relative w-full">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Buscar por cliente, marca, modelo o dominio..."
                                className="w-full rounded-md border px-10 py-2"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Botones */}
                        <div className="flex gap-2 w-full">
                            <FiltrosModal data={ventas} onFiltersChange={handleFiltrosChange} />
                            <DateFilter dateRange={dateRange} onDateRangeChange={setDateRange} placeholder="Filtrar por fecha de venta" />
                        </div>
                    </div>
                </div>
                <DataTable data={ventas} searchTerm={searchTerm} filtros={filtros} dateRange={dateRange} />
            </div>
        </AppLayout>
    );
}
