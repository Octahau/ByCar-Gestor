import { useEffect, useState } from 'react';
import { GastosChart } from './gastos-chart';
import { VentasChart } from './ventas-chart';

interface ChartData {
  mes: string;
  nombreMes: string;
  gastosCorrientes: number;
  gastosVehiculos: number;
  total: number;
}

interface VentasData {
  mes: string;
  nombreMes: string;
  total: number;
}

export function DashboardCharts() {
  const [gastosData, setGastosData] = useState<ChartData[]>([]);
  const [ventasData, setVentasData] = useState<VentasData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos de gastos corrientes
        const gastosCorrientesRes = await fetch('/gastos-corrientes-historicos');
        const gastosCorrientesData = await gastosCorrientesRes.json();

        // Obtener datos de gastos de vehículos
        const gastosVehiculosRes = await fetch('/gastos-vehiculos-historicos');
        const gastosVehiculosData = await gastosVehiculosRes.json();

        // Obtener datos de ventas
        const ventasRes = await fetch('/ventas-historicas');
        const ventasData = await ventasRes.json();

        if (gastosCorrientesData.success && gastosVehiculosData.success && ventasData.success) {
          // Combinar datos de gastos
          const combinedGastosData: ChartData[] = gastosCorrientesData.data.map((gasto: any) => {
            const gastoVehiculo = gastosVehiculosData.data.find((gv: any) => gv.mes === gasto.mes);
            return {
              mes: gasto.mes,
              nombreMes: gasto.nombreMes,
              gastosCorrientes: gasto.total,
              gastosVehiculos: gastoVehiculo ? gastoVehiculo.total : 0,
              total: gasto.total + (gastoVehiculo ? gastoVehiculo.total : 0)
            };
          });

          setGastosData(combinedGastosData);
          setVentasData(ventasData.data);
        }
      } catch (error) {
        console.error('Error al obtener los datos de las gráficas:', error);
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
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-80 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 px-4 lg:px-6">
      <GastosChart data={gastosData} />
      <VentasChart data={ventasData} />
    </div>
  );
}
