'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { VentaTable } from '@/types';

interface FiltrosModalProps {
  data: VentaTable[];
  onFiltersChange: (filters: { vendedores: string[] }) => void;
}

export default function FiltrosModal({ data, onFiltersChange }: FiltrosModalProps) {
  const [open, setOpen] = React.useState(false);
  const [vendedoresSeleccionados, setVendedoresSeleccionados] = React.useState<string[]>([]);

  // Obtener valores únicos de vendedor
  const vendedoresUnicos = React.useMemo(() => {
    const vendedores = data.map(item => item.vendedor).filter(Boolean);
    return Array.from(new Set(vendedores)).sort();
  }, [data]);

  const toggleVendedor = (vendedor: string) => {
    setVendedoresSeleccionados(prev =>
      prev.includes(vendedor)
        ? prev.filter(v => v !== vendedor)
        : [...prev, vendedor]
    );
  };

  const handleAplicarFiltros = () => {
    onFiltersChange({
      vendedores: vendedoresSeleccionados
    });
    setOpen(false);
  };

  const handleLimpiarFiltros = () => {
    setVendedoresSeleccionados([]);
    onFiltersChange({
      vendedores: []
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          Filtrar
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Filtrar ventas</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 my-4">
          {/* Filtros por Vendedor */}
          <div>
            <h3 className="text-sm font-medium mb-3">Vendedor</h3>
            <div className="flex flex-col gap-2 max-h-32 overflow-y-auto">
              {vendedoresUnicos.map(vendedor => (
                <div key={vendedor} className="flex items-center gap-2">
                  <Checkbox
                    checked={vendedoresSeleccionados.includes(vendedor)}
                    onCheckedChange={() => toggleVendedor(vendedor)}
                  />
                  <span className="text-sm">{vendedor}</span>
                </div>
              ))}
              {vendedoresUnicos.length === 0 && (
                <p className="text-sm text-muted-foreground">No hay datos de vendedores disponibles</p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleLimpiarFiltros}>
            Limpiar
          </Button>
          <DialogClose asChild>
            <Button onClick={handleAplicarFiltros}>
              Aplicar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
