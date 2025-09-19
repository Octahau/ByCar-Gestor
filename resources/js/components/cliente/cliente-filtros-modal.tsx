'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

interface ClienteFiltrosModalProps {
  onFiltersChange: (filters: { tipos: string[] }) => void;
}

export default function ClienteFiltrosModal({ onFiltersChange }: ClienteFiltrosModalProps) {
  const [open, setOpen] = React.useState(false);
  const [tiposSeleccionados, setTiposSeleccionados] = React.useState<string[]>([]);

  const tiposCliente = ['interesado', 'comprador'];

  const toggleTipo = (tipo: string) => {
    setTiposSeleccionados(prev =>
      prev.includes(tipo)
        ? prev.filter(t => t !== tipo)
        : [...prev, tipo]
    );
  };

  const handleAplicarFiltros = () => {
    onFiltersChange({
      tipos: tiposSeleccionados
    });
    setOpen(false);
  };

  const handleLimpiarFiltros = () => {
    setTiposSeleccionados([]);
    onFiltersChange({
      tipos: []
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

      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Filtrar clientes</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 my-4">
          {/* Filtros por Tipo de Cliente */}
          <div>
            <h3 className="text-sm font-medium mb-3">Tipo de Cliente</h3>
            <div className="flex flex-col gap-2">
              {tiposCliente.map(tipo => (
                <div key={tipo} className="flex items-center gap-2">
                  <Checkbox
                    checked={tiposSeleccionados.includes(tipo)}
                    onCheckedChange={() => toggleTipo(tipo)}
                  />
                  <span className="text-sm capitalize">{tipo}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <DialogClose asChild>
            <Button variant="outline" onClick={handleLimpiarFiltros}>
              Limpiar
            </Button>
          </DialogClose>
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
