import {
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconLayoutColumns,
    IconEye,
} from '@tabler/icons-react';
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DetalleMesModal from './detalle-mes-modal';

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

interface BalanceTableProps {
    balanceData: MesData[];
    vendedores: string[];
    totales: Totales;
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

// Crear columnas dinámicas basadas en los vendedores
const createColumns = (vendedores: string[], onOpenDetalle: (mesData: MesData) => void): ColumnDef<MesData>[] => {
    const columns: ColumnDef<MesData>[] = [
        {
            accessorKey: 'mes',
            header: 'Mes',
            cell: ({ getValue }) => (
                <div className="font-medium">{getValue<string>()}</div>
            ),
        },
    ];

    // Agregar columnas para cada vendedor
    vendedores.forEach((vendedor) => {
        columns.push({
            id: `vendedor_${vendedor}`,
            header: vendedor,
            cell: ({ row }) => {
                const data = row.original.vendedores[vendedor] || { ventas: 0, valor_ars: 0, valor_usd: 0 };
                return (
                    <div className="text-center">
                        <div className="font-medium text-lg">{data.ventas}</div>
                    </div>
                );
            },
        });
    });

    // Columna de totales
    columns.push({
        id: 'total',
        header: 'Total',
        cell: ({ row }) => {
            const total = row.original.total;
            return (
                <div className="text-center">
                    <div className="font-bold text-lg">{total.ventas}</div>
                </div>
            );
        },
    });

    // Columna de acciones
    columns.push({
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => {
            return (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onOpenDetalle(row.original)}
                    className="h-8 w-8 p-0"
                >
                    <IconEye className="h-4 w-4" />
                    <span className="sr-only">Ver detalle</span>
                </Button>
            );
        },
    });

    return columns;
};

export function BalanceTable({ balanceData, vendedores, totales }: BalanceTableProps) {
    const [isDetalleModalOpen, setIsDetalleModalOpen] = React.useState(false);
    const [mesSeleccionado, setMesSeleccionado] = React.useState<MesData | null>(null);

    // Función para abrir el modal de detalle
    const openDetalleModal = React.useCallback((mesData: MesData) => {
        setMesSeleccionado(mesData);
        setIsDetalleModalOpen(true);
    }, []);

    const columns = React.useMemo(() => createColumns(vendedores, openDetalleModal), [vendedores, openDetalleModal]);

    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 12, // Mostrar 12 meses por página
    });

    const table = useReactTable({
        data: balanceData,
        columns,
        state: {
            sorting,
            columnVisibility,
            columnFilters,
            pagination,
        },
        getRowId: (row) => row.mes,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    });


    return (
        <div className="w-full">
            <div className="flex items-center justify-between px-4 lg:px-6 mb-4">
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <IconLayoutColumns />
                                <span className="hidden lg:inline">Modificar columnas</span>
                                <span className="lg:hidden">Columnas</span>
                                <IconChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            {table
                                .getAllColumns()
                                .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                        >
                                            {column.id === 'mes' ? 'Mes' : 
                                             column.id === 'total' ? 'Total' :
                                             column.id.startsWith('vendedor_') ? 
                                                column.id.replace('vendedor_', '') : 
                                                column.id}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            
            <div className="overflow-hidden rounded-lg border">
                <Table>
                    <TableHeader className="sticky top-0 z-10 bg-muted">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} colSpan={header.colSpan} className="text-center">
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="hover:bg-muted/50">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Sin datos de balance.
                                </TableCell>
                            </TableRow>
                        )}
                        
                        {/* Fila de totales */}
                        {table.getRowModel().rows?.length > 0 && (
                            <TableRow className="border-t-2 border-primary bg-primary/5 font-bold">
                                <TableCell className="font-bold text-lg">TOTAL</TableCell>
                                {vendedores.map((vendedor) => {
                                    const total = totales.vendedores[vendedor];
                                    return (
                                        <TableCell key={vendedor} className="text-center">
                                            <div className="space-y-1">
                                                <div className="text-lg">{total.ventas}</div>
                                                <div className="text-sm">{formatCurrency(total.valor_ars)}</div>
                                                <div className="text-sm">{formatUSD(total.valor_usd)}</div>
                                            </div>
                                        </TableCell>
                                    );
                                })}
                                <TableCell className="text-center">
                                    <div className="space-y-1">
                                        <div className="text-lg">{totales.general.ventas}</div>
                                        <div className="text-sm">{formatCurrency(totales.general.valor_ars)}</div>
                                        <div className="text-sm">{formatUSD(totales.general.valor_usd)}</div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            
            <div className="flex items-center justify-between px-4 mt-4">
                <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
                    {table.getFilteredRowModel().rows.length} mes(es) mostrado(s).
                </div>
                <div className="flex w-full items-center gap-8 lg:w-fit">
                    <div className="hidden items-center gap-2 lg:flex">
                        <Label htmlFor="rows-per-page" className="text-sm font-medium">
                            Filas por página
                        </Label>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value));
                            }}
                        >
                            <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                                <SelectValue placeholder={table.getState().pagination.pageSize} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[6, 12, 24, 36].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex w-fit items-center justify-center text-sm font-medium">
                        Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                    </div>
                    <div className="ml-auto flex items-center gap-2 lg:ml-0">
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Ir a la primera página</span>
                            <IconChevronsLeft />
                        </Button>
                        <Button
                            variant="outline"
                            className="size-8"
                            size="icon"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Ir a la página previa</span>
                            <IconChevronLeft />
                        </Button>
                        <Button
                            variant="outline"
                            className="size-8"
                            size="icon"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Ir a la próxima página</span>
                            <IconChevronRight />
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden size-8 lg:flex"
                            size="icon"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Ir a la última página</span>
                            <IconChevronsRight />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Modal de detalle del mes */}
            <DetalleMesModal
                isOpen={isDetalleModalOpen}
                onClose={() => setIsDetalleModalOpen(false)}
                mesData={mesSeleccionado}
                vendedores={vendedores}
            />
        </div>
    );
}