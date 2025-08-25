'use client';
import { DataTable } from '@/components/vehicles/data-table';
import FiltrosModal from '@/components/vehicles/modal-filtros';
import AddVentaModal from '@/components/ventas/modal-venta';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Ventas() {

    return (
        <AppLayout breadcrumbs={[{ title: 'Ventas', href: '/ventas' }]}>
            <Head title="Ventas" />
            <div className="p-4">
                <h1 className="mb-4 text-xl font-bold">Ventas reailzadas</h1>

                {/* Botones y buscador */}
                <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                    {/* Izquierda: botones */}
                    <div className="flex gap-2">
                        <AddVentaModal />
                    </div>

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
                {/* <DataTable data={null} /> */}
            </div>
        </AppLayout>
    );
}
