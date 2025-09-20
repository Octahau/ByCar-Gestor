import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { IconShieldX } from '@tabler/icons-react';
import { Link } from '@inertiajs/react';

export default function Forbidden() {
    return (
        <AppLayout>
            <Head title="Acceso Denegado" />
            
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="max-w-md w-full text-center">
                    <div className="mb-8">
                        <IconShieldX className="w-24 h-24 text-destructive mx-auto mb-4" />
                        <h1 className="text-4xl font-bold text-foreground mb-2">403</h1>
                        <h2 className="text-2xl font-semibold text-foreground mb-4">Acceso Denegado</h2>
                        <p className="text-muted-foreground mb-8">
                            No tienes permisos para acceder a esta sección. 
                            Solo los administradores pueden acceder a esta funcionalidad.
                        </p>
                    </div>
                    
                    <div className="space-y-4">
                        <Button asChild className="w-full">
                            <Link href="/dashboard">
                                Volver al Dashboard
                            </Link>
                        </Button>
                        
                        <Button variant="outline" asChild className="w-full">
                            <Link href="/vehiculos">
                                Ir a Vehículos
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
