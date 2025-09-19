'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Vehiculo } from '@/types';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

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
            precio_venta_sugerido_ars: 0,
            precio_venta_sugerido_usd: 0,
            ubicacion: '',
            fecha: '',
            infoAuto: '',
            estado: 'disponible',
            tipo: 'auto'
        },
    });

    const onSubmit = async (data: Vehiculo) => {
        const payload = {
            ...data,
            dominio: data.dominio.toUpperCase() || '',
            anio: Number(data.anio) || null,
            kilometraje: Number(data.kilometraje) || 0,
            precioARS: Number(data.precioARS) || 0,
            precioUSD: Number(data.precioUSD) || 0,
            precio_venta_sugerido_ars: Number(data.precio_venta_sugerido_ars) || null,
            precio_venta_sugerido_usd: Number(data.precio_venta_sugerido_usd) || null,
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
                console.log('Datos del auto: ',payload);

            const result = await response.json();
            if (result.success) {
                // Mapear correctamente los datos antes de pasarlos al padre
                const nuevoVehiculo: Vehiculo = {
                    id: result.vehiculo.id,
                    marca: result.vehiculo.marca,
                    modelo: result.vehiculo.modelo,
                    dominio: result.vehiculo.dominio,
                    anio: Number(result.vehiculo.anio),
                    color: result.vehiculo.color,
                    kilometraje: Number(result.vehiculo.kilometraje),
                    precioARS: Number(result.vehiculo.precioARS),
                    precioUSD: Number(result.vehiculo.precioUSD),
                    precio_venta_sugerido_ars: result.vehiculo.precio_venta_sugerido_ars ? Number(result.vehiculo.precio_venta_sugerido_ars) : undefined,
                    precio_venta_sugerido_usd: result.vehiculo.precio_venta_sugerido_usd ? Number(result.vehiculo.precio_venta_sugerido_usd) : undefined,
                    ubicacion: result.vehiculo.ubicacion ?? '',
                    fecha: result.vehiculo.fecha ?? '',
                    infoAuto: result.vehiculo.infoAuto ?? '',
                    estado: result.vehiculo.estado || 'disponible',
                    tipo: result.vehiculo.tipo || 'auto'
                };

                onVehiculoCreado(nuevoVehiculo);
                setOpen(false);
                toast.success('Vehículo agregado correctamente');
            } else {
                console.error('Errores de validación:', result.errors);
                console.log('Datos del auto: ',payload);
                toast.error('Error al agregar vehículo: ' + (result.message || ''));
            }
        } catch (error) {
            console.error('Error fetch:', error);
            toast.error('Erro al agregar rvehículo: ' + (error instanceof Error ? error.message : ''));
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { name: 'marca', label: 'Marca' },
                                { name: 'modelo', label: 'Modelo' },
                                { name: 'dominio', label: 'Dominio' },
                                { name: 'anio', label: 'Año', type: 'number' },
                                { name: 'color', label: 'Color' },
                                { name: 'kilometraje', label: 'Kilometraje', type: 'number' },
                                { name: 'precioARS', label: 'Precio (ARS)', type: 'number' },
                                { name: 'precioUSD', label: 'Precio (USD)', type: 'number' },
                                { name: 'precio_venta_sugerido_ars', label: 'Precio Venta Sugerido (ARS)', type: 'number' },
                                { name: 'precio_venta_sugerido_usd', label: 'Precio Venta Sugerido (USD)', type: 'number' },
                                { name: 'ubicacion', label: 'Ubicación' }, 
                                {name : 'fecha', label: 'Fecha de ingreso', type: 'date'}
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
                        </div>
                        
                        {/* Campo de tipo de vehículo */}
                        <FormField
                            control={form.control}
                            name="tipo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de Vehículo</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar tipo" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="auto">Auto</SelectItem>
                                            <SelectItem value="camioneta">Camioneta</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        {/* Campo de información del vehículo que ocupa todo el ancho */}
                        <FormField
                            control={form.control}
                            name="infoAuto"
                            render={({ field: hookField }) => (
                                <FormItem>
                                    <FormLabel>Información del vehículo</FormLabel>
                                    <FormControl>
                                        <Input {...hookField} type="text" />
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
