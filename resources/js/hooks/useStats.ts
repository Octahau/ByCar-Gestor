import { useState, useCallback } from 'react';

interface StatsData {
    cantidad: number;
    porcentaje: number;
    tendencia: string;
    importe?: number;
}

interface HistoricData {
    mes: string;
    nombreMes: string;
    total: number;
}

interface CombinedData {
    mes: string;
    nombreMes: string;
    ventas: number;
    gastosCorrientes: number;
    gastosVehiculos: number;
    costoAdquisicion: number;
    gastoTotal: number;
}

interface UseStatsReturn {
    vehiculosStats: StatsData | null;
    ventasStats: StatsData | null;
    gastosCorrientesStats: StatsData | null;
    gastosVehiculosStats: StatsData | null;
    gananciaTotal: number | null;
    gananciaMes: StatsData | null;
    gastosCorrientesHistoricos: HistoricData[];
    gastosVehiculosHistoricos: HistoricData[];
    ventasHistoricas: HistoricData[];
    ventasGastosCombinados: CombinedData[];
    loading: boolean;
    error: string | null;
    fetchAllStats: () => Promise<void>;
    fetchVehiculosStats: () => Promise<void>;
    fetchVentasStats: () => Promise<void>;
    fetchGastosCorrientesStats: () => Promise<void>;
    fetchGastosVehiculosStats: () => Promise<void>;
    fetchGananciaTotal: () => Promise<void>;
    fetchGananciaMes: () => Promise<void>;
    fetchHistoricos: () => Promise<void>;
    fetchCombinados: () => Promise<void>;
}

export function useStats(): UseStatsReturn {
    const [vehiculosStats, setVehiculosStats] = useState<StatsData | null>(null);
    const [ventasStats, setVentasStats] = useState<StatsData | null>(null);
    const [gastosCorrientesStats, setGastosCorrientesStats] = useState<StatsData | null>(null);
    const [gastosVehiculosStats, setGastosVehiculosStats] = useState<StatsData | null>(null);
    const [gananciaTotal, setGananciaTotal] = useState<number | null>(null);
    const [gananciaMes, setGananciaMes] = useState<StatsData | null>(null);
    const [gastosCorrientesHistoricos, setGastosCorrientesHistoricos] = useState<HistoricData[]>([]);
    const [gastosVehiculosHistoricos, setGastosVehiculosHistoricos] = useState<HistoricData[]>([]);
    const [ventasHistoricas, setVentasHistoricas] = useState<HistoricData[]>([]);
    const [ventasGastosCombinados, setVentasGastosCombinados] = useState<CombinedData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchVehiculosStats = useCallback(async () => {
        try {
            const response = await fetch('/vehiculos-cantidad');
            if (!response.ok) throw new Error('Error al cargar estadísticas de vehículos');
            const data = await response.json();
            setVehiculosStats(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        }
    }, []);

    const fetchVentasStats = useCallback(async () => {
        try {
            const response = await fetch('/ventas-cantidad');
            if (!response.ok) throw new Error('Error al cargar estadísticas de ventas');
            const data = await response.json();
            setVentasStats(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        }
    }, []);

    const fetchGastosCorrientesStats = useCallback(async () => {
        try {
            const response = await fetch('/gastos-corrientes-cantidad');
            if (!response.ok) throw new Error('Error al cargar estadísticas de gastos corrientes');
            const data = await response.json();
            setGastosCorrientesStats(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        }
    }, []);

    const fetchGastosVehiculosStats = useCallback(async () => {
        try {
            const response = await fetch('/gasto-vehiculo-cantidad');
            if (!response.ok) throw new Error('Error al cargar estadísticas de gastos de vehículos');
            const data = await response.json();
            setGastosVehiculosStats(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        }
    }, []);

    const fetchGananciaTotal = useCallback(async () => {
        try {
            const response = await fetch('/ganancia-total-acumulada');
            if (!response.ok) throw new Error('Error al cargar ganancia total');
            const data = await response.json();
            setGananciaTotal(data.data.gananciaTotal);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        }
    }, []);

    const fetchGananciaMes = useCallback(async () => {
        try {
            const response = await fetch('/ganancia-mes-actual');
            if (!response.ok) throw new Error('Error al cargar ganancia del mes');
            const data = await response.json();
            setGananciaMes(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        }
    }, []);

    const fetchHistoricos = useCallback(async () => {
        try {
            const [corrientesRes, vehiculosRes, ventasRes] = await Promise.all([
                fetch('/gastos-corrientes-historicos'),
                fetch('/gastos-vehiculos-historicos'),
                fetch('/ventas-historicas')
            ]);

            if (!corrientesRes.ok) throw new Error('Error al cargar gastos corrientes históricos');
            if (!vehiculosRes.ok) throw new Error('Error al cargar gastos de vehículos históricos');
            if (!ventasRes.ok) throw new Error('Error al cargar ventas históricas');

            const [corrientesData, vehiculosData, ventasData] = await Promise.all([
                corrientesRes.json(),
                vehiculosRes.json(),
                ventasRes.json()
            ]);

            setGastosCorrientesHistoricos(corrientesData);
            setGastosVehiculosHistoricos(vehiculosData);
            setVentasHistoricas(ventasData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        }
    }, []);

    const fetchCombinados = useCallback(async () => {
        try {
            const response = await fetch('/ventas-gastos-combinados');
            if (!response.ok) throw new Error('Error al cargar datos combinados');
            const data = await response.json();
            setVentasGastosCombinados(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        }
    }, []);

    const fetchAllStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            await Promise.all([
                fetchVehiculosStats(),
                fetchVentasStats(),
                fetchGastosCorrientesStats(),
                fetchGastosVehiculosStats(),
                fetchGananciaTotal(),
                fetchGananciaMes(),
                fetchHistoricos(),
                fetchCombinados()
            ]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }, [
        fetchVehiculosStats,
        fetchVentasStats,
        fetchGastosCorrientesStats,
        fetchGastosVehiculosStats,
        fetchGananciaTotal,
        fetchGananciaMes,
        fetchHistoricos,
        fetchCombinados
    ]);

    return {
        vehiculosStats,
        ventasStats,
        gastosCorrientesStats,
        gastosVehiculosStats,
        gananciaTotal,
        gananciaMes,
        gastosCorrientesHistoricos,
        gastosVehiculosHistoricos,
        ventasHistoricas,
        ventasGastosCombinados,
        loading,
        error,
        fetchAllStats,
        fetchVehiculosStats,
        fetchVentasStats,
        fetchGastosCorrientesStats,
        fetchGastosVehiculosStats,
        fetchGananciaTotal,
        fetchGananciaMes,
        fetchHistoricos,
        fetchCombinados,
    };
}
