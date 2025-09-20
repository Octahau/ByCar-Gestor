<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVentaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'dniCliente' => 'required|string|max:255',
            'dominio' => 'required|string|max:255',
            'procedencia' => 'nullable|string|max:255',
            'valor_venta_ars' => 'nullable|numeric|min:0',
            'valor_venta_usd' => 'nullable|numeric|min:0',
            'fecha_venta' => 'nullable|date',
            'vendedor' => 'nullable|integer|exists:users,id',
        ];
    }

    public function messages(): array
    {
        return [
            'dniCliente.required' => 'El DNI del cliente es obligatorio',
            'dniCliente.string' => 'El DNI del cliente debe ser una cadena de texto',
            'dniCliente.max' => 'El DNI del cliente no puede exceder 255 caracteres',
            'dominio.required' => 'El dominio del vehículo es obligatorio',
            'dominio.string' => 'El dominio debe ser una cadena de texto',
            'dominio.max' => 'El dominio no puede exceder 255 caracteres',
            'procedencia.string' => 'La procedencia debe ser una cadena de texto',
            'procedencia.max' => 'La procedencia no puede exceder 255 caracteres',
            'valor_venta_ars.numeric' => 'El valor de venta en ARS debe ser numérico',
            'valor_venta_ars.min' => 'El valor de venta en ARS debe ser mayor o igual a 0',
            'valor_venta_usd.numeric' => 'El valor de venta en USD debe ser numérico',
            'valor_venta_usd.min' => 'El valor de venta en USD debe ser mayor o igual a 0',
            'fecha_venta.date' => 'La fecha de venta debe ser una fecha válida',
            'vendedor.integer' => 'El vendedor debe ser un número entero',
            'vendedor.exists' => 'El vendedor seleccionado no existe',
        ];
    }
}
