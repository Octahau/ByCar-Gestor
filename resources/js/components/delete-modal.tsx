'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { IconAlertTriangle } from '@tabler/icons-react';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    itemName?: string;
    isLoading?: boolean;
}

export default function DeleteModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirmar eliminación",
    description = "Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar este elemento?",
    itemName,
    isLoading = false
}: DeleteModalProps) {
    const handleConfirm = () => {
        onConfirm();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                            <IconAlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-left">{title}</DialogTitle>
                            {itemName && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    {itemName}
                                </p>
                            )}
                        </div>
                    </div>
                </DialogHeader>
                
                <DialogDescription className="text-left">
                    {description}
                </DialogDescription>

                <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? "Eliminando..." : "Eliminar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
