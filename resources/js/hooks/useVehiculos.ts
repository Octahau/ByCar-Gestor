import { useState, useCallback } from 'react';
import { Vehiculo } from '@/types';

interface UseVehiculosReturn {
    vehiculos: Vehiculo[];
    loading: boolean;
    error: string | null;
    fetchVehiculos: () => Promise<void>;
    createVehiculo: (data: Partial<Vehiculo>) => Promise<Vehiculo | null>;
    updateVehiculo: (id: number, data: Partial<Vehiculo>) => Promise<Vehiculo | null>;
    deleteVehiculo: (id: number) => Promise<boolean>;
}

export function useVehiculos(): UseVehiculosReturn {
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchVehiculos = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch('/vehiculos');
            if (!response.ok) {
                throw new Error('Error al cargar vehículos');
            }
            const data = await response.json();
            setVehiculos(data.vehiculos || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }, []);

    const createVehiculo = useCallback(async (data: Partial<Vehiculo>): Promise<Vehiculo | null> => {
        setLoading(true);
        setError(null);
        
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch('/vehiculos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            
            if (result.success) {
                setVehiculos(prev => [...prev, result.vehiculo]);
                return result.vehiculo;
            } else {
                throw new Error(result.message || 'Error al crear vehículo');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateVehiculo = useCallback(async (id: number, data: Partial<Vehiculo>): Promise<Vehiculo | null> => {
        setLoading(true);
        setError(null);
        
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch(`/vehiculos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            
            if (result.success) {
                setVehiculos(prev => prev.map(v => v.id === id ? result.vehiculo : v));
                return result.vehiculo;
            } else {
                throw new Error(result.message || 'Error al actualizar vehículo');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteVehiculo = useCallback(async (id: number): Promise<boolean> => {
        setLoading(true);
        setError(null);
        
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch(`/vehiculos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                    'Accept': 'application/json',
                },
            });

            const result = await response.json();
            
            if (result.success) {
                setVehiculos(prev => prev.filter(v => v.id !== id));
                return true;
            } else {
                throw new Error(result.message || 'Error al eliminar vehículo');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        vehiculos,
        loading,
        error,
        fetchVehiculos,
        createVehiculo,
        updateVehiculo,
        deleteVehiculo,
    };
}
