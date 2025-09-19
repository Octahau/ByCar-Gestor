'use client';
import AddClienteModal from '@/components/cliente/cliente-modal';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Cliente, Venta, VentaTable, Empleado } from '@/types';
import { IconPlus } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface AddVentaModalProps {
    onVentaCreada: (venta: VentaTable) => void;
}



export default function AddVentaModal({ onVentaCreada }: AddVentaModalProps) {
    const [open, setOpen] = useState(false);
    const [openClienteModal, setOpenClienteModal] = useState(false);
    const [empleados, setEmpleados] = useState<Empleado[]>([]);

    const form = useForm<Venta>({
        defaultValues: { dniCliente: '', dominio: '', procedencia: '', valor_venta_ars: 0, valor_venta_usd: 0, fecha_venta: '', vendedor: '' },
    });

    // cargar empleados desde el back
    useEffect(() => {
        fetch('/empleados')
            .then((res) => res.json())
            .then((data) => setEmpleados(data))
            .catch((err) => console.error('Error cargando empleados:', err));
    }, []);

    const handleClienteCreado = (cliente: Cliente) => {
        setOpenClienteModal(false);
    };

    const onSubmit = async (data: Venta) => {
        const payload = { ...data, dominio: data.dominio.toUpperCase() || null };
        console.log('Payload venta:', payload);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch('/ventas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-CSRF-TOKEN': csrfToken || '' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            if (result.success) {
                onVentaCreada(result.venta);
                setOpen(false);
                toast.success('Venta registrada correctamente');
                form.reset();
            } else if (result.errors?.dniCliente) {
                toast.error('Cliente no registrado');
                setTimeout(() => setOpenClienteModal(true), 1500);
            } else if (result.errors?.dominio) {
                toast.error('Vehículo no registrado');
            } else {
                toast.error('Error al registrar venta: ' + (result.message || ''));
            }
        } catch (error) {
            console.error('Error fetch:', error);
            toast.error('Error al registrar venta: ' + (error instanceof Error ? error.message : ''));
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <IconPlus className="size-4" />
                        Registrar Venta
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Ingrese los datos de la venta</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Columna izquierda */}
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="dniCliente"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>DNI del Cliente *</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="text" required />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="dominio"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Dominio *</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="text" required />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="procedencia"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Procedencia *</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="text" required />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Columna derecha */}
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="valor_venta_ars"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Valor de Venta (ARS) *</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="number" required />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="valor_venta_usd"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Valor de Venta (USD) *</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="number" required />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="fecha_venta"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Fecha de Venta *</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="date" required />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Vendedor - ocupa todo el ancho */}
                            <FormField
                                control={form.control}
                                name="vendedor"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Vendedor *</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Seleccione un vendedor" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {empleados.map((empleado) => (
                                                        <SelectItem key={empleado.id} value={String(empleado.id)}>
                                                            {empleado.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex w-full justify-between gap-2 pt-4 border-t">
                                <DialogClose asChild>
                                    <Button variant="outline">Cancelar</Button>
                                </DialogClose>
                                <Button type="submit">Guardar</Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Modal cliente */}
            <AddClienteModal onClienteCreado={handleClienteCreado} open={openClienteModal} onOpenChange={setOpenClienteModal} />
        </>
    );
}
