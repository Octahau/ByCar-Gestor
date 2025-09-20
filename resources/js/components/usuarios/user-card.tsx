import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    MoreVertical, 
    Eye, 
    Edit, 
    Trash2, 
    Mail, 
    User as UserIcon, 
    Calendar,
    Shield,
    UserCheck
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from '@/types';
import UserInfoModal from './user-info-modal';
import UserEditModal from './user-edit-modal';
import DeleteModal from '@/components/delete-modal';
import toast from 'react-hot-toast';

interface UserCardProps {
    user: User;
    onUserUpdated: (user: User) => void;
    onUserDeleted: (userId: number) => void;
}

export default function UserCard({ user, onUserUpdated, onUserDeleted }: UserCardProps) {
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch(`/usuarios/${user.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
            });

            const result = await response.json();
            
            if (result.success) {
                toast.success('Usuario eliminado correctamente');
                onUserDeleted(user.id);
                setIsDeleteModalOpen(false);
            } else {
                toast.error(result.message || 'Error al eliminar usuario');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al eliminar usuario');
        } finally {
            setIsDeleting(false);
        }
    };

    const getTipoColor = (tipo: string) => {
        switch (tipo) {
            case 'admin':
                return 'bg-red-100 text-red-800';
            case 'empleado':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTipoIcon = (tipo: string) => {
        switch (tipo) {
            case 'admin':
                return <Shield className="w-4 h-4" />;
            case 'empleado':
                return <UserCheck className="w-4 h-4" />;
            default:
                return <UserIcon className="w-4 h-4" />;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <>
            <Card className="hover:shadow-md transition-shadow bg-card text-card-foreground">
                <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                    <span className="text-primary font-bold text-xs">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="text-sm font-semibold text-card-foreground truncate">
                                    {user.name}
                                </h3>
                                <div className="flex items-center space-x-1 mt-1">
                                    <Badge className={`${getTipoColor(user.tipo)} text-xs px-2 py-0.5`}>
                                        <div className="flex items-center space-x-1">
                                            {getTipoIcon(user.tipo)}
                                            <span className="capitalize text-xs">{user.tipo}</span>
                                        </div>
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                    <MoreVertical className="w-3 h-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setIsInfoModalOpen(true)}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Ver información
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    className="text-destructive"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Eliminar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                    <div className="space-y-2">
                        <div className="flex items-center text-xs text-muted-foreground">
                            <Mail className="w-3 h-3 mr-2 text-muted-foreground/60" />
                            <span className="truncate">{user.email}</span>
                        </div>
                        
                        <div className="flex items-center text-xs text-muted-foreground">
                            <UserIcon className="w-3 h-3 mr-2 text-muted-foreground/60" />
                            <span>DNI: {user.dni}</span>
                        </div>
                        
                        <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3 mr-2 text-muted-foreground/60" />
                            <span>Registrado: {formatDate(user.created_at)}</span>
                        </div>
                        
                        {user.email_verified_at && (
                            <div className="flex items-center text-xs text-chart-2">
                                <div className="w-1.5 h-1.5 bg-chart-2 rounded-full mr-2"></div>
                                <span>Email verificado</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Modals */}
            <UserInfoModal
                user={user}
                isOpen={isInfoModalOpen}
                onClose={() => setIsInfoModalOpen(false)}
            />
            
            <UserEditModal
                user={user}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onUserUpdated={onUserUpdated}
            />
            
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Eliminar Usuario"
                description={`¿Estás seguro de que quieres eliminar al usuario "${user.name}"? Esta acción no se puede deshacer.`}
                isLoading={isDeleting}
            />
        </>
    );
}
