'use client';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { IconCalendar } from '@tabler/icons-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

interface DateFilterProps {
    dateRange: DateRange | undefined;
    onDateRangeChange: (dateRange: DateRange | undefined) => void;
    placeholder?: string;
}

export default function DateFilter({ 
    dateRange, 
    onDateRangeChange, 
    placeholder = "Filtrar por rango de fechas" 
}: DateFilterProps) {
    const [isOpen, setIsOpen] = useState(false);

    const formatDateRange = (range: DateRange | undefined) => {
        if (!range?.from) return placeholder;
        
        if (range.to) {
            return `${format(range.from, "dd/MM/yyyy", { locale: es })} - ${format(range.to, "dd/MM/yyyy", { locale: es })}`;
        } else {
            return `Desde ${format(range.from, "dd/MM/yyyy", { locale: es })}`;
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                >
                    <IconCalendar className="mr-2 h-4 w-4" />
                    <span className={dateRange?.from ? "text-foreground" : "text-muted-foreground"}>
                        {formatDateRange(dateRange)}
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={(range) => {
                        onDateRangeChange(range);
                        // Cerrar el popover cuando se selecciona un rango completo
                        if (range?.from && range?.to) {
                            setIsOpen(false);
                        }
                    }}
                    numberOfMonths={2}
                    initialFocus
                    locale={es}
                />
                {dateRange?.from && (
                    <div className="p-3 border-t flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                                onDateRangeChange(undefined);
                                setIsOpen(false);
                            }}
                        >
                            Limpiar filtro
                        </Button>
                        {dateRange.from && !dateRange.to && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => {
                                    onDateRangeChange({ from: dateRange.from, to: dateRange.from });
                                    setIsOpen(false);
                                }}
                            >
                                Solo esta fecha
                            </Button>
                        )}
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
