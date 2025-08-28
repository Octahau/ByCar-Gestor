import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type UniqueIdentifier,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconDotsVertical,
    IconGripVertical,
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
    Row,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import { format, parseISO } from 'date-fns';
import * as React from 'react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { ChartConfig } from '@/components/ui/chart';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';

export const schema = z.object({
    id: z.number(),
    marca: z.string().optional(),
    modelo: z.string().optional(),
    dominio: z.string().optional(),
    procedencia: z.string().optional(),
    valor_venta_ars: z.number().optional(),
    valor_venta_usd: z.number().optional(),
    ganancia_real_ars: z.number().optional(),
    ganancia_real_usd: z.number().optional(),
    fecha: z.string().optional(),
    vendedor: z.string().optional(),
});
// Create a separate component for the drag handle
function DragHandle({ id }: { id: number }) {
    const { attributes, listeners } = useSortable({
        id,
    });

    return (
        <Button {...attributes} {...listeners} variant="ghost" size="icon" className="size-7 text-muted-foreground hover:bg-transparent">
            <IconGripVertical className="size-3 text-muted-foreground" />
            <span className="sr-only">Reordenar</span>
        </Button>
    );
}

const columns: ColumnDef<z.infer<typeof schema>>[] = [
    {
        id: 'drag',
        header: () => null,
        cell: ({ row }) => <DragHandle id={row.original.id} />,
    },
    {
        id: 'select',
        header: ({ table }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
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
        id: 'actions',
        cell: () => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="size-8" size="icon">
                        <IconDotsVertical />
                        <span className="sr-only">Abrir menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem>Informacion</DropdownMenuItem>
                    <DropdownMenuItem>Marcar como favorito</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">Eliminar</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
    const { transform, transition, setNodeRef, isDragging } = useSortable({
        id: row.original.id,
    });

    return (
        <TableRow
            data-state={row.getIsSelected() && 'selected'}
            data-dragging={isDragging}
            ref={setNodeRef}
            className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
            style={{
                transform: CSS.Transform.toString(transform),
                transition: transition,
            }}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
            ))}
        </TableRow>
    );
}

export function DataTable({ data: initialData }: { data: z.infer<typeof schema>[] }) {
    const [data, setData] = React.useState<z.infer<typeof schema>[]>(() => initialData ?? []);

    React.useEffect(() => {
        if (initialData) setData(initialData);
    }, [initialData]);

    const [rowSelection, setRowSelection] = React.useState({});
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const sortableId = React.useId();
    const sensors = useSensors(useSensor(MouseSensor, {}), useSensor(TouchSensor, {}), useSensor(KeyboardSensor, {}));

    const dataIds = React.useMemo<UniqueIdentifier[]>(() => data?.map(({ id }) => id) || [], [data]);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination,
        },
        getRowId: (row) => row.id.toString(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
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

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (active && over && active.id !== over.id) {
            setData((data) => {
                const oldIndex = dataIds.indexOf(active.id);
                const newIndex = dataIds.indexOf(over.id);
                return arrayMove(data, oldIndex, newIndex);
            });
        }
    }

    return (
        <Tabs defaultValue="outline" className="w-full flex-col justify-start gap-6">
            <div className="flex items-center justify-between px-4 lg:px-6">
                <Label htmlFor="view-selector" className="sr-only">
                    View
                </Label>
                {/* <Select defaultValue="outline">
                    <SelectTrigger className="flex w-fit @4xl/main:hidden" size="sm" id="view-selector">
                        <SelectValue placeholder="Select a view" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="outline">Outline</SelectItem>
                        <SelectItem value="past-performance">Past Performance</SelectItem>
                        <SelectItem value="key-personnel">Key Personnel</SelectItem>
                        <SelectItem value="focus-documents">Focus Documents</SelectItem>
                    </SelectContent>
                </Select>
                <TabsList className="hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:px-1 @4xl/main:flex">
                    <TabsTrigger value="outline">Outline</TabsTrigger>
                    <TabsTrigger value="past-performance">
                        Past Performance <Badge variant="secondary">3</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="key-personnel">
                        Key Personnel <Badge variant="secondary">2</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="focus-documents">Focus Documents</TabsTrigger>
                </TabsList> */}
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
                    {/*  <Button variant="outline" size="sm">
            <IconPlus />
            <span className="hidden lg:inline">Add Section</span>
          </Button> */}
                </div>
            </div>
            <TabsContent value="outline" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
                <div className="overflow-hidden rounded-lg border">
                    <DndContext
                        collisionDetection={closestCenter}
                        modifiers={[restrictToVerticalAxis]}
                        onDragEnd={handleDragEnd}
                        sensors={sensors}
                        id={sortableId}
                    >
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
                            <TableBody className="**:data-[slot=table-cell]:first:w-8">
                                {table.getRowModel().rows?.length ? (
                                    <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                                        {table.getRowModel().rows.map((row) => (
                                            <DraggableRow key={row.id} row={row} />
                                        ))}
                                    </SortableContext>
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            Sin resultados.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </DndContext>
                </div>
                <div className="flex items-center justify-between px-4">
                    <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
                        {table.getFilteredSelectedRowModel().rows.length} de {table.getFilteredRowModel().rows.length} fila(s) seleccionadas.
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
            </TabsContent>
            <TabsContent value="past-performance" className="flex flex-col px-4 lg:px-6">
                <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
            </TabsContent>
            <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
                <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
            </TabsContent>
            <TabsContent value="focus-documents" className="flex flex-col px-4 lg:px-6">
                <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
            </TabsContent>
        </Tabs>
    );
}

const chartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
];

