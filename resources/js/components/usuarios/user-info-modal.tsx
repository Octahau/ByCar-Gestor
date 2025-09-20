import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    Mail, 
    User as UserIcon, 
    Calendar, 
    Shield, 
    UserCheck,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { User as UserType } from '@/types';

interface UserInfoModalProps {
    user: UserType;
    isOpen: boolean;
    onClose: () => void;
}

export default function UserInfoModal({ user, isOpen, onClose }: UserInfoModalProps) {
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
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-sm">
                                {user.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <span>Información del Usuario</span>
                    </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                    {/* User Info */}
                    <div className="space-y-4">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-blue-600 font-bold text-xl">
                                    {user.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
                            <div className="flex items-center justify-center mt-2">
                                <Badge className={getTipoColor(user.tipo)}>
                                    <div className="flex items-center space-x-1">
                                        {getTipoIcon(user.tipo)}
                                        <span className="capitalize">{user.tipo}</span>
                                    </div>
                                </Badge>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium">{user.email}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                <UserIcon className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">DNI</p>
                                    <p className="font-medium">{user.dni}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Fecha de registro</p>
                                    <p className="font-medium">{formatDate(user.created_at)}</p>
                                </div>
                            </div>
                            
                            {user.updated_at && (
                                <div className="flex items-center space-x-3">
                                    <Calendar className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-500">Última actualización</p>
                                        <p className="font-medium">{formatDate(user.updated_at)}</p>
                                    </div>
                                </div>
                            )}
                            
                            <div className="flex items-center space-x-3">
                                {user.email_verified_at ? (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                    <XCircle className="w-5 h-5 text-red-500" />
                                )}
                                <div>
                                    <p className="text-sm text-gray-500">Estado del email</p>
                                    <p className={`font-medium ${user.email_verified_at ? 'text-green-600' : 'text-red-600'}`}>
                                        {user.email_verified_at ? 'Verificado' : 'No verificado'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={onClose}>
                            Cerrar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
