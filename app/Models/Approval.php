<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Approval extends Model
{
    /** @use HasFactory<\Database\Factories\ApprovalFactory> */
    use HasFactory;

    protected $fillable = [
        'reservation_id',
        'user_id',
        'stage',
        'status',
        'notes',
        'approved_at',
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
