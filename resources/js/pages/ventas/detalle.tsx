'use client';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { VentaTable } from '@/types';
import { IconInfoCircle, IconUser, IconCar, IconReceipt, IconUserCheck, IconArrowLeft } from '@tabler/icons-react';
import { Head, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface VentaCompleta {
    venta: {
        id: number;
        procedencia: string;
        valor_venta_ars: number;
        valor_venta_usd: number;
        ganancia_real_ars: number;
        ganancia_real_usd: number;
        fecha: string;
        created_at: string;
    };
    vehiculo: {
        id: number;
        marca: string;
        modelo: string;
        dominio: string;
        anio: number;
        color: string;
        kilometraje: number;
        precio_compra_ars: number;
        precio_compra_usd: number;
        ubicacion: string;
        estado: string;
        info_auto: string;
        fecha_ingreso: string;
        total_gastos_ars: number;
        total_gastos_usd: number;
    };
    cliente: {
        id: number;
        nombre: string;
        dni: string;
        email: string;
        telefono: string;
    };
    vendedor: {
        id: number;
        name: string;
        email: string;
    };
}

export default function DetalleVenta() {
    const { props } = usePage<{ venta: VentaTable }>();
    const [isLoading, setIsLoading] = useState(true);
    const [ventaCompleta, setVentaCompleta] = useState<VentaCompleta | null>(null);

    // Cargar información completa de la venta
    useEffect(() => {
        if (props.venta?.id) {
            setIsLoading(true);
            fetch(`/ventas/${props.venta.id}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) {
                        setVentaCompleta(data.data);
                    } else {
                        toast.error('Error al cargar información de la venta');
                    }
                })
                .catch((error) => {
                    console.error('Error al cargar información de la venta:', error);
                    toast.error('Error al cargar información de la venta');
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [props.venta?.id]);

    const formatCurrency = (amount: number, currency: 'ARS' | 'USD') => {
        const locale = currency === 'ARS' ? 'es-AR' : 'en-US';
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        try {
            return new Date(dateString).toLocaleDateString('es-AR');
        } catch {
            return dateString;
        }
    };

    const handleVolver = () => {
        router.visit('/ventas');
    };

    if (isLoading) {
        return (
            <AppLayout breadcrumbs={[
                { title: 'Ventas', href: '/ventas' },
                { title: 'Detalle de Venta', href: '/ventas/detalle' }
            ]}>
                <Head title="Detalle de Venta" />
                <div className="p-6">
                    <div className="flex items-center justify-center py-16">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-muted-foreground text-lg">Cargando información de la venta...</p>
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (!ventaCompleta) {
        return (
            <AppLayout breadcrumbs={[
                { title: 'Ventas', href: '/ventas' },
                { title: 'Detalle de Venta', href: '/ventas/detalle' }
            ]}>
                <Head title="Detalle de Venta" />
                <div className="p-6">
                    <div className="flex items-center justify-center py-16">
                        <div className="text-center">
                            <p className="text-muted-foreground text-lg">No se pudo cargar la información de la venta</p>
                            <Button onClick={handleVolver} className="mt-4">
                                <IconArrowLeft className="h-4 w-4 mr-2" />
                                Volver a Ventas
                            </Button>
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={[
            { title: 'Ventas', href: '/ventas' },
            { title: `Detalle - ${ventaCompleta.vehiculo.marca} ${ventaCompleta.vehiculo.modelo}`, href: '/ventas/detalle' }
        ]}>
            <Head title={`Detalle de Venta - ${ventaCompleta.vehiculo.marca} ${ventaCompleta.vehiculo.modelo}`} />
            
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" onClick={handleVolver}>
                            <IconArrowLeft className="h-4 w-4 mr-2" />
                            Volver a Ventas
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <IconInfoCircle className="h-6 w-6" />
                                Detalle de Venta
                            </h1>
                            <p className="text-muted-foreground">
                                {ventaCompleta.vehiculo.marca} {ventaCompleta.vehiculo.modelo} - {ventaCompleta.vehiculo.dominio}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contenido principal */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Columna Izquierda */}
                    <div className="space-y-6">
                        {/* Información del Cliente */}
                        <div className="bg-card border rounded-lg p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <IconUser className="h-5 w-5 text-blue-600" />
                                <h3 className="text-lg font-semibold">Información del Cliente</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Nombre:</span>
                                    <p className="font-medium text-lg">{ventaCompleta.cliente.nombre || '-'}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">DNI:</span>
                                    <p className="font-medium text-lg">{ventaCompleta.cliente.dni || '-'}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Email:</span>
                                    <p className="font-medium text-lg">{ventaCompleta.cliente.email || '-'}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Teléfono:</span>
                                    <p className="font-medium text-lg">{ventaCompleta.cliente.telefono || '-'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Información del Vehículo */}
                        <div className="bg-card border rounded-lg p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <IconCar className="h-5 w-5 text-green-600" />
                                <h3 className="text-lg font-semibold">Información del Vehículo</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Marca:</span>
                                    <p className="font-medium text-lg">{ventaCompleta.vehiculo.marca || '-'}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Modelo:</span>
                                    <p className="font-medium text-lg">{ventaCompleta.vehiculo.modelo || '-'}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Dominio:</span>
                                    <p className="font-medium text-lg">{ventaCompleta.vehiculo.dominio || '-'}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Año:</span>
                                    <p className="font-medium text-lg">{ventaCompleta.vehiculo.anio || '-'}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Color:</span>
                                    <p className="font-medium text-lg">{ventaCompleta.vehiculo.color || '-'}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Kilometraje:</span>
                                    <p className="font-medium text-lg">{ventaCompleta.vehiculo.kilometraje?.toLocaleString('es-AR') || '-'} km</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Ubicación:</span>
                                    <p className="font-medium text-lg">{ventaCompleta.vehiculo.ubicacion || '-'}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Estado:</span>
                                    <p className="font-medium text-lg">{ventaCompleta.vehiculo.estado || '-'}</p>
                                </div>
                                <div className="col-span-2">
                                    <span className="text-sm font-medium text-muted-foreground">Fecha de ingreso:</span>
                                    <p className="font-medium text-lg">{formatDate(ventaCompleta.vehiculo.fecha_ingreso)}</p>
                                </div>
                                {ventaCompleta.vehiculo.info_auto && (
                                    <div className="col-span-2">
                                        <span className="text-sm font-medium text-muted-foreground">Información adicional:</span>
                                        <p className="font-medium text-lg">{ventaCompleta.vehiculo.info_auto}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Columna Central */}
                    <div className="space-y-6">
                        {/* Información del Vendedor */}
                        <div className="bg-card border rounded-lg p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <IconUserCheck className="h-5 w-5 text-indigo-600" />
                                <h3 className="text-lg font-semibold">Información del Vendedor</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Nombre:</span>
                                    <p className="font-medium text-lg">{ventaCompleta.vendedor.name || '-'}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Email:</span>
                                    <p className="font-medium text-lg">{ventaCompleta.vendedor.email || '-'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Información de la Venta */}
                        <div className="bg-card border rounded-lg p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <IconReceipt className="h-5 w-5 text-purple-600" />
                                <h3 className="text-lg font-semibold">Información de la Venta</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Fecha de venta:</span>
                                    <p className="font-medium text-lg">{formatDate(ventaCompleta.venta.fecha)}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Procedencia:</span>
                                    <p className="font-medium text-lg">{ventaCompleta.venta.procedencia || '-'}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Fecha de registro:</span>
                                    <p className="font-medium text-lg">{formatDate(ventaCompleta.venta.created_at)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha */}
                    <div className="space-y-6">
                        {/* Información Financiera */}
                        <div className="bg-card border rounded-lg p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <IconReceipt className="h-5 w-5 text-orange-600" />
                                <h3 className="text-lg font-semibold">Información Financiera</h3>
                            </div>
                            <div className="space-y-6">
                                {/* Precios de Compra */}
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-base text-muted-foreground">Precios de Compra</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Precio ARS:</span>
                                            <span className="font-semibold text-lg">{formatCurrency(ventaCompleta.vehiculo.precio_compra_ars, 'ARS')}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Precio USD:</span>
                                            <span className="font-semibold text-lg">{formatCurrency(ventaCompleta.vehiculo.precio_compra_usd, 'USD')}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Gastos del Vehículo */}
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-base text-muted-foreground">Gastos del Vehículo</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Gastos ARS:</span>
                                            <span className="font-semibold text-lg">{formatCurrency(ventaCompleta.vehiculo.total_gastos_ars, 'ARS')}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Gastos USD:</span>
                                            <span className="font-semibold text-lg">{formatCurrency(ventaCompleta.vehiculo.total_gastos_usd, 'USD')}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Precios de Venta */}
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-base text-muted-foreground">Precios de Venta</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Venta ARS:</span>
                                            <span className="font-semibold text-lg text-green-600">{formatCurrency(ventaCompleta.venta.valor_venta_ars, 'ARS')}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Venta USD:</span>
                                            <span className="font-semibold text-lg text-green-600">{formatCurrency(ventaCompleta.venta.valor_venta_usd, 'USD')}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Ganancias */}
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-base text-muted-foreground">Ganancias Reales</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Ganancia ARS:</span>
                                            <span className={`font-semibold text-lg ${ventaCompleta.venta.ganancia_real_ars >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {formatCurrency(ventaCompleta.venta.ganancia_real_ars, 'ARS')}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Ganancia USD:</span>
                                            <span className={`font-semibold text-lg ${ventaCompleta.venta.ganancia_real_usd >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {formatCurrency(ventaCompleta.venta.ganancia_real_usd, 'USD')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
