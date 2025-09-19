import { AppSidebar } from '@/components/app-sidebar';
import { SectionCards } from '@/components/section-cards';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { DashboardCharts } from '@/components/dashboard-charts';
import { GananciasCards } from '@/components/ganancias-cards';

//import data from "../../../../../composer.lock"

export default function Page() {
    const mesActual = new Date().toLocaleString('es-ES', { month: 'long' });
    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <div className="px-4 lg:px-6">
                                {/* Texto dinámico del mes */}
                                <h2 className="mb-4 text-lg font-semibold">
                                    Información del mes de {mesActual.charAt(0).toUpperCase() + mesActual.slice(1)}
                                </h2>
                            </div>
                            <SectionCards />
                            
                            {/* Gráficas de evolución */}
                            <div className="mt-8">
                                <div className="px-4 lg:px-6">
                                    <h2 className="mb-6 text-lg font-semibold">
                                        Evolución Histórica
                                    </h2>
                                </div>
                                <DashboardCharts />
                            </div>
                            
                            {/* Cards de Ganancias */}
                            <div className="mt-8">
                                <div className="px-4 lg:px-6">
                                    <h2 className="mb-6 text-lg font-semibold">
                                        Resumen de Ganancias
                                    </h2>
                                </div>
                                <GananciasCards />
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
