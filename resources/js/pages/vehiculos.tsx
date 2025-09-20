import { DataTable } from '@/components/vehiculos/data-table';
import AddVehiculoModal from '@/components/vehiculos/modal-vehicle';
import DateFilter from '@/components/vehiculos/date-filter';
import AppLayout from '@/layouts/app-layout';
import { Vehiculo } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import { parseISO, isWithinInterval } from 'date-fns';
import { DateRange } from 'react-day-picker';

export default function Vehiculos() {
    const { props } = usePage<{ vehiculos: Vehiculo[] }>();
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>(props.vehiculos);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

    const handleVehiculoCreado = (veh: Vehiculo) => {
        setVehiculos((prev) => [...prev, veh]);
    };

    // Filtrar vehículos basado en el término de búsqueda, rango de fechas y excluir vehículos vendidos
    const filteredVehiculos = useMemo(() => {
        // Primero filtrar vehículos vendidos
        const availableVehiculos = vehiculos.filter((vehiculo) => {
            return !vehiculo.estado || vehiculo.estado.toLowerCase() !== 'vendido';
        });

        let filtered = availableVehiculos;

        // Aplicar filtro por rango de fechas si está seleccionado
        if (dateRange?.from) {
            filtered = filtered.filter((vehiculo) => {
                if (!vehiculo.fecha) return false;
                
                try {
                    const vehiculoDate = parseISO(vehiculo.fecha);
                    
                    // Si solo hay fecha de inicio, filtrar desde esa fecha en adelante
                    if (dateRange.from && !dateRange.to) {
                        return vehiculoDate >= dateRange.from;
                    }
                    
                    // Si hay rango completo, verificar si está dentro del intervalo
                    if (dateRange.from && dateRange.to) {
                        return isWithinInterval(vehiculoDate, {
                            start: dateRange.from,
                            end: dateRange.to
                        });
                    }
                    
                    return false;
                } catch {
                    return false;
                }
            });
        }

        // Aplicar búsqueda por texto si hay término
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase().trim();
            filtered = filtered.filter((vehiculo) => {
                return (
                    vehiculo.marca.toLowerCase().includes(term) ||
                    vehiculo.modelo.toLowerCase().includes(term) ||
                    vehiculo.dominio.toLowerCase().includes(term)
                );
            });
        }

        return filtered;
    }, [vehiculos, searchTerm, dateRange]);

    console.log(vehiculos);

    return (
        <AppLayout breadcrumbs={[{ title: 'Vehículos', href: '/vehiculos' }]}>
            <Head title="Vehículos" />
            <div className="p-4">
                <h1 className="mb-4 text-xl font-bold">Vehículos disponibles</h1>

                <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex gap-2">
                        <AddVehiculoModal onVehiculoCreado={handleVehiculoCreado} />
                    </div>
                    <div className="mt-2 flex items-center gap-2 lg:mt-0">
                        <div className="relative w-full lg:w-64">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input 
                                type="text" 
                                placeholder="Buscar por marca, modelo o dominio..." 
                                className="w-full rounded-md border px-10 py-2" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="w-full lg:w-64">
                            <DateFilter
                                dateRange={dateRange}
                                onDateRangeChange={setDateRange}
                                placeholder="Filtrar por rango de fechas"
                            />
                        </div>
                    </div>
                </div>

                <DataTable data={filteredVehiculos} />
            </div>
        </AppLayout>
    );
}
