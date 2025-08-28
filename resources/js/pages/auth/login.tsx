import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    return (
        <AuthLayout title="Inicie sesión" description="Ingrese su correo y contraseña para iniciar sesión">
            <Head title="Log in" />

            <Form
                method="post"
                action={route('login')}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => {
                    // 🔹 Mostrar toast si hay errores
                    useEffect(() => {
                        if (errors.email || errors.password) {
                            toast.error(errors.email || errors.password || 'Credenciales incorrectas');
                        }
                    }, [errors]);

                    return (
                        <>
                            <div className="grid gap-6">
                                {/* Email */}
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Correo electrónico</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="email@example.com"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                {/* Password */}
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Contraseña</Label>
                                        {canResetPassword && (
                                            <TextLink
                                                href={route('password.request')}
                                                className="ml-auto text-sm"
                                                tabIndex={5}
                                            >
                                                ¿Olvidó la contraseña?
                                            </TextLink>
                                        )}
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Contraseña"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                {/* Recordarme */}
                                <div className="flex items-center space-x-3">
                                    <Checkbox id="remember" name="remember" tabIndex={3} />
                                    <Label htmlFor="remember">Recordarme</Label>
                                </div>

                                {/* Botón login */}
                                <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Iniciar sesión
                                </Button>
                            </div>

                            {/* Registro */}
                            <div className="text-center text-sm text-muted-foreground">
                                ¿No tiene una cuenta?{' '}
                                <TextLink href={route('register')} tabIndex={5}>
                                    Registrarse
                                </TextLink>
                            </div>
                        </>
                    );
                }}
            </Form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
