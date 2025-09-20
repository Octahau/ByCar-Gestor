<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVehiculoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'marca' => 'nullable|string|max:255',
            'modelo' => 'nullable|string|max:255',
            'dominio' => 'nullable|string|max:255|unique:vehiculos,dominio',
            'anio' => 'nullable|integer|min:1900|max:'.date('Y'),
            'color' => 'nullable|string|max:50',
            'kilometraje' => 'nullable|numeric|min:0',
            'precioARS' => 'nullable|numeric|min:0',
            'precioUSD' => 'nullable|numeric|min:0',
            'precio_venta_sugerido_ars' => 'nullable|numeric|min:0',
            'precio_venta_sugerido_usd' => 'nullable|numeric|min:0',
            'ubicacion' => 'nullable|string|max:255',
            'fecha' => 'nullable|date',
            'infoAuto' => 'nullable|string|max:255',
            'tipo' => 'nullable|string|in:auto,camioneta',
        ];
    }

    public function messages(): array
    {
        return [
            'marca.string' => 'La marca debe ser una cadena de texto',
            'marca.max' => 'La marca no puede exceder 255 caracteres',
            'modelo.string' => 'El modelo debe ser una cadena de texto',
            'modelo.max' => 'El modelo no puede exceder 255 caracteres',
            'dominio.string' => 'El dominio debe ser una cadena de texto',
            'dominio.max' => 'El dominio no puede exceder 255 caracteres',
            'dominio.unique' => 'Ya existe un vehículo con ese dominio',
            'anio.integer' => 'El año debe ser un número entero',
            'anio.min' => 'El año debe ser mayor o igual a 1900',
            'anio.max' => 'El año no puede ser mayor al año actual',
            'color.string' => 'El color debe ser una cadena de texto',
            'color.max' => 'El color no puede exceder 50 caracteres',
            'kilometraje.numeric' => 'El kilometraje debe ser numérico',
            'kilometraje.min' => 'El kilometraje debe ser mayor o igual a 0',
            'precioARS.numeric' => 'El precio en ARS debe ser numérico',
            'precioARS.min' => 'El precio en ARS debe ser mayor o igual a 0',
            'precioUSD.numeric' => 'El precio en USD debe ser numérico',
            'precioUSD.min' => 'El precio en USD debe ser mayor o igual a 0',
            'precio_venta_sugerido_ars.numeric' => 'El precio de venta sugerido en ARS debe ser numérico',
            'precio_venta_sugerido_ars.min' => 'El precio de venta sugerido en ARS debe ser mayor o igual a 0',
            'precio_venta_sugerido_usd.numeric' => 'El precio de venta sugerido en USD debe ser numérico',
            'precio_venta_sugerido_usd.min' => 'El precio de venta sugerido en USD debe ser mayor o igual a 0',
            'ubicacion.string' => 'La ubicación debe ser una cadena de texto',
            'ubicacion.max' => 'La ubicación no puede exceder 255 caracteres',
            'fecha.date' => 'La fecha debe ser una fecha válida',
            'infoAuto.string' => 'La información del auto debe ser una cadena de texto',
            'infoAuto.max' => 'La información del auto no puede exceder 255 caracteres',
            'tipo.string' => 'El tipo debe ser una cadena de texto',
            'tipo.in' => 'El tipo debe ser "auto" o "camioneta"',
        ];
    }
}
