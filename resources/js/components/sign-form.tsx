'use client'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function RegisterForm({ className, ...props }: React.ComponentProps<'div'>) {
    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        dni: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
  console.log("Datos que se envían al backend:", form);

        try {
            const res = await fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Error en el registro');

            alert('Usuario registrado con éxito');
            console.log('Usuario:', data.user);
        } catch (error: any) {
            console.error('Error:', error.message);
            alert(error.message);
        }
    };

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Registrarse</CardTitle>
                    <CardDescription>Completa tus datos para crear una cuenta</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            {/* Nombre */}
                            <div className="grid gap-3">
                                <Label htmlFor="nombre">Nombre</Label>
                                <Input
                                    id="nombre"
                                    name="nombre"
                                    type="text"
                                    placeholder="Juan"
                                    value={form.nombre}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Apellido */}
                            <div className="grid gap-3">
                                <Label htmlFor="apellido">Apellido</Label>
                                <Input
                                    id="apellido"
                                    name="apellido"
                                    type="text"
                                    placeholder="Pérez"
                                    value={form.apellido}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* DNI */}
                            <div className="grid gap-3">
                                <Label htmlFor="dni">DNI</Label>
                                <Input id="dni" name="dni" type="text" placeholder="12345678" value={form.dni} onChange={handleChange} required />
                            </div>

                            {/* Email */}
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Contraseña */}
                            <div className="grid gap-3">
                                <Label htmlFor="password">Contraseña</Label>
                                <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} required />
                            </div>

                            {/* Confirmar contraseña */}
                            <div className="grid gap-3">
                                <Label htmlFor="password_confirmation">Confirmar contraseña</Label>
                                <Input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    value={form.password_confirmation}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Botón de registro */}
                            <div className="flex flex-col gap-3">
                                <Button type="submit" className="w-full">
                                    Registrarse
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
