import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';
import { IconDots } from '@tabler/icons-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string | NonNullable<InertiaLinkProps['href']>;
    icon?: any;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
export type Empleado = {
    id: number;
    name: string;
}
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
// export interface BreadcrumbItem {
//     title: string;
//     href?: string;
// }
export type Cliente = {
    id: number;
    dni: string;
    nombre: string;
    telefono: string;
    email: string;
}

export type Venta = {
    dniCliente: string;
    dominio: string;
    procedencia: string;
    valor_venta_ars: number;
    valor_venta_usd: number;
    fecha_venta: string; // ISO date string
    vendedor: string;
}

export type VentaTable ={
    id: number;
    marca: string;
    modelo: string;
    dominio: string;
    procedencia: string;
    valor_venta_ars: number;
    valor_venta_usd: number;
    ganancia_real_ars: number;
    ganancia_real_usd: number;
    fecha: string; // ISO date string
    vendedor: string;
}
export type  GastoCorriente = {
    operador: string;
    motivo: string;
    descripcion: string;
    importe: number;
    fondo: string;
    fecha: string;
}
export type  GastoCorrienteTable = {
    id: number ;
    operador: string;
    motivo: string;
    descripcion: string;
    importe: number;
    fondo: string;
    fecha: string;
}

export type GastoVehiculo = {
    dominio: string;
    operador: string;
    tipo_gasto: string;
    descripcion: string;
    importe: number;
    fecha: string;
}

export type GastoVehiculoTable = {
    id: number ;
    dominio: string;
    operador: string;
    tipo_gasto: string;
    descripcion: string;
    importe_ars: number;
    importe_usd: number;
    fecha: string;
}