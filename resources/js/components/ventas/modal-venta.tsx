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

interface AddVehiculoModalProps {
    onVehiculoCreado: (veh: Venta) => void;
}

export default function AddVentaModal() {
    const [open, setOpen] = useState(false);

    const form = useForm<Venta>({
        defaultValues: {
            vehicle_id: 0,
            procedencia: '',
            valor_venta_ars: 0,
            valor_venta_usd: 0,
            ganancia_real_ars: 0,
            ganancia_real_usd: 0,
            fecha_venta: '',
            vendedor: '',
        },
            
    });

    const onSubmit = async (data: Venta) => {
        const payload = {
            ...data,
            vehicle_id: Number(data.vehicle_id) || null,
            valor_venta_ars: Number(data.valor_venta_ars) || 0,
            valor_venta_usd: Number(data.valor_venta_usd) || 0,
            ganancia_real_ars: Number(data.ganancia_real_ars) || 0,
            ganancia_real_usd: Number(data.ganancia_real_usd) || 0,
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
            console.log(payload);
            const result = await response.json();
            if (result.success) {
                // Mapear correctamente los datos antes de pasarlos al padre
                const nuevaVenta: Venta = {
                    vehicle_id: result.venta.vehicle_id,
                    procedencia: result.venta.procedencia,
                    valor_venta_ars: Number(result.venta.valor_venta_ars),
                    valor_venta_usd: Number(result.venta.valor_venta_usd),
                    ganancia_real_ars: Number(result.venta.ganancia_real_ars),
                    ganancia_real_usd: Number(result.venta.ganancia_real_usd),
                    fecha_venta: result.venta.fecha_venta,
                    vendedor: result.venta.vendedor,
                };

                setOpen(false);
                toast.success('Venta registrada correctamente');
            } else {
                console.error('Errores de validación:', result.errors);
                toast.error('Error al registrar venta: ' + (result.message || ''));
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
                    Registrar venta
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Registrar venta</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-2">
                        {[
                            { name: 'vehicle_id', label: 'ID del vehículo', type: 'number' },
                            { name: 'procedencia', label: 'Procedencia' },
                            { name: 'valor_venta_ars', label: 'Valor de venta (ARS)', type: 'number' },
                            { name: 'valor_venta_usd', label: 'Valor de venta (USD)', type: 'number' },
                            { name: 'ganancia_real_ars', label: 'Ganancia real (ARS)', type: 'number' },
                            { name: 'ganancia_real_usd', label: 'Ganancia real (USD)', type: 'number' },
                            { name: 'fecha_venta', label: 'Fecha de venta', type: 'date' },
                            { name: 'vendedor', label: 'Vendedor' },    
                        ].map((field) => (
                            <FormField
                                key={field.name}
                                control={form.control}
                                name={field.name as keyof Venta}
                                render={({ field: hookField }) => (
                                    <FormItem>
                                        <FormLabel>{field.label}</FormLabel>
                                        <FormControl>
                                            <Input {...hookField} type={field.type ?? 'text'} />
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
