 import {
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconDotsVertical,
    IconLayoutColumns,
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
import { format, parseISO, isWithinInterval } from 'date-fns';
import * as React from 'react';
import { VentaTable } from '@/types';
import { DateRange } from 'react-day-picker';
import { router } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DeleteModal from '@/components/delete-modal';
import EditVentaModal from './edit-modal';
import toast from 'react-hot-toast';

// Componente para las acciones de cada fila
function ActionsCell({ row }: { row: { original: VentaTable } }) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const venta = row.original;

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch(`/ventas/${venta.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
            });

            const result = await response.json();
            
            if (result.success) {
                toast.success('Venta eliminada correctamente');
                // Recargar la página para actualizar la lista
                window.location.reload();
            } else {
                toast.error('Error al eliminar venta: ' + (result.message || ''));
            }
        } catch (error) {
            console.error('Error al eliminar venta:', error);
            toast.error('Error al eliminar venta');
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    const handleVentaActualizada = () => {
        // Recargar la página para actualizar la lista con los cambios
        window.location.reload();
    };

    const handleVerDetalle = () => {
        router.visit(`/ventas/${venta.id}/detalle`);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="size-8" size="icon">
                        <IconDotsVertical />
                        <span className="sr-only">Abrir menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem onClick={handleVerDetalle}>
                        Información
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                        Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                        variant="destructive"
                        onClick={() => setIsDeleteModalOpen(true)}
                    >
                        Eliminar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Eliminar venta"
                description="¿Estás seguro de que quieres eliminar esta venta? Esta acción no se puede deshacer."
                itemName={`${venta.marca} ${venta.modelo} - ${venta.dominio}`}
                isLoading={isDeleting}
            />

            <EditVentaModal
                venta={venta}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onVentaActualizada={handleVentaActualizada}
            />
        </>
    );
}

const columns: ColumnDef<VentaTable>[] = [
    { accessorKey: 'marca', header: 'Marca', cell: ({ getValue }) => getValue<string>() || '-' },
    { accessorKey: 'modelo', header: 'Modelo', cell: ({ getValue }) => getValue<string>() || '-' },
    { accessorKey: 'dominio', header: 'Dominio', cell: ({ getValue }) => getValue<string>() || '-' },
    { accessorKey: 'procedencia', header: 'Procedencia', cell: ({ getValue }) => getValue<string>() || '-' },
    { accessorKey: 'valor_venta_ars', header: 'Valor venta ARS', cell: ({ getValue }) => getValue<number>()?.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) || '-' },
    { accessorKey: 'valor_venta_usd', header: 'Valor venta USD', cell: ({ getValue }) => getValue<number>()?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || '-' },
    { accessorKey: 'ganancia_real_ars', header: 'Ganancia ARS', cell: ({ getValue }) => getValue<number>()?.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) || '-' },
    { accessorKey: 'ganancia_real_usd', header: 'Ganancia USD', cell: ({ getValue }) => getValue<number>()?.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || '-' },
    { accessorKey: 'vendedor', header: 'Vendedor', cell: ({ getValue }) => getValue<string>() || '-' },
    {
        accessorKey: 'fecha',
        header: 'Fecha venta',
        cell: ({ getValue }) => {
            const fechaRaw = getValue<string>();
            if (!fechaRaw) return '-';

            try {
                // Intentamos parsear como ISO y formatear a dd/MM/yyyy
                const parsed = parseISO(fechaRaw);
                return format(parsed, 'dd/MM/yyyy');
            } catch {
                // Si no es ISO, lo mostramos tal cual
                return fechaRaw;
            }
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <ActionsCell row={row} />,
    },
];

export function DataTable({ 
    data: initialData, 
    searchTerm = '', 
    filtros = { vendedores: [] },
    dateRange = undefined
}: { 
    data: VentaTable[]; 
    searchTerm?: string; 
    filtros?: { vendedores: string[] };
    dateRange?: DateRange | undefined;
}) {
    const [data, setData] = React.useState<VentaTable[]>(() => initialData ?? []);

    React.useEffect(() => {
        if (initialData) setData(initialData);
    }, [initialData]);

    // Filter data based on search term, filters, and date range
    const filteredData = React.useMemo(() => {
        let filtered = data;

        // Apply search filter (cliente, marca, modelo, dominio)
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim();
            filtered = filtered.filter((item) => {
                const nombreCliente = item.nombreCliente?.toLowerCase() || '';
                const dniCliente = item.dniCliente?.toLowerCase() || '';
                const marca = item.marca?.toLowerCase() || '';
                const modelo = item.modelo?.toLowerCase() || '';
                const dominio = item.dominio?.toLowerCase() || '';
                
                return nombreCliente.includes(searchLower) || 
                       dniCliente.includes(searchLower) ||
                       marca.includes(searchLower) ||
                       modelo.includes(searchLower) ||
                       dominio.includes(searchLower);
            });
        }

        // Apply date range filter
        if (dateRange?.from) {
            filtered = filtered.filter((item) => {
                if (!item.fecha) return false;
                
                try {
                    const itemDate = parseISO(item.fecha);
                    
                    // Si solo hay fecha de inicio, filtrar desde esa fecha en adelante
                    if (dateRange.from && !dateRange.to) {
                        return itemDate >= dateRange.from;
                    }
                    
                    // Si hay rango completo, verificar si está dentro del intervalo
                    if (dateRange.from && dateRange.to) {
                        return isWithinInterval(itemDate, {
                            start: dateRange.from,
                            end: dateRange.to
                        });
                    }
                    
                    return false;
                } catch {
                    return false;
                }
            });
        }

        // Apply vendedor filter
        if (filtros.vendedores.length > 0) {
            filtered = filtered.filter((item) => 
                filtros.vendedores.includes(item.vendedor)
            );
        }

        return filtered;
    }, [data, searchTerm, filtros, dateRange]);

    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const table = useReactTable({
        data: filteredData,
        columns,
        state: {
            sorting,
            columnVisibility,
            columnFilters,
            pagination,
        },
        getRowId: (row) => row.id.toString(),
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
                                            {column.id}
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
                                        <TableHead key={header.id} colSpan={header.colSpan}>
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
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Sin resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between px-4 mt-4">
                <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
                    {table.getFilteredRowModel().rows.length} fila(s) total.
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
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex w-fit items-center justify-center text-sm font-medium">
                        Pagina {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </div>
                    <div className="ml-auto flex items-center gap-2 lg:ml-0">
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Ir a la primer pagina</span>
                            <IconChevronsLeft />
                        </Button>
                        <Button
                            variant="outline"
                            className="size-8"
                            size="icon"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Ir a la pagina previa</span>
                            <IconChevronLeft />
                        </Button>
                        <Button
                            variant="outline"
                            className="size-8"
                            size="icon"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Ir a la proxima pagina</span>
                            <IconChevronRight />
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden size-8 lg:flex"
                            size="icon"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Ir a la ultima pagina</span>
                            <IconChevronsRight />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}