import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { IconEdit, IconDeviceFloppy, IconX } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Empleado } from '@/types';

const editGastoSchema = z.object({
    operador: z.number().min(1, 'El operador es requerido'),
    tipo_gasto: z.string().min(1, 'El tipo de gasto es requerido'),
    descripcion: z.string().optional(),
    importe_ars: z.number().min(0, 'El importe debe ser mayor o igual a 0').optional(),
    importe_usd: z.number().min(0, 'El importe debe ser mayor o igual a 0').optional(),
    dominio: z.string().optional(),
    fecha: z.string().min(1, 'La fecha es requerida'),
});

type EditGastoFormData = z.infer<typeof editGastoSchema>;

interface GastoVehiculoEdit {
    id: number;
    operador: string;
    tipo_gasto: string | null;
    descripcion: string | null;
    importe_usd: number | null;
    importe_ars: number | null;
    dominio: string | null;
    fecha: string | null;
}

interface EditGastoModalProps {
    gasto: GastoVehiculoEdit | null;
    isOpen: boolean;
    onClose: () => void;
    onGastoActualizado?: () => void;
}

export function EditGastoModal({ gasto, isOpen, onClose, onGastoActualizado }: EditGastoModalProps) {
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    
    const form = useForm<EditGastoFormData>({
        resolver: zodResolver(editGastoSchema),
        defaultValues: {
            operador: 0,
            tipo_gasto: '',
            descripcion: '',
            importe_ars: 0,
            importe_usd: 0,
            dominio: '',
            fecha: '',
        },
    });

    // Cargar empleados desde el backend
    useEffect(() => {
        fetch('/empleados')
            .then((res) => res.json())
            .then((data) => setEmpleados(data))
            .catch((err) => console.error('Error cargando empleados:', err));
    }, []);

    React.useEffect(() => {
        if (gasto && empleados.length > 0) {
            // Buscar el ID del operador por nombre
            const operadorEncontrado = empleados.find(emp => emp.name === gasto.operador);
            const operadorId = operadorEncontrado ? operadorEncontrado.id : 0;
            
            form.reset({
                operador: operadorId,
                tipo_gasto: gasto.tipo_gasto || '',
                descripcion: gasto.descripcion || '',
                importe_ars: gasto.importe_ars || 0,
                importe_usd: gasto.importe_usd || 0,
                dominio: gasto.dominio || '',
                fecha: gasto.fecha || '',
            });
        }
    }, [gasto, form, empleados]);

    const onSubmit = async (data: EditGastoFormData) => {
        if (!gasto) return;

        try {
            const response = await fetch(`/GastosVehiculos/${gasto.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar el gasto');
            }

            toast.success('Gasto de vehículo actualizado correctamente');
            onGastoActualizado?.();
            onClose();
        } catch (error) {
            console.error('Error al actualizar gasto:', error);
            toast.error('Error al actualizar el gasto');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <IconEdit className="h-5 w-5 text-blue-600" />
                        Editar Gasto de Vehículo
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="operador"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Operador</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)}>
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

                            <FormField
                                control={form.control}
                                name="tipo_gasto"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tipo de Gasto</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccionar tipo" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Insumos">Insumos</SelectItem>
                                                <SelectItem value="Combustible">Combustible</SelectItem>
                                                <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                                                <SelectItem value="Familia">Familia</SelectItem>
                                                <SelectItem value="Lavalle">Lavalle</SelectItem>
                                                <SelectItem value="Impuestos">Impuestos</SelectItem>
                                                <SelectItem value="Otros">Otros</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="dominio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Dominio del Vehículo</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="ABC123" />
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
                                        <FormLabel>Fecha del Gasto</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="date" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="importe_ars"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Importe en ARS</FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field} 
                                                type="number" 
                                                step="0.01"
                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="importe_usd"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Importe en USD</FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field} 
                                                type="number" 
                                                step="0.01"
                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="descripcion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descripción</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} placeholder="Descripción del gasto" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={onClose}>
                                <IconX className="h-4 w-4 mr-2" />
                                Cancelar
                            </Button>
                            <Button type="submit">
                                <IconDeviceFloppy className="h-4 w-4 mr-2" />
                                Guardar Cambios
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
