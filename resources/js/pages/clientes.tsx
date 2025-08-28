'use client';
import FiltrosModal from '@/components/vehicles/modal-filtros';
import AddClienteModal from '@/components/cliente/cliente-modal';
import AppLayout from '@/layouts/app-layout';
import type { Cliente } from '@/types';
import { Head } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
export default function Cliente() {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const handleClienteCreado = (cliente: Cliente) => {
        console.log('Cliente registrado:', cliente);
        setMostrarFormulario(false); // ocultar el formulario después de registrar
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Clientes', href: '/clientes' }]}>
            <Head title="Clientes" />
            <div className="p-4">
                <h1 className="mb-4 text-xl font-bold">Clientes Registrados</h1>

                {/* Botones y buscador */}
                <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                    {/* Izquierda: botones */}
                    <div className="flex gap-2">
                        <AddClienteModal onClienteCreado={handleClienteCreado} />
                    </div>

                    <div className="mt-2 flex items-center gap-2 lg:mt-0">
                        <FiltrosModal />
                        <div className="relative w-full lg:w-64">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input type="text" placeholder="Buscar..." className="w-full rounded-md border px-10 py-2" />
                        </div>
                    </div>
                </div>

                {/* <DataTable data={null} /> */}
            </div>
        </AppLayout>
    );
}
