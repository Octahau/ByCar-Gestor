'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Cliente, TipoCliente } from '@/types';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { IconPlus } from '@tabler/icons-react';

interface AddClienteModalProps {
    onClienteCreado: (cliente: Cliente) => void;
    open?: boolean; // control externo
    onOpenChange?: (open: boolean) => void; // control externo
    trigger?: React.ReactNode; // trigger personalizado
}

export default function AddClienteModal({ onClienteCreado, open, onOpenChange, trigger }: AddClienteModalProps) {
    const form = useForm<Cliente>({
        defaultValues: { dni: '', nombre: '', telefono: '', email: '', tipo: 'interesado', observaciones: '' },
    });

    const onSubmit = async (data: Cliente) => {
        const payload = { ...data };
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch('/clientes', {
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
                onClienteCreado(result.cliente);
                toast.success('Cliente registrado correctamente');
                form.reset();
                onOpenChange?.(false); // cerrar modal
            } else {
                toast.error('Error al registrar cliente: ' + (result.message || ''));
            }
        } catch (error) {
            console.error('Error fetch:', error);
            toast.error('Error al registrar cliente: ' + (error instanceof Error ? error.message : ''));
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Ingrese los datos del cliente</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Columna izquierda */}
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="nombre"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre *</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="text" required />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="dni"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>DNI *</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="text" required />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="telefono"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Teléfono</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="text" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Columna derecha */}
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="email" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="tipo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipo *</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Seleccione un tipo" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="interesado">Interesado</SelectItem>
                                                        <SelectItem value="comprador">Comprador</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Observaciones - ocupa todo el ancho */}
                        <FormField
                            control={form.control}
                            name="observaciones"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Observaciones</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            {...field} 
                                            placeholder="Ingrese observaciones adicionales sobre el cliente..."
                                            className="min-h-[80px]"
                                        />
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
