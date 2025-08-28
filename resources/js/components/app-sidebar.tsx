import {
    IconCamera,
    IconCar,
    IconChartBar,
    IconDashboard,
    IconFileAi,
    IconFileDescription,
    IconFileWord,
    IconHelp,
    IconInnerShadowTop,
    IconReport,
    IconSearch,
    IconSettings,
    IconUser,
} from '@tabler/icons-react';
import * as React from 'react';

import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import { Link } from '@inertiajs/react';

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

const data = {
    user: {
        name: 'octavio',
        email: 'octaviohaurigot@gmail.com',
        avatar: '/avatars/shadcn.jpg',
    },
    navMain: [
        {
            title: 'Dashboard',
            href: '/dashboard', // ruta a la página de dashboard
            icon: IconDashboard, // panel de control
        },
        {
            title: 'Vehículos',
            href: '/vehiculos', // ruta a la página de vehículos
            icon: IconCar, // representa autos o imágenes de vehículos
        },
        {
            title: 'Ventas',
            href: '/ventas',
            icon: IconChartBar, // gráfico de ventas
        },
        
        {
            title: 'Clientes',
            href: '/clientes',
            icon: IconUser, // documentos / gastos generales
        },
        {
            title: 'Gastos corrientes',
            href: '/gastos-corrientes',
            icon: IconFileDescription, // documentos / gastos generales
        },
        {
            title: 'Gastos de vehículos',
            href: '/gastos-vehiculos',
            icon: IconFileWord, // costos específicos de autos
        },
        {
            title: 'Análisis de sensibilidad',
            href: '/analisis-sensibilidad',
            icon: IconReport, // reportes / análisis
        },
    ],

    navClouds: [
        {
            title: 'Capture',
            icon: IconCamera,
            isActive: true,
            url: '#',
            items: [
                {
                    title: 'Active Proposals',
                    url: '#',
                },
                {
                    title: 'Archived',
                    url: '#',
                },
            ],
        },
        {
            title: 'Proposal',
            icon: IconFileDescription,
            url: '#',
            items: [
                {
                    title: 'Active Proposals',
                    url: '#',
                },
                {
                    title: 'Archived',
                    url: '#',
                },
            ],
        },
        {
            title: 'Prompts',
            icon: IconFileAi,
            url: '#',
            items: [
                {
                    title: 'Active Proposals',
                    url: '#',
                },
                {
                    title: 'Archived',
                    url: '#',
                },
            ],
        },
    ],
    navSecondary: [
        {
            title: 'Settings',
            url: '#',
            icon: IconSettings,
        },
        {
            title: 'Get Help',
            url: '#',
            icon: IconHelp,
        },
        {
            title: 'Search',
            url: '#',
            icon: IconSearch,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
                            <a href="#">
                                <IconInnerShadowTop className="!size-5" />
                                <span className="text-base font-semibold">ByCar Gestor</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarMenu>
                    {data.navMain.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild tooltip={item.title}>
                                <Link href={item.href}>
                                    <item.icon className="!size-5" />
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>

                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>

            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
