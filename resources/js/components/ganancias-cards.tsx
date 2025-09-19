import { useEffect, useState } from 'react';
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IconTrendingUp, IconCurrencyDollar } from '@tabler/icons-react';
import { Link } from '@inertiajs/react';

interface GananciasData {
  gananciaTotal: number;
  gananciaMes: number;
  porcentaje: number;
  tendencia: 'positiva' | 'negativa' | 'neutra';
}

export function GananciasCards() {
  const [gananciasData, setGananciasData] = useState<GananciasData>({
    gananciaTotal: 0,
    gananciaMes: 0,
    porcentaje: 0,
    tendencia: 'neutra'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener ganancia total acumulada
        const gananciaTotalRes = await fetch('/ganancia-total-acumulada');
        const gananciaTotalData = await gananciaTotalRes.json();

        // Obtener ganancia del mes actual
        const gananciaMesRes = await fetch('/ganancia-mes-actual');
        const gananciaMesData = await gananciaMesRes.json();

        if (gananciaTotalData.success && gananciaMesData.success) {
          setGananciasData({
            gananciaTotal: gananciaTotalData.gananciaTotal || 0,
            gananciaMes: gananciaMesData.gananciaMes || 0,
            porcentaje: gananciaMesData.porcentaje || 0,
            tendencia: gananciaMesData.tendencia || 'neutra'
          });
        }
      } catch (error) {
        console.error('Error al obtener los datos de ganancias:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-2 dark:*:data-[slot=card]:bg-card">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-2 dark:*:data-[slot=card]:bg-card">
      {/* Card de Ganancia Total Acumulada */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Ganancia Total Acumulada</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ${gananciasData.gananciaTotal.toLocaleString('es-AR', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-green-600 border-green-600">
              <IconCurrencyDollar className="h-3 w-3 mr-1" />
              Histórico
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <Link href="/ventas" className="w-full">
            <Button variant="secondary" className="w-full">
              Ver Ventas
            </Button>
          </Link>
        </CardFooter>
      </Card>

      {/* Card de Ganancia del Mes Actual */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Ganancia del Mes Actual</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ${gananciasData.gananciaMes.toLocaleString('es-AR', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </CardTitle>
          <CardAction>
            <Badge 
              variant="outline" 
              className={
                gananciasData.tendencia === 'positiva' 
                  ? 'text-green-600 border-green-600' 
                  : gananciasData.tendencia === 'negativa' 
                  ? 'text-red-600 border-red-600' 
                  : 'text-gray-600 border-gray-600'
              }
            >
              <IconTrendingUp 
                className={`h-3 w-3 mr-1 ${
                  gananciasData.tendencia === 'negativa' ? 'rotate-180' : ''
                }`} 
              />
              {gananciasData.porcentaje > 0 ? '+' : ''}{gananciasData.porcentaje}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <Link href="/ventas" className="w-full">
            <Button variant="secondary" className="w-full">
              Ver Ventas
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
