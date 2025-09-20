import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import { useState } from 'react';
import UserCard from '@/components/usuarios/user-card';
import CreateUserModal from '@/components/usuarios/create-user-modal';
import { User } from '@/types';

interface UsuariosProps {
    usuarios: User[];
}

export default function Usuarios({ usuarios }: UsuariosProps) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [users, setUsers] = useState(usuarios);

    const handleUserCreated = (newUser: User) => {
        setUsers(prev => [...prev, newUser]);
        setIsCreateModalOpen(false);
    };

    const handleUserUpdated = (updatedUser: User) => {
        setUsers(prev => prev.map(user => 
            user.id === updatedUser.id ? updatedUser : user
        ));
    };

    const handleUserDeleted = (userId: number) => {
        setUsers(prev => prev.filter(user => user.id !== userId));
    };

    return (
        <AppLayout>
            <Head title="Usuarios" />
            
            <div className="space-y-4 px-4 sm:px-6 lg:px-8">
                {/* Header Card */}
                <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
                                <Users className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-card-foreground">Usuarios</h1>
                                <p className="text-sm text-muted-foreground">Gestiona los usuarios del sistema</p>
                            </div>
                        </div>
                        
                        <Button 
                            onClick={() => setIsCreateModalOpen(true)}
                            size="sm"
                            className="flex items-center space-x-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Nuevo Usuario</span>
                        </Button>
                    </div>
                </div>

                {/* Stats Card */}
                <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-4">
                    <h2 className="text-lg font-semibold text-card-foreground mb-3">Estadísticas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-3 rounded-lg border border-primary/20">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <Users className="w-6 h-6 text-primary" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-xs font-medium text-primary">Total Usuarios</p>
                                    <p className="text-xl font-bold text-card-foreground">{users.length}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-chart-2/5 to-chart-2/10 p-3 rounded-lg border border-chart-2/20">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-6 h-6 bg-chart-2/20 rounded-full flex items-center justify-center">
                                        <span className="text-chart-2 font-bold text-xs">A</span>
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <p className="text-xs font-medium text-chart-2">Administradores</p>
                                    <p className="text-xl font-bold text-card-foreground">
                                        {users.filter(user => user.tipo === 'admin').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-chart-3/5 to-chart-3/10 p-3 rounded-lg border border-chart-3/20">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-6 h-6 bg-chart-3/20 rounded-full flex items-center justify-center">
                                        <span className="text-chart-3 font-bold text-xs">E</span>
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <p className="text-xs font-medium text-chart-3">Empleados</p>
                                    <p className="text-xl font-bold text-card-foreground">
                                        {users.filter(user => user.tipo === 'empleado').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Users Grid Card */}
                <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-4">
                    <h2 className="text-lg font-semibold text-card-foreground mb-3">Lista de Usuarios</h2>
                    
                    {users.length === 0 ? (
                        <div className="text-center py-8">
                            <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                            <h3 className="text-base font-medium text-card-foreground mb-2">No hay usuarios</h3>
                            <p className="text-sm text-muted-foreground mb-3">Comienza agregando el primer usuario al sistema.</p>
                            <Button onClick={() => setIsCreateModalOpen(true)} size="sm">
                                <Plus className="w-4 h-4 mr-2" />
                                Agregar Usuario
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {users.map((user) => (
                                <UserCard
                                    key={user.id}
                                    user={user}
                                    onUserUpdated={handleUserUpdated}
                                    onUserDeleted={handleUserDeleted}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <CreateUserModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onUserCreated={handleUserCreated}
            />
        </AppLayout>
    );
}
