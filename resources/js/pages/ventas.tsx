'use client';
import FiltrosModal from '@/components/vehicles/modal-filtros';
import { DataTable } from '@/components/ventas/data-table';
import AddVentaModal from '@/components/ventas/venta-modal';
import AppLayout from '@/layouts/app-layout';
import { VentaTable } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
export default function Ventas() {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const handleVentaCreada = (venta: VentaTable) => {
        console.log('Venta registrada:', venta);
        setVentas((prev) => [...prev, venta]); // ahora TypeScript ya no se queja
        setMostrarFormulario(false);
    };

    const { props } = usePage<{ ventas: VentaTable[] }>();
    const [ventas, setVentas] = useState<VentaTable[]>(props.ventas);
    console.log(ventas);
    return (
        <AppLayout breadcrumbs={[{ title: 'Ventas', href: '/ventas' }]}>
            <Head title="Ventas" />
            <div className="p-4">
                <h1 className="mb-4 text-xl font-bold">Ventas realizadas</h1>

                {/* Botones y buscador */}
                <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                    {/* Izquierda: botones */}
                    <div className="flex gap-2">
                        <AddVentaModal onVentaCreada={handleVentaCreada} />
                    </div>

                    <div className="mt-2 flex items-center gap-2 lg:mt-0">
                        <FiltrosModal />
                        <div className="relative w-full lg:w-64">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input type="text" placeholder="Buscar..." className="w-full rounded-md border px-10 py-2" />
                        </div>
                    </div>
                </div>
                <DataTable data={ventas} />
            </div>
        </AppLayout>
    );
}
