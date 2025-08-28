import { DataTable } from '@/components/vehicles/data-table';
import FiltrosModal from '@/components/vehicles/modal-filtros';
import AddVehiculoModal from '@/components/vehicles/modal-vehicle';
import AppLayout from '@/layouts/app-layout';
import { Vehiculo } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function Vehiculos() {
    const { props } = usePage<{ vehiculos: Vehiculo[] }>();
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>(props.vehiculos);

    const handleVehiculoCreado = (veh: Vehiculo) => {
        setVehiculos((prev) => [...prev, veh]);
    };
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
                        <FiltrosModal />
                        <div className="relative w-full lg:w-64">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input type="text" placeholder="Buscar..." className="w-full rounded-md border px-10 py-2" />
                        </div>
                    </div>
                </div>

                <DataTable data={vehiculos} />
            </div>
        </AppLayout>
    );
}
