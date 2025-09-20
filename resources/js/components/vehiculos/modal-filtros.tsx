'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog'; // Ajusta al path de tu proyecto
import { Checkbox } from '@/components/ui/checkbox'; // el checkbox que definiste

export default function FiltrosModal() {
  const [open, setOpen] = React.useState(false);
  const [filtrosSeleccionados, setFiltrosSeleccionados] = React.useState<string[]>([]);

  const opcionesFiltros = ['Marca', 'Modelo', 'Color', 'Año', 'Ubicación'];

  const toggleFiltro = (filtro: string) => {
    setFiltrosSeleccionados(prev =>
      prev.includes(filtro)
        ? prev.filter(f => f !== filtro)
        : [...prev, filtro]
    );
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
          <DialogTitle>Selecciona los filtros</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2 my-4">
          {opcionesFiltros.map(filtro => (
            <div key={filtro} className="flex items-center gap-2">
              <Checkbox
                checked={filtrosSeleccionados.includes(filtro)}
                onCheckedChange={() => toggleFiltro(filtro)}
              />
              <span>{filtro}</span>
            </div>
          ))}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={() => console.log('Filtros aplicados:', filtrosSeleccionados)}>
              Aplicar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
