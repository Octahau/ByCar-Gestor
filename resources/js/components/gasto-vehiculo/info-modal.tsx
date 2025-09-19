import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { IconInfoCircle, IconUser, IconCalendar, IconCurrencyDollar, IconCar, IconFileText, IconReceipt } from '@tabler/icons-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface GastoVehiculoInfo {
    id: number;
    operador: string;
    tipo_gasto: string | null;
    descripcion: string | null;
    importe_usd: number | null;
    importe_ars: number | null;
    dominio: string | null;
    fecha: string | null;
}

interface InfoGastoModalProps {
    gasto: GastoVehiculoInfo | null;
    isOpen: boolean;
    onClose: () => void;
}

export function InfoGastoModal({ gasto, isOpen, onClose }: InfoGastoModalProps) {
    if (!gasto) return null;

    const formatCurrency = (amount: number | null, currency: 'ARS' | 'USD') => {
        if (!amount) return '-';
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
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
                        Información del Gasto de Vehículo
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
                                <label className="text-sm font-medium text-muted-foreground">Tipo de Gasto</label>
                                <p className="text-sm font-medium">{gasto.tipo_gasto || '-'}</p>
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

                    {/* Información del Vehículo */}
                    <div className="bg-muted/50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <IconCar className="h-4 w-4" />
                            Vehículo
                        </h3>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Dominio</label>
                            <p className="text-sm font-medium">{gasto.dominio || '-'}</p>
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
                                <label className="text-sm font-medium text-muted-foreground">Importe ARS</label>
                                <p className="text-sm font-medium">
                                    {gasto.importe_ars ? formatCurrency(gasto.importe_ars, 'ARS') : '-'}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Importe USD</label>
                                <p className="text-sm font-medium">
                                    {gasto.importe_usd ? formatCurrency(gasto.importe_usd, 'USD') : '-'}
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
