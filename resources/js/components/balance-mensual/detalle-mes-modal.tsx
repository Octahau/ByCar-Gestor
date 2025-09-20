import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from '@/components/ui/dialog';
import { 
    IconChartBar, 
    IconUsers, 
    IconTrendingUp, 
    IconCalendar,
    IconCurrencyDollar,
    IconInfoCircle
} from '@tabler/icons-react';

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

interface DetalleMesModalProps {
    isOpen: boolean;
    onClose: () => void;
    mesData: MesData | null;
    vendedores: string[];
}

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

export default function DetalleMesModal({ isOpen, onClose, mesData, vendedores }: DetalleMesModalProps) {
    if (!isOpen || !mesData) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <IconCalendar className="h-5 w-5" />
                        Detalle del Mes: {mesData.mes}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Resumen General */}
                    <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <IconChartBar className="h-5 w-5 text-blue-600" />
                            <h3 className="text-lg font-semibold">Resumen General</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Total Ventas:</span>
                                <p className="font-medium text-2xl text-blue-600">{mesData.total.ventas}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Total ARS:</span>
                                <p className="font-medium text-lg">{formatCurrency(mesData.total.valor_ars)}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-muted-foreground">Total USD:</span>
                                <p className="font-medium text-lg">{formatUSD(mesData.total.valor_usd)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Desglose por Vendedor */}
                    <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <IconUsers className="h-5 w-5 text-green-600" />
                            <h3 className="text-lg font-semibold">Desglose por Vendedor</h3>
                        </div>
                        <div className="space-y-3">
                            {vendedores.map((vendedor, index) => {
                                const data = mesData.vendedores[vendedor] || { ventas: 0, valor_ars: 0, valor_usd: 0 };
                                
                                // Colores alternados para cada vendedor (más oscuros)
                                const colors = [
                                    { bg: 'bg-blue-100', border: 'border-blue-400', avatar: 'bg-blue-600', text: 'text-blue-100', name: 'text-blue-900' },
                                    { bg: 'bg-green-100', border: 'border-green-400', avatar: 'bg-green-600', text: 'text-green-100', name: 'text-green-900' },
                                    { bg: 'bg-purple-100', border: 'border-purple-400', avatar: 'bg-purple-600', text: 'text-purple-100', name: 'text-purple-900' },
                                    { bg: 'bg-orange-100', border: 'border-orange-400', avatar: 'bg-orange-600', text: 'text-orange-100', name: 'text-orange-900' },
                                    { bg: 'bg-pink-100', border: 'border-pink-400', avatar: 'bg-pink-600', text: 'text-pink-100', name: 'text-pink-900' },
                                    { bg: 'bg-indigo-100', border: 'border-indigo-400', avatar: 'bg-indigo-600', text: 'text-indigo-100', name: 'text-indigo-900' }
                                ];
                                
                                const colorScheme = colors[index % colors.length];
                                
                                return (
                                    <div key={vendedor} className={`flex items-center justify-between p-4 border-2 rounded-xl ${colorScheme.bg} ${colorScheme.border} hover:shadow-md transition-shadow`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 ${colorScheme.avatar} rounded-full flex items-center justify-center shadow-sm`}>
                                                <span className={`text-lg font-bold ${colorScheme.text}`}>
                                                    {vendedor.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <div className={`font-bold text-xl ${colorScheme.name}`}>{vendedor}</div>
                                                <div className={`text-sm font-medium ${colorScheme.text}`}>
                                                    {data.ventas} venta{data.ventas !== 1 ? 's' : ''}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-xl text-gray-900">{formatCurrency(data.valor_ars)}</div>
                                            <div className="text-sm font-medium text-gray-600">{formatUSD(data.valor_usd)}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Estadísticas del Mes */}
                    <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <IconTrendingUp className="h-5 w-5 text-purple-600" />
                            <h3 className="text-lg font-semibold">Estadísticas del Mes</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Promedio por venta (ARS):</span>
                                    <p className="font-medium text-lg">
                                        {mesData.total.ventas > 0 
                                            ? formatCurrency(mesData.total.valor_ars / mesData.total.ventas)
                                            : '$0'
                                        }
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Vendedor con más ventas:</span>
                                    <p className="font-medium text-lg">
                                        {(() => {
                                            const vendedorConMasVentas = vendedores.reduce((max, vendedor) => {
                                                const maxVentas = mesData.vendedores[max]?.ventas || 0;
                                                const ventasActuales = mesData.vendedores[vendedor]?.ventas || 0;
                                                return ventasActuales > maxVentas ? vendedor : max;
                                            });
                                            return vendedorConMasVentas;
                                        })()}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Vendedores activos:</span>
                                    <p className="font-medium text-lg">
                                        <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800">
                                            {vendedores.filter(v => (mesData.vendedores[v]?.ventas || 0) > 0).length}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">Mes del año:</span>
                                    <p className="font-medium text-lg">{mesData.mes_numero}</p>
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
