'use client';

import { store } from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

interface Login04Props {
    status?: string;
    canResetPassword: boolean;
}

export function Login04({ status, canResetPassword }: Login04Props) {
    return (
        <>
            <Head title="Inicie sesión" />
            <div className="h-screen w-screen grid md:grid-cols-2 gap-0">
                <div className="p-8 md:p-12 flex items-center justify-center" style={{background: 'linear-gradient(to right, #000000, #69696b)'}}>
                    <Form {...store.form()} resetOnSuccess={['password']} className="w-full max-w-md">
                            {({ processing, errors }) => (
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col items-center text-center">
                                        <h1 className="text-3xl font-bold text-white">Bienvenido de vuelta</h1>
                                        <p className="text-gray-300 text-balance text-lg">
                                            Inicie sesión en su cuenta de ByCar
                                        </p>
                                    </div>
                                    
                                    <div className="grid gap-3">
                                        <Label htmlFor="email" className="text-gray-300">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            placeholder="email@example.com"
                                            className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-300 h-12 text-lg"
                                        />
                                        <InputError message={errors.email} />
                                    </div>
                                    
                                    <div className="grid gap-3">
                                        <div className="flex items-center">
                                            <Label htmlFor="password" className="text-gray-300">Contraseña</Label>
                                            {canResetPassword && (
                                                <TextLink 
                                                    href={request()} 
                                                    className="ml-auto text-sm text-gray-400 hover:text-white underline underline-offset-2" 
                                                    tabIndex={4}
                                                >
                                                    ¿Olvidó su contraseña?
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
                                            placeholder="Ingrese su contraseña"
                                            className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-300 h-12 text-lg"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox 
                                            id="remember" 
                                            name="remember"
                                            tabIndex={3}
                                            className="data-[state=checked]:bg-gray-600 data-[state=checked]:border-gray-600 border-gray-500"
                                        />
                                        <Label 
                                            htmlFor="remember" 
                                            className="text-sm text-gray-300 cursor-pointer"
                                        >
                                            Recordarme
                                        </Label>
                                    </div>
                                    
                                    <Button 
                                        type="submit" 
                                        className="w-full bg-gray-600 hover:bg-gray-700 text-white h-12 text-lg" 
                                        tabIndex={4} 
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <>
                                                <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                                                Iniciando sesión...
                                            </>
                                        ) : (
                                            'Iniciar sesión'
                                        )}
                                    </Button>
                                    
                                    <div className="text-center text-sm text-gray-300">
                                        ¿No tiene cuenta?{' '}
                                        <TextLink 
                                            href={register()} 
                                            className="text-gray-400 hover:text-white underline underline-offset-4" 
                                            tabIndex={5}
                                        >
                                            Registrarse
                                        </TextLink>
                                    </div>
                                </div>
                            )}
                    </Form>
                </div>
                
                <div className="relative hidden md:flex items-center justify-center" style={{background: 'linear-gradient(to right, #000000, #d1d5db)'}}>
                    <div className="absolute inset-0 bg-gray-700/30"></div>
                    <div className="relative z-10 flex items-center justify-center p-12 w-full h-full">
                        <div className="text-center text-gray-800">
                            <div className="mb-8">
                                <img 
                                    src="/logo-bycar.jpg" 
                                    alt="ByCar Logo" 
                                    className="mx-auto h-68 w-auto mb-6 rounded-lg shadow-2xl"
                                />
                            </div>
                            <h2 className="text-3xl font-bold mb-4">ByCar</h2>
                            <p className="text-lg text-gray-800 font-medium">
                                Gestión integral de tu concesionaria de autos
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {status && (
                <div className="fixed top-4 right-4 p-4 text-center text-sm font-medium text-gray-300 bg-gray-800/90 rounded-lg border border-gray-600 z-50">
                    {status}
                </div>
            )}
        </>
    );
}
