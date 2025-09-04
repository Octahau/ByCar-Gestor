'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Cliente } from '@/types';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface AddClienteModalProps {
    onClienteCreado: (cliente: Cliente) => void;
    open?: boolean; // control externo
    onOpenChange?: (open: boolean) => void; // control externo
}

export default function AddClienteModal({ onClienteCreado, open, onOpenChange }: AddClienteModalProps) {
    const form = useForm<Cliente>({
        defaultValues: { dni: '', nombre: '', telefono: '', email: '' },
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
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Ingrese los datos del cliente</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-2">
                        {[
                            { name: 'nombre', label: 'Nombre', type: 'text', required: true },
                            { name: 'dni', label: 'DNI', type: 'text', required: true },
                            { name: 'telefono', label: 'Teléfono', type: 'text', required: false },
                            { name: 'email', label: 'Email', type: 'email', required: false },
                        ].map((field) => (
                            <FormField
                                key={field.name}
                                control={form.control}
                                name={field.name as keyof Cliente}
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
