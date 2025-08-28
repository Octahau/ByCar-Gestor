'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Venta } from '@/types';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface AddVentaModalProps {
    onVentaCreada: (venta: Venta) => void;
}

export default function AddVentaModal({ onVentaCreada }: AddVentaModalProps) {
    const [open, setOpen] = useState(false);

    const form = useForm<Venta>({
        defaultValues: {
            dniCliente: '',
            dominio: '',
            procedencia: '',
            valor_venta_ars: 0,
            valor_venta_usd: 0,
            fecha_venta: '',
            vendedor: '',
        },
    });

    const onSubmit = async (data: Venta) => {
        const payload = {
            ...data,
            dominio: data.dominio.toUpperCase() || null,
            valor_venta_ars: Number(data.valor_venta_ars) || 0,
            valor_venta_usd: Number(data.valor_venta_usd) || 0,
            fecha_venta: data.fecha_venta || null,
            vendedor: data.vendedor || '',
        };

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch('/ventas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                body: JSON.stringify(payload),
            });
            console.log('Response status:', response.status);
            console.log(payload);
            const result = await response.json();

            if (result.success) {
                const nuevaVenta: Venta = {
                    dniCliente: result.venta.dniCliente,
                    dominio: result.venta.dominio,
                    procedencia: result.venta.procedencia,
                    valor_venta_ars: Number(result.venta.valor_venta_ars),
                    valor_venta_usd: Number(result.venta.valor_venta_usd),
                    fecha_venta: result.venta.fecha_venta,
                    vendedor: result.venta.vendedor,
                };

                onVentaCreada(nuevaVenta);
                setOpen(false);
                toast.success('Venta registrada correctamente');
                form.reset();
            } else {
                // Si el backend devuelve errores específicos
                if (result.errors) {
                    if (result.errors.dniCliente) {
                        toast.error('Cliente no registrado');
                    } else if (result.errors.dominio) {
                        toast.error('Vehículo no registrado');
                    } else {
                        toast.error('Error al registrar venta');
                    }
                } else {
                    toast.error('Error al registrar venta: ' + (result.message || ''));
                }
            }
        } catch (error) {
            console.error('Error fetch:', error);
            toast.error('Error al registrar venta: ' + (error instanceof Error ? error.message : ''));
        }
    };

    return (
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
                            { name: 'vendedor', label: 'Vendedor', required: true },
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
    );
}
