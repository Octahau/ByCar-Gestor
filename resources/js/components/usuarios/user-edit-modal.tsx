import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User as UserType } from '@/types';
import toast from 'react-hot-toast';

interface UserEditModalProps {
    user: UserType;
    isOpen: boolean;
    onClose: () => void;
    onUserUpdated: (user: UserType) => void;
}

interface FormData {
    name: string;
    email: string;
    dni: string;
    tipo: string;
    password?: string;
    password_confirmation?: string;
}

export default function UserEditModal({ user, isOpen, onClose, onUserUpdated }: UserEditModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors }
    } = useForm<FormData>({
        defaultValues: {
            name: user.name,
            email: user.email,
            dni: user.dni,
            tipo: user.tipo,
            password: '',
            password_confirmation: ''
        }
    });

    const tipoValue = watch('tipo');

    useEffect(() => {
        if (isOpen) {
            reset({
                name: user.name,
                email: user.email,
                dni: user.dni,
                tipo: user.tipo,
                password: '',
                password_confirmation: ''
            });
        }
    }, [isOpen, user, reset]);

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            // Remove empty password fields
            const submitData = { ...data };
            if (!submitData.password) {
                delete submitData.password;
                delete submitData.password_confirmation;
            }

            const response = await fetch(`/usuarios/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                body: JSON.stringify(submitData),
            });

            const result = await response.json();
            
            if (result.success) {
                toast.success('Usuario actualizado correctamente');
                onUserUpdated(result.user);
                onClose();
            } else {
                if (result.errors) {
                    Object.values(result.errors).forEach((error: any) => {
                        toast.error(error[0]);
                    });
                } else {
                    toast.error(result.message || 'Error al actualizar usuario');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al actualizar usuario');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Editar Usuario</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre</Label>
                        <Input
                            id="name"
                            {...register('name', { required: 'El nombre es obligatorio' })}
                            placeholder="Nombre completo"
                        />
                        {errors.name && (
                            <p className="text-sm text-red-600">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            {...register('email', { 
                                required: 'El email es obligatorio',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Email inválido'
                                }
                            })}
                            placeholder="usuario@ejemplo.com"
                        />
                        {errors.email && (
                            <p className="text-sm text-red-600">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dni">DNI</Label>
                        <Input
                            id="dni"
                            {...register('dni', { required: 'El DNI es obligatorio' })}
                            placeholder="12345678"
                        />
                        {errors.dni && (
                            <p className="text-sm text-red-600">{errors.dni.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tipo">Tipo de Usuario</Label>
                        <Select value={tipoValue} onValueChange={(value) => setValue('tipo', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">Administrador</SelectItem>
                                <SelectItem value="empleado">Empleado</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.tipo && (
                            <p className="text-sm text-red-600">{errors.tipo.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Nueva Contraseña (opcional)</Label>
                        <Input
                            id="password"
                            type="password"
                            {...register('password', {
                                minLength: {
                                    value: 8,
                                    message: 'La contraseña debe tener al menos 8 caracteres'
                                }
                            })}
                            placeholder="Dejar vacío para mantener la actual"
                        />
                        {errors.password && (
                            <p className="text-sm text-red-600">{errors.password.message}</p>
                        )}
                    </div>

                    {watch('password') && (
                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation">Confirmar Contraseña</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                {...register('password_confirmation', {
                                    validate: (value) => 
                                        value === watch('password') || 'Las contraseñas no coinciden'
                                })}
                                placeholder="Confirmar nueva contraseña"
                            />
                            {errors.password_confirmation && (
                                <p className="text-sm text-red-600">{errors.password_confirmation.message}</p>
                            )}
                        </div>
                    )}

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
