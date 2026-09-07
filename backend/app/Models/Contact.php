<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'address',
        'birth_date',
    ];

    protected function casts(): array
    {
        return [
            'birth_date' => 'date:Y-m-d',
        ];
    }

    /**
     * Owner of the contact.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Contact's multiple phone numbers.
     */
    public function phones(): HasMany
    {
        return $this->hasMany(ContactPhone::class);
    }
}
