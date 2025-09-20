import { useEffect, useState } from 'react';
import { VentasGastosChart } from './ventas-gastos-chart';

interface VentasGastosData {
  mes: string;
  nombreMes: string;
  ventas: number;
  gastosCorrientes: number;
  gastosVehiculos: number;
  costoAdquisicion: number;
  gastoTotal: number;
}

export function DashboardCharts() {
  const [ventasGastosData, setVentasGastosData] = useState<VentasGastosData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        console.log('Obteniendo datos de ventas y gastos combinados...');
        
        // Obtener datos combinados de ventas y gastos
        const response = await fetch('/ventas-gastos-combinados');
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('Respuesta no es JSON:', text.substring(0, 200));
          throw new Error('La respuesta no es JSON válido');
        }
        
        const data = await response.json();
        console.log('Datos recibidos:', data);
        
        if (Array.isArray(data) && data.length > 0) {
          setVentasGastosData(data);
        } else {
          throw new Error('Datos no válidos recibidos del servidor');
        }
      } catch (error) {
        console.error('Error al obtener los datos de las gráficas:', error);
        setError(error instanceof Error ? error.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 px-4 lg:px-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-80 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 gap-6 px-4 lg:px-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h3 className="text-lg font-semibold text-red-800">Error al cargar los datos</h3>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 px-4 lg:px-6">
      <VentasGastosChart data={ventasGastosData} />
    </div>
  );
}
