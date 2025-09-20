import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BalanceTable } from '@/components/balance-mensual/balance-table';
import { useState } from 'react';

interface VendedorData {
    ventas: number;
    valor_ars: number;
    valor_usd: number;
}

interface MesData {
    mes: string;
    año: number;
    mes_numero: number;
    vendedores: Record<string, VendedorData>;
    total: VendedorData;
}

interface TotalesVendedor {
    ventas: number;
    valor_ars: number;
    valor_usd: number;
}

interface Totales {
    vendedores: Record<string, TotalesVendedor>;
    general: TotalesVendedor;
}

interface BalanceMensualProps {
    balanceData: MesData[];
    vendedores: string[];
    meses: Array<{
        nombre: string;
        año: number;
        mes: number;
        fecha: string;
    }>;
    totales: Totales;
    añoActual: number;
    añosDisponibles: number[];
}

export default function BalanceMensual({ balanceData, vendedores, totales, añoActual, añosDisponibles }: BalanceMensualProps) {
    const [añoSeleccionado, setAñoSeleccionado] = useState(añoActual);
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatUSD = (amount: number) => {
        if (amount === 0) return '–';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const handleAñoChange = (nuevoAño: string) => {
        const año = parseInt(nuevoAño);
        setAñoSeleccionado(año);
        router.get('/balance-mensual', { año }, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Balance Mensual', href: '/balance-mensual' }]}>
            <Head title="Balance Mensual" />
            
            <div className="p-4 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Balance Mensual</h1>
                        <p className="text-muted-foreground">
                            Resumen de ventas por vendedor y mes
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="año-selector" className="text-sm font-medium">
                                Año:
                            </Label>
                            <Select
                                value={añoSeleccionado.toString()}
                                onValueChange={handleAñoChange}
                            >
                                <SelectTrigger id="año-selector" className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {añosDisponibles.map((año) => (
                                        <SelectItem key={año} value={año.toString()}>
                                            {año}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <BalanceTable 
                    balanceData={balanceData}
                    vendedores={vendedores}
                    totales={totales}
                />

                {/* Título para el resumen anual */}
                <div className="mt-8 mb-4">
                    <h2 className="text-2xl font-bold text-center text-muted-foreground">
                        Balance Anual por Vendedor
                    </h2>
                    <p className="text-center text-sm text-muted-foreground mt-2">
                        Resumen acumulado de ventas y ganancias por vendedor durante todo el período
                    </p>
                </div>

                {/* Resumen de vendedores */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {vendedores.map((vendedor) => {
                        const total = totales.vendedores[vendedor];
                        return (
                            <Card key={vendedor}>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">{vendedor}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Ventas:</span>
                                            <Badge variant="secondary">{total.ventas}</Badge>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">ARS:</span>
                                            <span className="font-medium">{formatCurrency(total.valor_ars)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">USD:</span>
                                            <span className="font-medium">{formatUSD(total.valor_usd)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
