import React from 'react';
import { IconCar, IconCalendar, IconMapPin, IconCurrencyDollar, IconInfoCircle, IconX } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from '@/components/ui/dialog';
import { Vehiculo } from '@/types';

interface VehiculoInfoModalProps {
    vehiculo: Vehiculo;
    isOpen: boolean;
    onClose: () => void;
}

export default function VehiculoInfoModal({ 
    vehiculo, 
    isOpen, 
    onClose 
}: VehiculoInfoModalProps) {
    const formatCurrency = (amount: number | undefined) => {
        if (!amount) return '-';
        return `$${amount.toLocaleString()}`;
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES');
        } catch {
            return dateString;
        }
    };

    const getTipoDisplay = (tipo: string | undefined) => {
        return tipo === 'camioneta' ? 'Camioneta' : 'Auto';
    };

    const getEstadoDisplay = (estado: string | undefined) => {
        const estados = {
            'disponible': 'Disponible',
            'no_disponible': 'No Disponible',
            'vendido': 'Vendido'
        };
        return estados[estado as keyof typeof estados] || estado || '-';
    };

    const getEstadoColor = (estado: string | undefined) => {
        const colores = {
            'disponible': 'bg-green-100 text-green-800',
            'no_disponible': 'bg-yellow-100 text-yellow-800',
            'vendido': 'bg-red-100 text-red-800'
        };
        return colores[estado as keyof typeof colores] || 'bg-gray-100 text-gray-800';
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <IconCar className="h-5 w-5" />
                        Información del Vehículo - {vehiculo.marca} {vehiculo.modelo}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Información Básica */}
                    <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <IconCar className="h-5 w-5 text-blue-600" />
                            <h3 className="text-lg font-semibold">Información Básica</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Marca:</span>
                                <p className="font-medium text-lg">{vehiculo.marca || '-'}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Modelo:</span>
                                <p className="font-medium text-lg">{vehiculo.modelo || '-'}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Dominio:</span>
                                <p className="font-medium text-lg">{vehiculo.dominio || '-'}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Año:</span>
                                <p className="font-medium text-lg">{vehiculo.anio || '-'}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Color:</span>
                                <p className="font-medium text-lg">{vehiculo.color || '-'}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Kilometraje:</span>
                                <p className="font-medium text-lg">{vehiculo.kilometraje ? `${vehiculo.kilometraje.toLocaleString()} km` : '-'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tipo y Estado */}
                    <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <IconInfoCircle className="h-5 w-5 text-purple-600" />
                            <h3 className="text-lg font-semibold">Clasificación</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Tipo:</span>
                                <div className="mt-1">
                                    <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800">
                                        {getTipoDisplay(vehiculo.tipo)}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Estado:</span>
                                <div className="mt-1">
                                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getEstadoColor(vehiculo.estado)}`}>
                                        {getEstadoDisplay(vehiculo.estado)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Información Financiera */}
                    <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <IconCurrencyDollar className="h-5 w-5 text-green-600" />
                            <h3 className="text-lg font-semibold">Información Financiera</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Precio de Compra (ARS):</span>
                                <p className="font-medium text-lg">{formatCurrency(vehiculo.precioARS)}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Precio de Compra (USD):</span>
                                <p className="font-medium text-lg">{formatCurrency(vehiculo.precioUSD)}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Precio Venta Sugerido (ARS):</span>
                                <p className="font-medium text-lg">{formatCurrency(vehiculo.precio_venta_sugerido_ars)}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Precio Venta Sugerido (USD):</span>
                                <p className="font-medium text-lg">{formatCurrency(vehiculo.precio_venta_sugerido_usd)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Gastos Acumulados */}
                    <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <IconCurrencyDollar className="h-5 w-5 text-red-600" />
                            <h3 className="text-lg font-semibold">Gastos Acumulados</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Total Gastos (ARS):</span>
                                <p className="font-medium text-lg text-red-600">{formatCurrency(vehiculo.gastos_acumulados_ars)}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Total Gastos (USD):</span>
                                <p className="font-medium text-lg text-red-600">{formatCurrency(vehiculo.gastos_acumulados_usd)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Ubicación y Fecha */}
                    <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <IconMapPin className="h-5 w-5 text-orange-600" />
                            <h3 className="text-lg font-semibold">Ubicación y Fecha</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Ubicación:</span>
                                <p className="font-medium text-lg">{vehiculo.ubicacion || '-'}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Fecha de Ingreso:</span>
                                <p className="font-medium text-lg">{formatDate(vehiculo.fecha)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Información Adicional */}
                    {vehiculo.infoAuto && (
                        <div className="bg-muted/50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <IconInfoCircle className="h-5 w-5 text-gray-600" />
                                <h3 className="text-lg font-semibold">Información Adicional</h3>
                            </div>
                            <p className="font-medium text-lg whitespace-pre-wrap">{vehiculo.infoAuto}</p>
                        </div>
                    )}
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
