export type Vehiculo = {
    id: number
    marca: string
    modelo: string
    dominio: string
    anio: number
    color: string
    kilometraje: number
    precioARS: number
    precioUSD: number
    ubicacion: string
    }

export type VehiculoFormatted = {
    id: number;
    marca: string;
    modelo: string;
    dominio: string;
    año: number;
    color: string;
    kilometraje: string;
    km: number;
    infoauto: string;
    precio_ars: number;
    precio_usd: number;
    antiguedad: string;
    ubicacion: string;
    ingreso: string;
};
