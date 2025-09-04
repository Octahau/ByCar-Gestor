'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Empleado, GastoVehiculo, GastoVehiculoTable } from '@/types';
import { IconPlus } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface AddGastoVehiculoModalProps {
    onGastoCreado: (gasto: GastoVehiculoTable) => void;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function AddGastoVehiculoModal({ onGastoCreado, open, onOpenChange }: AddGastoVehiculoModalProps) {
    const [empleados, setEmpleados] = useState<Empleado[]>([]);

    const form = useForm<GastoVehiculo>({
        defaultValues: {
            dominio: '',
            operador: '',
            tipo_gasto: '',
            descripcion: '',
            importe: 0,
            fecha: '',
        },
    });

    // cargar empleados desde el back
    useEffect(() => {
        fetch('/empleados')
            .then((res) => res.json())
            .then((data) => setEmpleados(data))
            .catch((err) => console.error('Error cargando empleados:', err));
    }, []);

    const onSubmit = async (data: GastoVehiculo) => {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch('/GastosVehiculos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                body: JSON.stringify(data),
            });
            console.log('datos enviados:', data);
            const result = await response.json();
            console.log('respuesta del servidor:', result);
            if (result.success) {
                toast.success('Gasto registrado correctamente');
                onGastoCreado(result.data); // solo una vez
                form.reset();
                onOpenChange?.(false); // cerrar modal
            } else {
                toast.error('Error al registrar gasto: ' + (result.message || ''));
            }
        } catch (error) {
            console.error('Error fetch:', error);
            toast.error('Error al registrar gasto: ' + (error instanceof Error ? error.message : ''));
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button>
                    <IconPlus className="mr-2 h-4 w-4" />
                    Registrar Gasto
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Ingrese los datos del gasto</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-2">
                        {[
                            { name: 'dominio', label: 'Dominio', type: 'text', required: true },
                            { name: 'tipo_gasto', label: 'Motivo', type: 'text', required: true },
                            { name: 'descripcion', label: 'Descripción', type: 'text', required: false },
                            { name: 'importe', label: 'Importe (ARS)', type: 'number', required: true },
                            { name: 'fecha', label: 'Fecha', type: 'date', required: false },
                        ].map((field) => (
                            <FormField
                                key={field.name}
                                control={form.control}
                                name={field.name as keyof GastoVehiculo}
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
                            name="operador"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Operador</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Seleccione un operador" />
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
    );
}
