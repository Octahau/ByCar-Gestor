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
import * as React from 'react';
import { z } from 'zod';
import { format, parseISO } from 'date-fns';

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
import EditVehiculoModal from './edit-modal';
import VehiculoInfoModal from './info-modal';
import toast from 'react-hot-toast';

export const schema = z.object({
    id: z.number(),
    marca: z.string().optional(),
    modelo: z.string().optional(),
    dominio: z.string().optional(),
    anio: z.number().optional(),
    color: z.string().optional(),
    kilometraje: z.number().optional(),
    precioARS: z.number().optional(),
    precioUSD: z.number().optional(),
    precio_venta_sugerido_ars: z.number().optional(),
    precio_venta_sugerido_usd: z.number().optional(),
    ubicacion: z.string().optional(),
    fecha: z.string().optional(),
    infoAuto: z.string().optional(),
    estado: z.string().optional(),
    tipo: z.string().optional(),
});

const columns: ColumnDef<z.infer<typeof schema>>[] = [
    { accessorKey: 'marca', header: 'Marca' },
    { accessorKey: 'modelo', header: 'Modelo' },
    { accessorKey: 'dominio', header: 'Dominio' },
    { accessorKey: 'anio', header: 'Año' },
    { accessorKey: 'color', header: 'Color' },
    { accessorKey: 'kilometraje', header: 'Kilometraje' },
    { accessorKey: 'precioARS', header: 'Precio ARS' },
    { accessorKey: 'precioUSD', header: 'Precio USD' },
    { 
        accessorKey: 'precio_venta_sugerido_ars', 
        header: 'Precio Venta Sugerido ARS',
        cell: ({ getValue }) => {
            const value = getValue<number>();
            return value ? `$${value.toLocaleString()}` : '-';
        }
    },
    { 
        accessorKey: 'precio_venta_sugerido_usd', 
        header: 'Precio Venta Sugerido USD',
        cell: ({ getValue }) => {
            const value = getValue<number>();
            return value ? `$${value.toLocaleString()}` : '-';
        }
    },
    { accessorKey: 'ubicacion', header: 'Ubicación' },
    {
        accessorKey: 'fecha',
        header: 'Fecha adquisición',
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
        accessorKey: 'tipo', 
        header: 'Tipo',
        cell: ({ getValue }) => {
            const tipo = getValue<string>();
            return tipo === 'camioneta' ? 'Camioneta' : 'Auto';
        }
    },
    { accessorKey: 'estado', header: 'Estado' },
    {
        id: 'actions',
        cell: ({ row }) => <ActionsCell row={row} />,
    },
];

// Componente para las acciones de cada fila
function ActionsCell({ row }: { row: any }) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const vehiculo = row.original;

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch(`/vehiculos/${vehiculo.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
            });

            const result = await response.json();
            
            if (result.success) {
                toast.success('Vehículo eliminado correctamente');
                // Recargar la página para actualizar la lista
                window.location.reload();
            } else {
                toast.error('Error al eliminar vehículo: ' + (result.message || ''));
            }
        } catch (error) {
            console.error('Error al eliminar vehículo:', error);
            toast.error('Error al eliminar vehículo');
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    const handleVehiculoActualizado = (vehiculoActualizado: any) => {
        // Recargar la página para actualizar la lista con los cambios
        window.location.reload();
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
                title="Eliminar vehículo"
                description="¿Estás seguro de que quieres eliminar este vehículo? Esta acción no se puede deshacer."
                itemName={`${vehiculo.marca} ${vehiculo.modelo} - ${vehiculo.dominio}`}
                isLoading={isDeleting}
            />

            <EditVehiculoModal
                vehiculo={vehiculo}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onVehiculoActualizado={handleVehiculoActualizado}
            />

            <VehiculoInfoModal
                vehiculo={vehiculo}
                isOpen={isInfoModalOpen}
                onClose={() => setIsInfoModalOpen(false)}
            />
        </>
    );
}

export function DataTable({ data: initialData }: { data: z.infer<typeof schema>[] }) {
    const [data, setData] = React.useState<z.infer<typeof schema>[]>(() => initialData ?? []);

    React.useEffect(() => {
        if (initialData) setData(initialData);
    }, [initialData]);

    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
        color: false,
        precioUSD: false,
        precio_venta_sugerido_usd: false,
    });
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const table = useReactTable({
        data,
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
        <div className="w-full flex-col justify-start gap-6">
            <div className="flex items-center justify-between px-4 lg:px-6 mb-6">
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
            <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
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
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
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
                <div className="flex items-center justify-between px-4">
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
        </div>
    );
}


