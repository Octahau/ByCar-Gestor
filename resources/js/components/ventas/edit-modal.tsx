'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VentaTable, Empleado } from '@/types';
import { IconEdit } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface EditVentaModalProps {
    venta: VentaTable;
    isOpen: boolean;
    onClose: () => void;
    onVentaActualizada: (venta: VentaTable) => void;
}

export default function EditVentaModal({ 
    venta, 
    isOpen, 
    onClose, 
    onVentaActualizada 
}: EditVentaModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [empleados, setEmpleados] = useState<Empleado[]>([]);

    const form = useForm({
        defaultValues: {
            procedencia: '',
            valor_venta_ars: 0,
            valor_venta_usd: 0,
            fecha: '',
            vendedor: '',
        },
    });

    // Cargar empleados desde el backend
    useEffect(() => {
        fetch('/empleados')
            .then((res) => res.json())
            .then((data) => setEmpleados(data))
            .catch((err) => console.error('Error cargando empleados:', err));
    }, []);

    // Actualizar el formulario cuando cambie la venta
    useEffect(() => {
        if (venta) {
            form.reset({
                procedencia: venta.procedencia || '',
                valor_venta_ars: venta.valor_venta_ars || 0,
                valor_venta_usd: venta.valor_venta_usd || 0,
                fecha: venta.fecha || '',
                vendedor: venta.vendedor || '',
            });
        }
    }, [venta, form]);

    const onSubmit = async (data: {
        procedencia: string;
        valor_venta_ars: number;
        valor_venta_usd: number;
        fecha: string;
        vendedor: string;
    }) => {
        setIsLoading(true);
        
        const payload = {
            ...data,
            valor_venta_ars: Number(data.valor_venta_ars) || 0,
            valor_venta_usd: Number(data.valor_venta_usd) || 0,
        };

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch(`/ventas/${venta.id}`, {
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
                const ventaActualizada: VentaTable = {
                    id: result.venta.id,
                    marca: result.venta.marca,
                    modelo: result.venta.modelo,
                    dominio: result.venta.dominio,
                    procedencia: result.venta.procedencia,
                    valor_venta_ars: Number(result.venta.valor_venta_ars),
                    valor_venta_usd: Number(result.venta.valor_venta_usd),
                    ganancia_real_ars: Number(result.venta.ganancia_real_ars),
                    ganancia_real_usd: Number(result.venta.ganancia_real_usd),
                    fecha: result.venta.fecha,
                    vendedor: result.venta.vendedor,
                };

                onVentaActualizada(ventaActualizada);
                onClose();
                toast.success('Venta actualizada correctamente');
            } else {
                console.error('Errores de validación:', result.errors);
                toast.error('Error al actualizar venta: ' + (result.message || ''));
            }
        } catch (error) {
            console.error('Error al actualizar venta:', error);
            toast.error('Error al actualizar venta: ' + (error instanceof Error ? error.message : ''));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <IconEdit className="h-5 w-5" />
                        Editar Venta - {venta.marca} {venta.modelo}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Información del vehículo (solo lectura) */}
                            <div className="md:col-span-2 p-3 bg-muted rounded-lg">
                                <h3 className="font-semibold mb-2">Información del Vehículo</h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div><strong>Marca:</strong> {venta.marca}</div>
                                    <div><strong>Modelo:</strong> {venta.modelo}</div>
                                    <div><strong>Dominio:</strong> {venta.dominio}</div>
                                </div>
                            </div>

                            {/* Campos editables */}
                            <FormField
                                control={form.control}
                                name="procedencia"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Procedencia</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="text" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="valor_venta_ars"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Valor Venta (ARS)</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="number" step="0.01" />
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
                                        <FormLabel>Valor Venta (USD)</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="number" step="0.01" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="fecha"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fecha de Venta</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="date" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="vendedor"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Vendedor</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Seleccione un vendedor" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {empleados.map((empleado) => (
                                                        <SelectItem key={empleado.id} value={empleado.name}>
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
                        </div>

                        {/* Información de ganancias (solo lectura) */}
                        <div className="p-3 bg-muted rounded-lg">
                            <h3 className="font-semibold mb-2">Ganancias Calculadas</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div><strong>Ganancia ARS:</strong> ${venta.ganancia_real_ars?.toLocaleString('es-AR') || '0'}</div>
                                <div><strong>Ganancia USD:</strong> ${venta.ganancia_real_usd?.toLocaleString('en-US') || '0'}</div>
                            </div>
                        </div>

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
