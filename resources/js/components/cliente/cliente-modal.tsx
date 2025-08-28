'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Cliente } from '@/types';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface AddClienteModalProps {
    onClienteCreado: (cliente: Cliente) => void;
}

export default function AddClienteModal({ onClienteCreado }: AddClienteModalProps) {
    const [open, setOpen] = useState(false);

    const form = useForm<Cliente>({
        defaultValues: {
            dni: '',
            nombre: '',
            telefono: '',
            email: '',
        },
    });

    const onSubmit = async (data: Cliente) => {
        const payload = {
            ...data,
            dni: data.dni || '',
            nombre: data.nombre || '',
            telefono: data.telefono || '',
            email: data.email || '',
        };

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
            console.log('Response status:', response.status);
            console.log(payload);
            const result = await response.json();

            if (result.success) {
                const nuevoCliente: Cliente = {
                    dni: result.cliente.dni,
                    nombre: result.cliente.nombre,
                    telefono: result.cliente.telefono,
                    email: result.cliente.email,
                };

                onClienteCreado(nuevoCliente);
                setOpen(false);
                toast.success('Cliente registrado correctamente');
                form.reset();
            } else {
                // Si el backend devuelve errores específicos
                if (result.errors) {
                    if (result.errors.dni) {
                        toast.error('Error al registrar el cliente');
                    }
                } else {
                    toast.error('Error al registrar cliente: ' + (result.message || ''));
                }
            }
        } catch (error) {
            console.error('Error fetch:', error);
            toast.error('Error al registrar cliente: ' + (error instanceof Error ? error.message : ''));
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <IconPlus className="size-4" />
                    Registrar Cliente
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Ingrese los datos del cliente</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-2">
                        {[
                            { name: 'dni', label: 'DNI', type: 'text', required: true },
                            { name: 'nombre', label: 'Nombre', type: 'text', required: true },
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
