'use client';
import AddGastoCorrienteModal from '@/components/gastos-corrientes/gastos-corrientes-modal';
import { DataTable } from '@/components/gastos-corrientes/gastos-table';
import FiltrosModal from '@/components/vehicles/modal-filtros';
import AppLayout from '@/layouts/app-layout';
import { GastoCorrienteTable } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
export default function GastosCorrientes() {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleVentaCreada = (gastos: GastoCorrienteTable) => {
        console.log('Venta registrada:', gastos);
        setGastos((prev) => [...prev, gastos]); // ahora TypeScript ya no se queja
        setMostrarFormulario(false);
    };

    const { props } = usePage<{ gastos: GastoCorrienteTable[] }>();
    const [gastos, setGastos] = useState<GastoCorrienteTable[]>(props.gastos);
    console.log(gastos);

    return (
        <AppLayout breadcrumbs={[{ title: 'Gastos Corrientes', href: '/GastosCorrientes' }]}>
            <Head title="Gastos Corrientes" />
            <div className="p-4">
                <h1 className="mb-4 text-xl font-bold">Gastos Corrientes</h1>

                {/* Botones y buscador */}
                <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                    {/* Izquierda: botones */}
                    <div className="flex gap-2">
                        <AddGastoCorrienteModal
                            open={isModalOpen}
                            onOpenChange={setIsModalOpen}
                            onGastoCreado={(gasto) => {
                                setGastos((prev) => [...prev, gasto]);
                                // Cerrar modal
                                setIsModalOpen(false);
                                console.log('sGasto creado:', gasto);
                            }}
                        />
                    </div>

                    <div className="mt-2 flex items-center gap-2 lg:mt-0">
                        <FiltrosModal />
                        <div className="relative w-full lg:w-64">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input type="text" placeholder="Buscar..." className="w-full rounded-md border px-10 py-2" />
                        </div>
                    </div>
                </div>
                <DataTable data={gastos} />
            </div>
        </AppLayout>
    );
}
