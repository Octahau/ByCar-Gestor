"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "Gráfica combinada de ventas y gastos totales"

interface VentasGastosChartProps {
  data: Array<{
    mes: string;
    nombreMes: string;
    ventas: number;
    gastosCorrientes: number;
    gastosVehiculos: number;
    costoAdquisicion: number;
    gastoTotal: number;
  }>;
}

const chartConfig = {
  ventas: {
    label: "Ventas",
    color: "#10b981", // Verde brillante para ventas (mismo color que VentasChart)
  },
  gastoTotal: {
    label: "Gastos Totales",
    color: "#ef4444", // Rojo para gastos totales
  },
} satisfies ChartConfig

export function VentasGastosChart({ data }: VentasGastosChartProps) {
  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Ventas vs Gastos Totales</CardTitle>
          <CardDescription>
            Comparación de ventas y gastos totales (corrientes + vehículos + costo de adquisición)
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[400px] w-full"
        >
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillVentas" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-ventas)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-ventas)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillGastoTotal" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-gastoTotal)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-gastoTotal)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="nombreMes"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  formatter={(value, name) => [
                    `$${Number(value).toLocaleString()}`,
                    chartConfig[name as keyof typeof chartConfig]?.label || name
                  ]}
                />
              }
            />
            <Area
              dataKey="ventas"
              type="natural"
              fill="url(#fillVentas)"
              stroke="var(--color-ventas)"
              strokeWidth={2}
            />
            <Area
              dataKey="gastoTotal"
              type="natural"
              fill="url(#fillGastoTotal)"
              stroke="var(--color-gastoTotal)"
              strokeWidth={2}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
