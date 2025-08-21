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
};
export interface BreadcrumbItem {
    title: string;
    href?: string;
}
