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
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Ingrese los datos de la venta</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-2">
                            {[
                                { name: 'dniCliente', label: 'DNI del Cliente', required: true },
                                { name: 'dominio', label: 'Dominio', required: true },
                                { name: 'procedencia', label: 'Procedencia', required: true },
                                { name: 'valor_venta_ars', label: 'Valor de Venta (ARS)', type: 'number', required: true },
                                { name: 'valor_venta_usd', label: 'Valor de Venta (USD)', type: 'number', required: true },
                                { name: 'fecha_venta', label: 'Fecha de Venta', type: 'date', required: true },
                            ].map((field) => (
                                <FormField
                                    key={field.name}
                                    control={form.control}
                                    name={field.name as keyof Venta}
                                    render={({ field: hookField }) => (
                                        <FormItem>
                                            <FormLabel>{field.label}</FormLabel>
                                            <FormControl>
                                                <Input {...hookField} type={field.type ?? 'text'} required={field.required} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}

                            {/* Select de empleados */}
                            <FormField
                                control={form.control}
                                name="vendedor"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Vendedor</FormLabel>
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

                            <div className="flex w-full justify-between gap-2 pt-2">
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
