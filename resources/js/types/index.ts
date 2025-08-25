export type Vehiculo = {
    id: number;
    marca: string;
    modelo: string;
    dominio: string;
    anio: number;
    color: string;
    kilometraje: number;
    precioARS: number;
    precioUSD: number;
    ubicacion: string;
    fecha: string;
    infoAuto: string;
};
export interface BreadcrumbItem {
    title: string;
    href?: string;
}
export type Venta = {
    vehicle_id: number;
    procedencia: string;
    valor_venta_ars: number;
    valor_venta_usd: number;
    ganancia_real_ars: number;
    ganancia_real_usd: number;
    fecha_venta: string; // ISO date string
    vendedor: string;
}