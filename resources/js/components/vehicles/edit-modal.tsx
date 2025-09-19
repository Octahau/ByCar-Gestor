'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Vehiculo } from '@/types';
import { IconEdit } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface EditVehiculoModalProps {
    vehiculo: Vehiculo;
    isOpen: boolean;
    onClose: () => void;
    onVehiculoActualizado: (vehiculo: Vehiculo) => void;
}

export default function EditVehiculoModal({ 
    vehiculo, 
    isOpen, 
    onClose, 
    onVehiculoActualizado 
}: EditVehiculoModalProps) {
    const [isLoading, setIsLoading] = useState(false);

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
            estado: '',
            tipo: 'auto'
        },
    });

    // Actualizar el formulario cuando cambie el vehículo
    useEffect(() => {
        if (vehiculo) {
            form.reset({
                marca: vehiculo.marca || '',
                modelo: vehiculo.modelo || '',
                dominio: vehiculo.dominio || '',
                anio: vehiculo.anio || 0,
                color: vehiculo.color || '',
                kilometraje: vehiculo.kilometraje || 0,
                precioARS: vehiculo.precioARS || 0,
                precioUSD: vehiculo.precioUSD || 0,
                precio_venta_sugerido_ars: vehiculo.precio_venta_sugerido_ars || 0,
                precio_venta_sugerido_usd: vehiculo.precio_venta_sugerido_usd || 0,
                ubicacion: vehiculo.ubicacion || '',
                fecha: vehiculo.fecha || '',
                infoAuto: vehiculo.infoAuto || '',
                estado: vehiculo.estado || '',
                tipo: vehiculo.tipo || 'auto'
            });
        }
    }, [vehiculo, form]);

    const onSubmit = async (data: Vehiculo) => {
        setIsLoading(true);
        
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
            const response = await fetch(`/vehiculos/${vehiculo.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            
            if (result.success) {
                // Mapear correctamente los datos actualizados
                const vehiculoActualizado: Vehiculo = {
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
                    estado: result.vehiculo.estado || '',
                    tipo: result.vehiculo.tipo || 'auto'
                };

                onVehiculoActualizado(vehiculoActualizado);
                onClose();
                toast.success('Vehículo actualizado correctamente');
            } else {
                console.error('Errores de validación:', result.errors);
                toast.error('Error al actualizar vehículo: ' + (result.message || ''));
            }
        } catch (error) {
            console.error('Error al actualizar vehículo:', error);
            toast.error('Error al actualizar vehículo: ' + (error instanceof Error ? error.message : ''));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <IconEdit className="h-5 w-5" />
                        Editar Vehículo - {vehiculo.marca} {vehiculo.modelo}
                    </DialogTitle>
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
                                { name: 'fecha', label: 'Fecha de ingreso', type: 'date' }
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
                            
                            {/* Campo Estado con Select */}
                            <FormField
                                control={form.control}
                                name="estado"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Estado</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccionar estado" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="disponible">Disponible</SelectItem>
                                                <SelectItem value="no_disponible">No Disponible</SelectItem>
                                                <SelectItem value="vendido">Vendido</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            {/* Campo Tipo de Vehículo con Select */}
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
                        </div>
                        
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
                                <Button variant="outline" disabled={isLoading}>
                                    Cancelar
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Guardando..." : "Guardar cambios"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
