'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Vehiculo } from '@/types';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface AddVehiculoModalProps {
    onVehiculoCreado: (veh: Vehiculo) => void;
}

export default function AddVehiculoModal({ onVehiculoCreado }: AddVehiculoModalProps) {
    const [open, setOpen] = useState(false);

    const form = useForm<Vehiculo>({
        defaultValues: {
            marca: '',
            modelo: '',
            dominio: '',
            anio: 0,
            color: '',
            kilometraje: 0,
            precioARS: 0,
            precioUSD: 0,
            ubicacion: '',
        },
    });

    const onSubmit = async (data: Vehiculo) => {
        const payload = {
            ...data,
            anio: Number(data.anio),
            kilometraje: Number(data.kilometraje),
            precioARS: Number(data.precioARS),
            precioUSD: Number(data.precioUSD),
        };

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch('/vehiculos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (result.success) {
                // Mapear correctamente los datos antes de pasarlos al padre
                const nuevoVehiculo: Vehiculo = {
                    id: result.vehiculo.vehicle_id,
                    marca: result.vehiculo.marca,
                    modelo: result.vehiculo.modelo,
                    dominio: result.vehiculo.dominio,
                    anio: Number(result.vehiculo.anio),
                    color: result.vehiculo.color,
                    kilometraje: Number(result.vehiculo.kilometraje),
                    precioARS: Number(result.vehiculo.precioARS),
                    precioUSD: Number(result.vehiculo.precioUSD),
                    ubicacion: result.vehiculo.ubicacion ?? '',
                };

                onVehiculoCreado(nuevoVehiculo);
                setOpen(false);
                alert('Vehículo agregado con éxito');
            } else {
                console.error('Errores de validación:', result.errors);
                alert('Error al agregar vehículo');
            }
        } catch (error) {
            console.error('Error fetch:', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <IconPlus className="size-4" />
                    Agregar Vehículo
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Agregar Nuevo Vehículo</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-2">
                        {[
                            { name: 'marca', label: 'Marca' },
                            { name: 'modelo', label: 'Modelo' },
                            { name: 'dominio', label: 'Dominio' },
                            { name: 'anio', label: 'Año', type: 'number' },
                            { name: 'color', label: 'Color' },
                            { name: 'kilometraje', label: 'Kilometraje', type: 'number' },
                            { name: 'precioARS', label: 'Precio (ARS)', type: 'number' },
                            { name: 'precioUSD', label: 'Precio (USD)', type: 'number' },
                            { name: 'ubicacion', label: 'Ubicación' }, // New field
                        ].map((field) => (
                            <FormField
                                key={field.name}
                                control={form.control}
                                name={field.name as keyof Vehiculo}
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
