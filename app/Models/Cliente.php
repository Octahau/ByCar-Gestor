<?php

namespace App\Models;

use App\Enums\TipoCliente;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    use HasFactory;

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'cliente_id';

    protected $fillable = [
        'nombre',
        'dni',
        'email',
        'telefono',
        'tipo',
        'observaciones',
    ];

    protected function casts(): array
    {
        return [
            'tipo' => TipoCliente::class,
        ];
    }

    // Relación: un cliente puede tener muchas ventas
    public function ventas()
    {
        return $this->hasMany(Venta::class, 'cliente_id', 'cliente_id');
    }
}
