import {
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconDotsVertical,
    IconLayoutColumns,
    IconTrash,
    IconEdit,
    IconInfoCircle,
} from '@tabler/icons-react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import { format, parseISO, isWithinInterval } from 'date-fns';
import * as React from 'react';
import { z } from 'zod';
import { DateRange } from 'react-day-picker';

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
import { InfoGastoModal } from './info-modal';
import { EditGastoModal } from './edit-modal';
import DeleteModal from '@/components/delete-modal';
import { toast } from 'react-hot-toast';

export const schema = z.object({
    id: z.number().int(),
    operador: z.string(),
    tipo_gasto: z.string().nullable(),
    descripcion: z.string().nullable(),
    importe_usd: z.number().nullable(),
    importe_ars: z.number().nullable(),
    dominio: z.string().nullable(),
    fecha: z.string().nullable(),
});

const createColumns = (onGastoActualizado?: () => void): ColumnDef<z.infer<typeof schema>>[] => [
    { accessorKey: 'operador', header: 'Operador', cell: ({ getValue }) => getValue<string>() || '-' },
    { accessorKey: 'tipo_gasto', header: 'Motivo', cell: ({ getValue }) => getValue<string>() || '-' },
    { accessorKey: 'descripcion', header: 'Descripcion', cell: ({ getValue }) => getValue<string>() || '-' },
    { 
        accessorKey: 'importe_ars', 
        header: 'Importe (ARS)', 
        cell: ({ getValue }) => {
            const value = getValue<number>();
            if (!value) return '-';
            return new Intl.NumberFormat('es-AR', {
                style: 'currency',
                currency: 'ARS',
            }).format(value);
        }
    },
    { 
        accessorKey: 'importe_usd', 
        header: 'Importe (USD)', 
        cell: ({ getValue }) => {
            const value = getValue<number>();
            if (!value) return '-';
            return new Intl.NumberFormat('es-AR', {
                style: 'currency',
                currency: 'USD',
            }).format(value);
        }
    },
    { accessorKey: 'dominio', header: 'Dominio', cell: ({ getValue }) => getValue<string>() || '-' },
    {
        accessorKey: 'fecha',
        header: 'Fecha gasto',
        cell: ({ getValue }) => {
            const fechaRaw = getValue<string>();
            if (!fechaRaw) return '-';

            try {
                const parsed = parseISO(fechaRaw);
                return format(parsed, 'dd/MM/yyyy');
            } catch {
                return fechaRaw;
            }
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => <ActionsCell gasto={row.original} onGastoActualizado={onGastoActualizado} />,
    },
];

function ActionsCell({ gasto, onGastoActualizado }: { gasto: z.infer<typeof schema>; onGastoActualizado?: () => void }) {
    const [isInfoModalOpen, setIsInfoModalOpen] = React.useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

    const handleDelete = async () => {
        try {
            const response = await fetch(`/GastosVehiculos/${gasto.id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al eliminar el gasto');
            }

            toast.success('Gasto de vehículo eliminado correctamente');
            onGastoActualizado?.();
        } catch (error) {
            console.error('Error al eliminar gasto:', error);
            toast.error('Error al eliminar el gasto de vehículo');
        }
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
                <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => setIsInfoModalOpen(true)}>
                        <IconInfoCircle className="h-4 w-4 mr-2" />
                        Información
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                        <IconEdit className="h-4 w-4 mr-2" />
                        Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="text-red-600 focus:text-red-600"
                    >
                        <IconTrash className="h-4 w-4 mr-2" />
                        Eliminar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <InfoGastoModal
                gasto={gasto}
                isOpen={isInfoModalOpen}
                onClose={() => setIsInfoModalOpen(false)}
            />

            <EditGastoModal
                gasto={gasto}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onGastoActualizado={onGastoActualizado}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Eliminar Gasto de Vehículo"
                description="¿Estás seguro de que quieres eliminar este gasto? Esta acción no se puede deshacer."
            />
        </>
    );
}

export function DataTable({ 
    data: initialData, 
    searchTerm = '',
    dateRange = undefined,
    onGastoActualizado
}: { 
    data: z.infer<typeof schema>[]; 
    searchTerm?: string;
    dateRange?: DateRange | undefined;
    onGastoActualizado?: () => void;
}) {
    const [data, setData] = React.useState<z.infer<typeof schema>[]>(() => initialData ?? []);

    React.useEffect(() => {
        if (initialData) setData(initialData);
    }, [initialData]);

    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });

    // Filter data based on search term and date range
    const filteredData = React.useMemo(() => {
        let filtered = data;

        // Apply search filter (operador, tipo_gasto, and dominio)
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim();
            filtered = filtered.filter((item) => {
                const operador = item.operador?.toLowerCase() || '';
                const tipoGasto = item.tipo_gasto?.toLowerCase() || '';
                const dominio = item.dominio?.toLowerCase() || '';
                
                return operador.includes(searchLower) || tipoGasto.includes(searchLower) || dominio.includes(searchLower);
            });
        }

        // Apply date range filter
        if (dateRange?.from) {
            filtered = filtered.filter((item) => {
                if (!item.fecha) return false;
                
                try {
                    const itemDate = parseISO(item.fecha);
                    const fromDate = dateRange.from!;
                    const toDate = dateRange.to || dateRange.from!;
                    
                    return isWithinInterval(itemDate, { start: fromDate, end: toDate });
                } catch {
                    return false;
                }
            });
        }

        return filtered;
    }, [data, searchTerm, dateRange]);

    const columns = createColumns(onGastoActualizado);

    const table = useReactTable({
        data: filteredData,
        columns,
        state: {
            sorting,
            columnVisibility,
            pagination,
        },
        getRowId: (row) => {
            if (!row || !row.id) {
                return `row-${Math.random()}`;
            }
            return row.id.toString();
        },
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="w-full">
            <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="ml-auto">
                                <IconLayoutColumns className="mr-2 h-4 w-4" />
                                Modificar columnas
                                <IconChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
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
            <div className="rounded-md border">
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
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
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