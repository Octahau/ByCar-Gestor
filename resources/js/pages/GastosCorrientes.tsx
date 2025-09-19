'use client';
import AddGastoCorrienteModal from '@/components/gastos-corrientes/gastos-corrientes-modal';
import { DataTable } from '@/components/gastos-corrientes/gastos-table';
import AppLayout from '@/layouts/app-layout';
import { GastoCorrienteTable } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import DateFilter from '@/components/vehicles/date-filter';
export default function GastosCorrientes() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

    const { props } = usePage<{ gastos: GastoCorrienteTable[] }>();
    const [gastos, setGastos] = useState<GastoCorrienteTable[]>(props.gastos ?? []);

    const handleGastoActualizado = () => {
        // Recargar la página para actualizar la lista
        window.location.reload();
    };
    
    
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

                    <div className="mt-2 flex items-center gap-4 lg:mt-0">
                        <div className="relative w-full lg:w-64">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Buscar por operador o motivo..."
                                className="w-full rounded-md border px-10 py-2"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Filtro de fechas */}
                        <div className="flex gap-2 w-full">
                            <DateFilter 
                                dateRange={dateRange} 
                                onDateRangeChange={setDateRange} 
                                placeholder="Filtrar por fecha de gasto" 
                            />
                        </div>
                        
                    </div>
                </div>
                <DataTable 
                    data={gastos} 
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    dateRange={dateRange}
                    onGastoActualizado={handleGastoActualizado}
                />
            </div>
        </AppLayout>
    );
}
