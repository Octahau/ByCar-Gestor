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
import { Cliente } from '@/types';

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
import ClienteInfoModal from './cliente-info-modal';
import ClienteEditModal from './cliente-edit-modal';
import toast from 'react-hot-toast';

// Componente para las acciones de cada fila
function ActionsCell({ row, onClienteUpdated }: { row: { original: Cliente }, onClienteUpdated: (cliente: Cliente) => void }) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const cliente = row.original;

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch(`/clientes/${cliente.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
            });

            const result = await response.json();
            
            if (result.success) {
                toast.success('Cliente eliminado correctamente');
                // Recargar la página para actualizar la lista
                window.location.reload();
            } else {
                toast.error('Error al eliminar cliente: ' + (result.message || ''));
            }
        } catch (error) {
            console.error('Error al eliminar cliente:', error);
            toast.error('Error al eliminar cliente');
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
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

            <ClienteInfoModal
                cliente={cliente}
                isOpen={isInfoModalOpen}
                onClose={() => setIsInfoModalOpen(false)}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Eliminar cliente"
                description="¿Estás seguro de que quieres eliminar este cliente? Esta acción no se puede deshacer."
                itemName={`${cliente.nombre} - ${cliente.dni}`}
                isLoading={isDeleting}
            />

            {/* TODO: Agregar modal de edición cuando esté disponible */}
                    <ClienteEditModal
                        cliente={cliente}
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        onClienteUpdated={onClienteUpdated}
                    />
        </>
    );
}

const createColumns = (onClienteUpdated: (cliente: Cliente) => void): ColumnDef<Cliente>[] => [
    { accessorKey: 'nombre', header: 'Nombre', cell: ({ getValue }) => getValue<string>() || '-' },
    { accessorKey: 'dni', header: 'DNI', cell: ({ getValue }) => getValue<string>() || '-' },
    { accessorKey: 'telefono', header: 'Teléfono', cell: ({ getValue }) => getValue<string>() || '-' },
    { accessorKey: 'email', header: 'Email', cell: ({ getValue }) => getValue<string>() || '-' },
    { 
        accessorKey: 'tipo', 
        header: 'Tipo',
        cell: ({ getValue }) => {
            const tipo = getValue<string>();
            return (
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    tipo === 'comprador' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                }`}>
                    {tipo === 'comprador' ? 'Comprador' : 'Interesado'}
                </span>
            );
        }
    },
    {
        id: 'actions',
        cell: ({ row }) => <ActionsCell row={row} onClienteUpdated={onClienteUpdated} />,
    },
];

export function DataTable({ 
    data: initialData, 
    searchTerm = '', 
    filtros = { tipos: [] },
    onClienteUpdated
}: { 
    data: Cliente[]; 
    searchTerm?: string; 
    filtros?: { tipos: string[] };
    onClienteUpdated?: (cliente: Cliente) => void;
}) {
    const [data, setData] = React.useState<Cliente[]>(() => initialData ?? []);
    const columns = createColumns(onClienteUpdated || (() => {}));

    React.useEffect(() => {
        if (initialData) setData(initialData);
    }, [initialData]);

    // Filter data based on search term and filters
    const filteredData = React.useMemo(() => {
        let filtered = data;

        // Apply search filter (nombre or dni)
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim();
            filtered = filtered.filter((item) => {
                const nombre = item.nombre?.toLowerCase() || '';
                const dni = item.dni?.toLowerCase() || '';
                return nombre.includes(searchLower) || dni.includes(searchLower);
            });
        }

        // Apply tipo filter
        if (filtros.tipos.length > 0) {
            filtered = filtered.filter((item) => 
                filtros.tipos.includes(item.tipo)
            );
        }

        return filtered;
    }, [data, searchTerm, filtros]);

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