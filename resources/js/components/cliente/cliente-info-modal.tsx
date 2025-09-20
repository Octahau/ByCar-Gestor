'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Cliente } from '@/types';
import { IconInfoCircle, IconUser, IconMail, IconId, IconFileText, IconShoppingCart, IconCalendar, IconCar, IconCurrencyDollar } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

interface ClienteInfoModalProps {
    cliente: Cliente;
    isOpen: boolean;
    onClose: () => void;
}

export default function ClienteInfoModal({ 
    cliente, 
    isOpen, 
    onClose 
}: ClienteInfoModalProps) {
    const [clienteCompleto, setClienteCompleto] = useState<Cliente | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && cliente.id) {
            fetchClienteCompleto();
        }
    }, [isOpen, cliente.id]);

    const fetchClienteCompleto = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/clientes/${cliente.id}`);
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setClienteCompleto(data.cliente);
                }
            }
        } catch (error) {
            console.error('Error al obtener información completa del cliente:', error);
        } finally {
            setLoading(false);
        }
    };
    const clienteData = clienteCompleto || cliente;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <IconInfoCircle className="h-5 w-5" />
                        Información del Cliente - {clienteData.nombre}
                    </DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="space-y-6 py-4">
                        {/* Información Personal */}
                        <div className="bg-muted/50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <IconUser className="h-5 w-5 text-blue-600" />
                                <h3 className="text-lg font-semibold">Información Personal</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Nombre:</span>
                                    <p className="font-medium text-lg">{clienteData.nombre || '-'}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">DNI:</span>
                                    <p className="font-medium text-lg">{clienteData.dni || '-'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Tipo de Cliente */}
                        <div className="bg-muted/50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <IconId className="h-5 w-5 text-purple-600" />
                                <h3 className="text-lg font-semibold">Tipo de Cliente</h3>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Estado:</span>
                                <div className="mt-1">
                                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                                        clienteData.tipo === 'comprador' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {clienteData.tipo === 'comprador' ? 'Comprador' : 'Interesado'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Información de Contacto */}
                        <div className="bg-muted/50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <IconMail className="h-5 w-5 text-green-600" />
                                <h3 className="text-lg font-semibold">Contacto</h3>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Email:</span>
                                    <p className="font-medium text-lg">{clienteData.email || '-'}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Teléfono:</span>
                                    <p className="font-medium text-lg">{clienteData.telefono || '-'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Historial de Compras */}
                        {clienteData.ventas && clienteData.ventas.length > 0 && (
                            <div className="bg-muted/50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <IconShoppingCart className="h-5 w-5 text-orange-600" />
                                    <h3 className="text-lg font-semibold">Historial de Compras ({clienteData.ventas.length})</h3>
                                </div>
                                <div className="space-y-4">
                                    {clienteData.ventas.map((venta, index) => (
                                        <div key={venta.venta_id} className="bg-background rounded-lg p-4 border">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <IconCalendar className="h-4 w-4 text-muted-foreground" />
                                                    <span className="font-medium">{venta.fecha}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <IconCurrencyDollar className="h-4 w-4 text-green-600" />
                                                    <span className="font-bold text-green-600">
                                                        ${venta.valor_venta_ars.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            {venta.vehiculo && (
                                                <div className="flex items-center gap-2 mb-2">
                                                    <IconCar className="h-4 w-4 text-blue-600" />
                                                    <span className="font-medium">
                                                        {venta.vehiculo.marca} {venta.vehiculo.modelo} ({venta.vehiculo.anio})
                                                    </span>
                                                    <span className="text-muted-foreground">- {venta.vehiculo.dominio}</span>
                                                </div>
                                            )}
                                            
                                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                                <span>Vendedor: {venta.vendedor}</span>
                                                <span>Ganancia: ${venta.ganancia_real_ars.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Observaciones */}
                        {clienteData.observaciones && (
                            <div className="bg-muted/50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <IconFileText className="h-5 w-5 text-purple-600" />
                                    <h3 className="text-lg font-semibold">Observaciones</h3>
                                </div>
                                <div className="bg-background rounded-md p-3 border">
                                    <p className="text-sm whitespace-pre-wrap">{clienteData.observaciones}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex justify-end pt-4">
                    <DialogClose asChild>
                        <Button variant="outline">Cerrar</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
}
