'use client';
import ClienteFiltrosModal from '@/components/cliente/cliente-filtros-modal';
import AddClienteModal from '@/components/cliente/cliente-modal';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { Cliente } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import {DataTable} from '@/components/cliente/cliente-table';
export default function Cliente() {
    const { props } = usePage<{ clientes: Cliente[] }>();
    
    const [clientes, setClientes] = useState<Cliente[]>(props.clientes);
    const [searchTerm, setSearchTerm] = useState('');
    const [filtros, setFiltros] = useState<{ tipos: string[] }>({ tipos: [] });

    const handleClienteCreado = (cliente: Cliente) => {
        console.log('Cliente registrado:', cliente);
        setClientes(prev => [...prev, cliente]); // agregar el nuevo cliente a la lista
    };

    const handleClienteUpdated = (clienteActualizado: Cliente) => {
        setClientes(prev => prev.map(cliente => 
            cliente.id === clienteActualizado.id ? clienteActualizado : cliente
        ));
    };

    const handleFiltrosChange = (nuevosFiltros: { tipos: string[] }) => {
        setFiltros(nuevosFiltros);
    };
    console.log(clientes);
    return (
        <AppLayout breadcrumbs={[{ title: 'Clientes', href: '/clientes' }]}>
            <Head title="Clientes" />
            <div className="p-4">
                <h1 className="mb-4 text-xl font-bold">Clientes Registrados</h1>

                {/* Botones y buscador */}
                <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                    {/* Izquierda: botones */}
                    <div className="flex gap-2">
                        <AddClienteModal 
                            onClienteCreado={handleClienteCreado}
                            trigger={
                                <Button>
                                    <IconPlus className="size-4" />
                                    Agregar Cliente
                                </Button>
                            }
                        />
                    </div>

                    <div className="mt-2 flex items-center gap-2 lg:mt-0">
                        <ClienteFiltrosModal onFiltersChange={handleFiltrosChange} />
                        <div className="relative w-full lg:w-64">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input 
                                type="text" 
                                placeholder="Buscar por nombre o DNI..." 
                                className="w-full rounded-md border px-10 py-2"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <DataTable 
                    data={clientes} 
                    searchTerm={searchTerm} 
                    filtros={filtros} 
                    onClienteUpdated={handleClienteUpdated}
                /> 
            </div>
        </AppLayout>
    );
}
