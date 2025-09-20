'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from '@/components/ui/dialog';
import { IconInfoCircle, IconUser, IconFileText, IconCalendar, IconCurrencyDollar, IconWallet } from '@tabler/icons-react';
import { GastoCorrienteTable } from '@/types';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface InfoGastoModalProps {
    gasto: GastoCorrienteTable;
    isOpen: boolean;
    onClose: () => void;
}

export default function InfoGastoModal({
    gasto,
    isOpen,
    onClose,
}: InfoGastoModalProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        try {
            const parsed = parseISO(dateString);
            return format(parsed, 'dd/MM/yyyy', { locale: es });
        } catch {
            return dateString;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <IconInfoCircle className="h-5 w-5" />
                        Información del Gasto Corriente
                    </DialogTitle>
                    <DialogClose asChild>
                        <Button variant="ghost" size="icon" className="absolute right-4 top-4">
                            ×
                        </Button>
                    </DialogClose>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Información General */}
                    <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <IconFileText className="h-5 w-5 text-blue-600" />
                            <h3 className="text-lg font-semibold">Información General</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Motivo:</span>
                                <p className="font-medium">{gasto.item || '-'}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Fecha:</span>
                                <p className="font-medium flex items-center gap-1">
                                    <IconCalendar className="h-4 w-4 text-muted-foreground" />
                                    {gasto.fecha ? formatDate(gasto.fecha) : '-'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Información del Operador */}
                    <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <IconUser className="h-5 w-5 text-green-600" />
                            <h3 className="text-lg font-semibold">Operador</h3>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-muted-foreground">Responsable:</span>
                            <p className="font-medium">{gasto.operador || '-'}</p>
                        </div>
                    </div>

                    {/* Información Financiera */}
                    <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <IconCurrencyDollar className="h-5 w-5 text-orange-600" />
                            <h3 className="text-lg font-semibold">Información Financiera</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Importe:</span>
                                <p className="font-medium text-lg text-red-600">
                                    {gasto.importe ? formatCurrency(gasto.importe) : '-'}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Fondo:</span>
                                <p className="font-medium flex items-center gap-1">
                                    <IconWallet className="h-4 w-4 text-muted-foreground" />
                                    {gasto.fondo || '-'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Descripción */}
                    {gasto.descripcion && (
                        <div className="bg-muted/50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <IconFileText className="h-5 w-5 text-purple-600" />
                                <h3 className="text-lg font-semibold">Descripción</h3>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Detalles:</span>
                                <p className="font-medium mt-1 whitespace-pre-wrap">
                                    {gasto.descripcion}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end pt-4">
                    <Button onClick={onClose}>
                        Cerrar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
