'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
    // CSRF token para el form
    const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Inicia sesión con tu cuenta</CardTitle>
                    <CardDescription>Ingresa tu correo para iniciar sesión</CardDescription>
                </CardHeader>
                <CardContent>
                    <form method="POST" action="/login">
                        <input type="hidden" name="_token" value={csrfToken} />
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Contraseña</Label>
                                </div>
                                <Input id="password" name="password" type="password" required />
                            </div>

                            <div className="flex flex-col gap-3">
                                <Button type="submit" className="w-full">
                                    Iniciar sesión
                                </Button>
                            </div>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            No tenés una cuenta?{' '}
                            <a href="/registro" className="underline underline-offset-4">
                                Registrate
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
