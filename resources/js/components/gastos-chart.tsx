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

export const description = "Gráfica de gastos totales acumulados"

interface GastosChartProps {
  data: Array<{
    mes: string;
    nombreMes: string;
    gastosCorrientes: number;
    gastosVehiculos: number;
    total: number;
  }>;
}

const chartConfig = {
  gastosCorrientes: {
    label: "Gastos Corrientes",
    color: "#3b82f6", // Azul brillante
  },
  gastosVehiculos: {
    label: "Gastos Vehículos",
    color: "#1d4ed8", // Azul más oscuro
  },
  total: {
    label: "Total Gastos",
    color: "#1e40af", // Azul oscuro para el total
  },
} satisfies ChartConfig

export function GastosChart({ data }: GastosChartProps) {
  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Evolución de Gastos Totales</CardTitle>
          <CardDescription>
            Gastos corrientes y de vehículos mes a mes
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillGastosCorrientes" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-gastosCorrientes)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-gastosCorrientes)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillGastosVehiculos" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-gastosVehiculos)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-gastosVehiculos)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-total)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-total)"
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
              dataKey="gastosCorrientes"
              type="natural"
              fill="url(#fillGastosCorrientes)"
              stroke="var(--color-gastosCorrientes)"
              stackId="a"
            />
            <Area
              dataKey="gastosVehiculos"
              type="natural"
              fill="url(#fillGastosVehiculos)"
              stroke="var(--color-gastosVehiculos)"
              stackId="a"
            />
            <Area
              dataKey="total"
              type="natural"
              fill="url(#fillTotal)"
              stroke="var(--color-total)"
              stackId="b"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
