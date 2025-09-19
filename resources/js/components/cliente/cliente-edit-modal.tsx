import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { IconUser, IconMail, IconPhone, IconId, IconFileText, IconX } from '@tabler/icons-react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
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
import { Cliente, TipoCliente } from '@/types';

// Esquema de validación
const clienteEditSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido').min(2, 'El nombre debe tener al menos 2 caracteres'),
    dni: z.string().min(1, 'El DNI es requerido').min(7, 'El DNI debe tener al menos 7 caracteres'),
    email: z.string().email('Email inválido').optional().or(z.literal('')),
    telefono: z.string().min(1, 'El teléfono es requerido').min(8, 'El teléfono debe tener al menos 8 caracteres'),
    tipo: z.enum(['interesado', 'comprador'] as const),
    observaciones: z.string().optional(),
});

type ClienteEditFormData = z.infer<typeof clienteEditSchema>;

interface ClienteEditModalProps {
    cliente: Cliente;
    isOpen: boolean;
    onClose: () => void;
    onClienteUpdated: (cliente: Cliente) => void;
}

export default function ClienteEditModal({ 
    cliente, 
    isOpen, 
    onClose, 
    onClienteUpdated 
}: ClienteEditModalProps) {
    const [isLoading, setIsLoading] = React.useState(false);

    const form = useForm<ClienteEditFormData>({
        resolver: zodResolver(clienteEditSchema),
        defaultValues: {
            nombre: cliente.nombre || '',
            dni: cliente.dni || '',
            email: cliente.email || '',
            telefono: cliente.telefono || '',
            tipo: cliente.tipo || 'interesado',
            observaciones: cliente.observaciones || '',
        },
    });

    // Actualizar valores del formulario cuando cambie el cliente
    React.useEffect(() => {
        if (cliente) {
            form.reset({
                nombre: cliente.nombre || '',
                dni: cliente.dni || '',
                email: cliente.email || '',
                telefono: cliente.telefono || '',
                tipo: cliente.tipo || 'interesado',
                observaciones: cliente.observaciones || '',
            });
        }
    }, [cliente, form]);

    const onSubmit = async (data: ClienteEditFormData) => {
        setIsLoading(true);
        
        try {
            const response = await fetch(`/clientes/${cliente.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el cliente');
            }

            const result = await response.json();
            
            toast.success('Cliente actualizado exitosamente');
            onClienteUpdated(result.cliente);
            onClose();
        } catch (error) {
            console.error('Error al actualizar cliente:', error);
            toast.error('Error al actualizar el cliente');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        form.reset();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <IconUser className="h-5 w-5" />
                        Editar Cliente - {cliente.nombre}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Información Personal */}
                        <div className="bg-muted/50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-4">
                                <IconUser className="h-5 w-5 text-blue-600" />
                                <h3 className="text-lg font-semibold">Información Personal</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="nombre"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre Completo</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder="Ingrese el nombre completo" 
                                                    {...field} 
                                                />
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
                                            <FormLabel>DNI</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder="Ingrese el DNI" 
                                                    {...field} 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Tipo de Cliente */}
                        <div className="bg-muted/50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-4">
                                <IconId className="h-5 w-5 text-purple-600" />
                                <h3 className="text-lg font-semibold">Tipo de Cliente</h3>
                            </div>
                            
                            <FormField
                                control={form.control}
                                name="tipo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tipo</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccionar tipo" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="interesado">Interesado</SelectItem>
                                                <SelectItem value="comprador">Comprador</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Información de Contacto */}
                        <div className="bg-muted/50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-4">
                                <IconMail className="h-5 w-5 text-green-600" />
                                <h3 className="text-lg font-semibold">Contacto</h3>
                            </div>
                            
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="email"
                                                    placeholder="Ingrese el email" 
                                                    {...field} 
                                                />
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
                                                <Input 
                                                    type="tel"
                                                    placeholder="Ingrese el teléfono" 
                                                    {...field} 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Observaciones */}
                        <div className="bg-muted/50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-4">
                                <IconFileText className="h-5 w-5 text-gray-600" />
                                <h3 className="text-lg font-semibold">Observaciones</h3>
                            </div>
                            
                            <FormField
                                control={form.control}
                                name="observaciones"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Observaciones (opcional)</FormLabel>
                                        <FormControl>
                                            <Textarea 
                                                placeholder="Ingrese observaciones adicionales..."
                                                className="min-h-[100px]"
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Botones de acción */}
                        <div className="flex justify-end gap-3 pt-4">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={handleClose}
                                disabled={isLoading}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={isLoading}
                            >
                                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
