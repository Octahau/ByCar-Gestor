'use client';
import { DataTable } from '@/components/gasto-vehiculo/gastos-table';
import AddGastoVehiculoModal from '@/components/gasto-vehiculo/gastos-vehiculos-modal';
import DateFilter from '@/components/vehicles/date-filter';
import AppLayout from '@/layouts/app-layout';
import { GastoVehiculoTable } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

export default function GastosVehiculos() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

    const { props } = usePage<{ gastos?: GastoVehiculoTable[] }>();
    const [gastos, setGastos] = useState<GastoVehiculoTable[]>(props.gastos ?? []);
    console.log(gastos);
    console.log(props);

    const handleGastoActualizado = () => {
        // Recargar la página para obtener los datos actualizados
        window.location.reload();
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Gastos Vehiculos', href: '/GastosVehiculos' }]}>
            <Head title="Gastos Vehiculos" />
            <div className="p-4">
                <h1 className="mb-4 text-xl font-bold">Gastos Vehiculos</h1>

                {/* Botones y buscador */}
                <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                    {/* Izquierda: botones */}
                    <div className="flex gap-2">
                        <AddGastoVehiculoModal
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
                                placeholder="Buscar por operador, motivo o dominio..." 
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
                    dateRange={dateRange}
                    onGastoActualizado={handleGastoActualizado} 
                />
            </div>
        </AppLayout>
    );
}
