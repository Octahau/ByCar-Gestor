'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { GastoCorrienteTable } from '@/types';

const formSchema = z.object({
    item: z.string().min(1, 'El motivo es requerido'),
    descripcion: z.string().optional(),
    importe: z.number().min(0, 'El importe debe ser mayor o igual a 0'),
    fondo: z.string().min(1, 'El fondo es requerido'),
    fecha: z.string().min(1, 'La fecha es requerida'),
});

type FormData = z.infer<typeof formSchema>;

interface EditGastoModalProps {
    gasto: GastoCorrienteTable;
    isOpen: boolean;
    onClose: () => void;
    onGastoActualizado: () => void;
}

export default function EditGastoModal({
    gasto,
    isOpen,
    onClose,
    onGastoActualizado,
}: EditGastoModalProps) {
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            item: gasto.item || '',
            descripcion: gasto.descripcion || '',
            importe: gasto.importe || 0,
            fondo: gasto.fondo || 'general',
            fecha: gasto.fecha || '',
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            const response = await fetch(`/GastosCorrientes/${gasto.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.success) {
                toast.success('Gasto actualizado correctamente');
                onGastoActualizado();
                onClose();
            } else {
                toast.error('Error al actualizar gasto: ' + (result.message || ''));
            }
        } catch (error) {
            console.error('Error al actualizar gasto:', error);
            toast.error('Error al actualizar gasto');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Editar Gasto Corriente</DialogTitle>
                </DialogHeader>
                
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="item"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Motivo</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej: Mantenimiento, Combustible..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="descripcion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descripción</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            placeholder="Descripción detallada del gasto..." 
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="importe"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Importe (ARS)</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="number" 
                                            step="0.01"
                                            placeholder="0.00" 
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="fondo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fondo</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar fondo" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="general">General</SelectItem>
                                            <SelectItem value="caja_chica">Caja Chica</SelectItem>
                                            <SelectItem value="banco">Banco</SelectItem>
                                            <SelectItem value="efectivo">Efectivo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="fecha"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fecha</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancelar
                            </Button>
                            <Button type="submit">
                                Actualizar Gasto
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
