'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { VentaTable } from '@/types';
import { IconInfoCircle, IconUser, IconCar, IconReceipt, IconUserCheck } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface InfoVentaModalProps {
    venta: VentaTable;
    isOpen: boolean;
    onClose: () => void;
}

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
        precio_venta_sugerido_ars?: number;
        precio_venta_sugerido_usd?: number;
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

export default function InfoVentaModal({ 
    venta, 
    isOpen, 
    onClose 
}: InfoVentaModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [ventaCompleta, setVentaCompleta] = useState<VentaCompleta | null>(null);

    // Cargar información completa de la venta
    useEffect(() => {
        if (isOpen && venta.id) {
            setIsLoading(true);
            fetch(`/ventas/${venta.id}`)
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
    }, [isOpen, venta.id]);

    const formatCurrency = (amount: number | undefined, currency: 'ARS' | 'USD') => {
        if (!amount) return '-';
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

    if (isLoading) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-[98vw] w-full max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <IconInfoCircle className="h-5 w-5" />
                            Información de la Venta
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-muted-foreground">Cargando información...</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    if (!ventaCompleta) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-[98vw] w-full max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <IconInfoCircle className="h-5 w-5" />
                            Información de la Venta
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center justify-center py-8">
                        <p className="text-muted-foreground">No se pudo cargar la información</p>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[98vw] w-full max-h-[95vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <IconInfoCircle className="h-5 w-5" />
                        Información de la Venta - {ventaCompleta.vehiculo.marca} {ventaCompleta.vehiculo.modelo}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                        {/* Información del Cliente */}
                        <div className="bg-muted/50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <IconUser className="h-5 w-5 text-blue-600" />
                                <h3 className="text-lg font-semibold">Información del Cliente</h3>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Nombre:</span>
                                    <p className="font-medium">{ventaCompleta.cliente.nombre || '-'}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">DNI:</span>
                                    <p className="font-medium">{ventaCompleta.cliente.dni || '-'}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Email:</span>
                                    <p className="font-medium">{ventaCompleta.cliente.email || '-'}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Teléfono:</span>
                                    <p className="font-medium">{ventaCompleta.cliente.telefono || '-'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Información del Vehículo */}
                        <div className="bg-muted/50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <IconCar className="h-5 w-5 text-green-600" />
                                <h3 className="text-lg font-semibold">Información del Vehículo</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Marca:</span>
                                    <p className="font-medium">{ventaCompleta.vehiculo.marca || '-'}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Modelo:</span>
                                    <p className="font-medium">{ventaCompleta.vehiculo.modelo || '-'}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Dominio:</span>
                                    <p className="font-medium">{ventaCompleta.vehiculo.dominio || '-'}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Año:</span>
                                    <p className="font-medium">{ventaCompleta.vehiculo.anio || '-'}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Color:</span>
                                    <p className="font-medium">{ventaCompleta.vehiculo.color || '-'}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Kilometraje:</span>
                                    <p className="font-medium">{ventaCompleta.vehiculo.kilometraje?.toLocaleString('es-AR') || '-'} km</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Ubicación:</span>
                                    <p className="font-medium">{ventaCompleta.vehiculo.ubicacion || '-'}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Estado:</span>
                                    <p className="font-medium">{ventaCompleta.vehiculo.estado || '-'}</p>
                                </div>
                                <div className="col-span-2">
                                    <span className="text-sm font-medium text-muted-foreground">Fecha de ingreso:</span>
                                    <p className="font-medium">{formatDate(ventaCompleta.vehiculo.fecha_ingreso)}</p>
                                </div>
                                {ventaCompleta.vehiculo.info_auto && (
                                    <div className="col-span-2">
                                        <span className="text-sm font-medium text-muted-foreground">Información adicional:</span>
                                        <p className="font-medium">{ventaCompleta.vehiculo.info_auto}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Columna Central */}
                    <div className="space-y-6">
                        {/* Información del Vendedor */}
                        <div className="bg-muted/50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <IconUserCheck className="h-5 w-5 text-indigo-600" />
                                <h3 className="text-lg font-semibold">Información del Vendedor</h3>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Nombre:</span>
                                    <p className="font-medium">{ventaCompleta.vendedor.name || '-'}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Email:</span>
                                    <p className="font-medium">{ventaCompleta.vendedor.email || '-'}</p>
                                </div>
                            </div>
                        </div>
                        {/* Información de la Venta */}
                        <div className="bg-muted/50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <IconReceipt className="h-5 w-5 text-purple-600" />
                                <h3 className="text-lg font-semibold">Información de la Venta</h3>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Fecha de venta:</span>
                                    <p className="font-medium">{formatDate(ventaCompleta.venta.fecha)}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Procedencia:</span>
                                    <p className="font-medium">{ventaCompleta.venta.procedencia || '-'}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Fecha de registro:</span>
                                    <p className="font-medium">{formatDate(ventaCompleta.venta.created_at)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Información Financiera */}
                        <div className="bg-muted/50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <IconReceipt className="h-5 w-5 text-orange-600" />
                                <h3 className="text-lg font-semibold">Información Financiera</h3>
                            </div>
                            <div className="space-y-4">
                                {/* Precios de Compra */}
                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm text-muted-foreground">Precios de Compra</h4>
                                    <div className="space-y-1">
                                        <div className="flex justify-between">
                                            <span className="text-sm">Precio ARS:</span>
                                            <span className="font-medium">{formatCurrency(ventaCompleta.vehiculo.precio_compra_ars, 'ARS')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm">Precio USD:</span>
                                            <span className="font-medium">{formatCurrency(ventaCompleta.vehiculo.precio_compra_usd, 'USD')}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Precios Sugeridos de Venta */}
                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm text-muted-foreground">Precios Sugeridos de Venta</h4>
                                    <div className="space-y-1">
                                        <div className="flex justify-between">
                                            <span className="text-sm">Precio Sugerido ARS:</span>
                                            <span className="font-medium text-blue-600">{formatCurrency(ventaCompleta.vehiculo.precio_venta_sugerido_ars, 'ARS')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm">Precio Sugerido USD:</span>
                                            <span className="font-medium text-blue-600">{formatCurrency(ventaCompleta.vehiculo.precio_venta_sugerido_usd, 'USD')}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Gastos del Vehículo */}
                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm text-muted-foreground">Gastos del Vehículo</h4>
                                    <div className="space-y-1">
                                        <div className="flex justify-between">
                                            <span className="text-sm">Gastos ARS:</span>
                                            <span className="font-medium">{formatCurrency(ventaCompleta.vehiculo.total_gastos_ars, 'ARS')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm">Gastos USD:</span>
                                            <span className="font-medium">{formatCurrency(ventaCompleta.vehiculo.total_gastos_usd, 'USD')}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Precios de Venta */}
                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm text-muted-foreground">Precios de Venta</h4>
                                    <div className="space-y-1">
                                        <div className="flex justify-between">
                                            <span className="text-sm">Venta ARS:</span>
                                            <span className="font-medium text-green-600">{formatCurrency(ventaCompleta.venta.valor_venta_ars, 'ARS')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm">Venta USD:</span>
                                            <span className="font-medium text-green-600">{formatCurrency(ventaCompleta.venta.valor_venta_usd, 'USD')}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Ganancias */}
                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm text-muted-foreground">Ganancias Reales</h4>
                                    <div className="space-y-1">
                                        <div className="flex justify-between">
                                            <span className="text-sm">Ganancia ARS:</span>
                                            <span className={`font-medium ${ventaCompleta.venta.ganancia_real_ars >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {formatCurrency(ventaCompleta.venta.ganancia_real_ars, 'ARS')}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm">Ganancia USD:</span>
                                            <span className={`font-medium ${ventaCompleta.venta.ganancia_real_usd >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {formatCurrency(ventaCompleta.venta.ganancia_real_usd, 'USD')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>

                <div className="flex justify-end pt-4">
                    <DialogClose asChild>
                        <Button variant="outline">Cerrar</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
}
