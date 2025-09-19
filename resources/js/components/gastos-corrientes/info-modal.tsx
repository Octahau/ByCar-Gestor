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

                <div className="space-y-6">
                    {/* Información General */}
                    <div className="bg-muted/50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <IconFileText className="h-4 w-4" />
                            Información General
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Motivo</label>
                                <p className="text-sm font-medium">{gasto.item || '-'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Fecha</label>
                                <p className="text-sm font-medium flex items-center gap-1">
                                    <IconCalendar className="h-3 w-3" />
                                    {gasto.fecha ? formatDate(gasto.fecha) : '-'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Información del Operador */}
                    <div className="bg-muted/50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <IconUser className="h-4 w-4" />
                            Operador
                        </h3>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Responsable</label>
                            <p className="text-sm font-medium">{gasto.operador || '-'}</p>
                        </div>
                    </div>

                    {/* Información Financiera */}
                    <div className="bg-muted/50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <IconCurrencyDollar className="h-4 w-4" />
                            Información Financiera
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Importe</label>
                                <p className="text-sm font-medium">
                                    {gasto.importe ? formatCurrency(gasto.importe) : '-'}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Fondo</label>
                                <p className="text-sm font-medium flex items-center gap-1">
                                    <IconWallet className="h-3 w-3" />
                                    {gasto.fondo || '-'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Descripción */}
                    {gasto.descripcion && (
                        <div className="bg-muted/50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <IconFileText className="h-4 w-4" />
                                Descripción
                            </h3>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Detalles</label>
                                <p className="text-sm font-medium mt-1 whitespace-pre-wrap">
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
