<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContactPhone extends Model
{
    use HasFactory;

    protected $fillable = [
        'contact_id',
        'phone_number',
        'label',
    ];

    /**
     * Parent contact relationship.
     */
    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }
}
