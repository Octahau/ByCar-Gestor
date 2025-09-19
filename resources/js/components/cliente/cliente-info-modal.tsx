'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Cliente } from '@/types';
import { IconInfoCircle, IconUser, IconMail, IconId, IconFileText } from '@tabler/icons-react';

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
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <IconInfoCircle className="h-5 w-5" />
                        Información del Cliente - {cliente.nombre}
                    </DialogTitle>
                </DialogHeader>

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
                                <p className="font-medium text-lg">{cliente.nombre || '-'}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">DNI:</span>
                                <p className="font-medium text-lg">{cliente.dni || '-'}</p>
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
                                    cliente.tipo === 'comprador' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {cliente.tipo === 'comprador' ? 'Comprador' : 'Interesado'}
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
                                <p className="font-medium text-lg">{cliente.email || '-'}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Teléfono:</span>
                                <p className="font-medium text-lg">{cliente.telefono || '-'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Observaciones */}
                {cliente.observaciones && (
                    <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <IconFileText className="h-5 w-5 text-purple-600" />
                            <h3 className="text-lg font-semibold">Observaciones</h3>
                        </div>
                        <div className="bg-background rounded-md p-3 border">
                            <p className="text-sm whitespace-pre-wrap">{cliente.observaciones}</p>
                        </div>
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
