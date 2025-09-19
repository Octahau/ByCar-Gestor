import {
    IconChevronDown,
    IconDotsVertical,
    IconLayoutColumns,
    IconInfoCircle,
    IconEdit,
    IconTrash,
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
} from '@tabler/icons-react';
import {
    ColumnDef,
    ColumnFiltersState,
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
import EditGastoModal from './edit-modal';
import InfoGastoModal from './info-modal';
import DeleteModal from '@/components/delete-modal';
import toast from 'react-hot-toast';

export const schema = z.object({
    id: z.number().int(),
    operador: z.string(),
    item: z.string().nullable(),
    descripcion: z.string().nullable(),
    importe: z.number().nullable(),
    fondo: z.string().nullable(),
    fecha: z.string().nullable(),
});

function ActionsCell({ row, onGastoActualizado }: { row: { original: z.infer<typeof schema> }, onGastoActualizado?: () => void }) {
    const gasto = row.original;
    const [isInfoModalOpen, setIsInfoModalOpen] = React.useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch(`/GastosCorrientes/${gasto.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
            });

            const result = await response.json();
            
            if (result.success) {
                toast.success('Gasto eliminado correctamente');
                if (onGastoActualizado) {
                    onGastoActualizado();
                } else {
                    window.location.reload();
                }
            } else {
                toast.error('Error al eliminar gasto: ' + (result.message || ''));
            }
        } catch (error) {
            console.error('Error al eliminar gasto:', error);
            toast.error('Error al eliminar gasto');
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    const handleGastoActualizado = () => {
        if (onGastoActualizado) {
            onGastoActualizado();
        } else {
            window.location.reload();
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
                <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem onClick={() => setIsInfoModalOpen(true)}>
                        <IconInfoCircle className="mr-2 h-4 w-4" />
                        Información
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                        <IconEdit className="mr-2 h-4 w-4" />
                        Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setIsDeleteModalOpen(true)}
                    >
                        <IconTrash className="mr-2 h-4 w-4" />
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
                onGastoActualizado={handleGastoActualizado}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Eliminar gasto corriente"
                description="¿Estás seguro de que quieres eliminar este gasto? Esta acción no se puede deshacer."
                itemName={`${gasto.item} - ${gasto.operador}`}
                isLoading={isDeleting}
            />
        </>
    );
}

const createColumns = (onGastoActualizado?: () => void): ColumnDef<z.infer<typeof schema>>[] => [
    { accessorKey: 'operador', header: 'Operador' },
    { accessorKey: 'item', header: 'Motivo' },
    { accessorKey: 'descripcion', header: 'Descripción' },
    { 
        accessorKey: 'importe', 
        header: 'Importe', 
        cell: ({ getValue }) => {
            const value = getValue<number>();
            return value ? `$${value.toLocaleString()}` : '-';
        }
    },
    { 
        accessorKey: 'fondo', 
        header: 'Fondo', 
        cell: ({ getValue }) => {
            const value = getValue<string>();
            return value || '-';
        }
    },
    {
        accessorKey: 'fecha',
        header: 'Fecha',
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
        cell: ({ row }) => <ActionsCell row={row} onGastoActualizado={onGastoActualizado} />,
    },
];

export function DataTable({ 
    data: initialData, 
    searchTerm = '', 
    onSearchChange,
    dateRange = undefined,
    onGastoActualizado
}: { 
    data: z.infer<typeof schema>[]; 
    searchTerm?: string; 
    onSearchChange?: (searchTerm: string) => void;
    dateRange?: DateRange | undefined;
    onGastoActualizado?: () => void;
}) {
    const [data, setData] = React.useState<z.infer<typeof schema>[]>(() => initialData ?? []);

    React.useEffect(() => {
        if (initialData) setData(initialData);
    }, [initialData]);

    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });

    // Filter data based on search term and date range
    const filteredData = React.useMemo(() => {
        let filtered = data;

        // Apply search filter (operador and item)
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim();
            filtered = filtered.filter((item) => {
                const operador = item.operador?.toLowerCase() || '';
                const itemText = item.item?.toLowerCase() || '';
                
                return operador.includes(searchLower) || itemText.includes(searchLower);
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

        return filtered;
    }, [data, searchTerm, dateRange]);

    const columns = createColumns(onGastoActualizado);

    const table = useReactTable({
        data: filteredData,
        columns,
        state: {
            sorting,
            columnVisibility,
            columnFilters,
            pagination,
        },
        getRowId: (row) => {
            if (!row || !row.id) {
                return `row-${Math.random()}`;
            }
            return row.id.toString();
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
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
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
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