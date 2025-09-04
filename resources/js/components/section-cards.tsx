import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { IconCurrencyDollar, IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { object } from 'zod';

export function SectionCards() {
    const [vehiculosDisponibles, setVehiculosDisponibles] = useState<number>(0);
    const [ventasRealizadas, setVentasRealizadas] = useState<number>(0);
    const [gastosCorrientes, setGastosCorrientes] = useState<number>(0);
    const [gastoVehiculo, setGastoVehiculo] = useState<number>(0);
    const [resumen, setResumen] = useState<any>({vehiculosDisponibles: 0, ventasRealizadas: 0, gastosCorrientes: 0, gastoVehiculo: 0});
    useEffect(() => {
        const fetchData = async () => {
            try {
                const vehRes = await fetch('/vehiculos-cantidad');
                const vehData = await vehRes.json();

                const ventasRes = await fetch('/ventas-cantidad');
                const ventasData = await ventasRes.json();

                const gastosRes = await fetch('/gastos-corrientes-cantidad');
                const gastosData = await gastosRes.json();

                const gastoVehRes = await fetch('/gasto-vehiculo-cantidad');
                const gastoVehData = await gastoVehRes.json();

                setResumen({vehiculosDisponibles: vehData.cantidad ?? 0, ventasRealizadas: ventasData.cantidad ?? 0, gastosCorrientes: gastosData.importeTotal ?? 0, gastoVehiculo: gastoVehData.importeTotalArs ?? 0});

            } catch (err) {
                console.error('Error al obtener los datos:', err);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Vehículos en depósito</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{resumen.vehiculosDisponibles}</CardTitle>
                    <CardAction></CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <Link href="/vehiculos" className="w-full">
                        <Button variant="secondary" className="w-full">
                            Ver Vehículos
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Ventas Realizadas</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl"> {resumen.ventasRealizadas}</CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <IconTrendingDown />
                            -20%
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <Link href="/ventas" className="w-full">
                        <Button variant="secondary" className="w-full">
                            Ver Ventas
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Gastos Corrientes</CardDescription>
                    <CardTitle className="flex items-center gap-1 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {/* <IconCurrencyDollar className="!size-5 text-green-500" /> */}
                        ${resumen.gastosCorrientes}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <IconTrendingUp />
                            +12.5%
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <Link href="/GastosCorrientes" className="w-full">
                        <Button variant="secondary" className="w-full">
                            Ver Gastos
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Gasto Vehiculo</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">${resumen.gastoVehiculo}</CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <IconTrendingUp />
                            +4.5%
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <Link href="/GastosVehiculos" className="w-full">
                        <Button variant="secondary" className="w-full">
                            Ver Gasto
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