const chartConfig = {
    desktop: {
        label: 'Desktop',
        color: 'var(--primary)',
    },
    mobile: {
        label: 'Mobile',
        color: 'var(--primary)',
    },
} satisfies ChartConfig;

function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
    const isMobile = useIsMobile();

    function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
        const isMobile = useIsMobile();

        return (
            <Drawer direction={isMobile ? 'bottom' : 'right'}>
                <DrawerTrigger asChild>
                    <Button variant="link" className="w-fit px-0 text-left text-foreground">
                        {item.marca} {item.modelo}
                    </Button>
                </DrawerTrigger>

                <DrawerContent>
                    <DrawerHeader className="gap-1">
                        <DrawerTitle>
                            {item.marca} {item.modelo}
                        </DrawerTitle>
                        <DrawerDescription>Detalles de la venta</DrawerDescription>
                    </DrawerHeader>

                    <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
                        <form className="flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor={`marca-${item.id}`}>Marca</Label>
                                    <Input id={`marca-${item.id}`} defaultValue={item.marca} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor={`modelo-${item.id}`}>Modelo</Label>
                                    <Input id={`modelo-${item.id}`} defaultValue={item.modelo} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor={`dominio-${item.id}`}>Dominio</Label>
                                    <Input id={`dominio-${item.id}`} defaultValue={item.dominio} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor={`procedencia-${item.id}`}>Procedencia</Label>
                                    <Input id={`procedencia-${item.id}`} defaultValue={item.procedencia} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor={`valor_venta_ars-${item.id}`}>Valor Venta ARS</Label>
                                    <Input id={`valor_venta_ars-${item.id}`} defaultValue={item.valor_venta_ars} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor={`valor_venta_usd-${item.id}`}>Valor Venta USD</Label>
                                    <Input id={`valor_venta_usd-${item.id}`} defaultValue={item.valor_venta_usd} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor={`ganancia_real_ars-${item.id}`}>Ganancia ARS</Label>
                                    <Input id={`ganancia_real_ars-${item.id}`} defaultValue={item.ganancia_real_ars} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor={`ganancia_real_usd-${item.id}`}>Ganancia USD</Label>
                                    <Input id={`ganancia_real_usd-${item.id}`} defaultValue={item.ganancia_real_usd} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor={`fecha-${item.id}`}>Fecha</Label>
                                    <Input id={`fecha-${item.id}`} defaultValue={item.fecha} />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor={`vendedor-${item.id}`}>Vendedor</Label>
                                    <Input id={`vendedor-${item.id}`} defaultValue={item.vendedor} />
                                </div>
                            </div>
                        </form>
                    </div>
                    <DrawerFooter>
                        <Button>Guardar</Button>
                        <DrawerClose asChild>
                            <Button variant="outline">Cerrar</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        );
    }
}
