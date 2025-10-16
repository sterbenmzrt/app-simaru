<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    /** @use HasFactory<\Database\Factories\ReservationFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'room_id',
        'schedule_id',
        'status',
        'purpose',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function room()
    {
        return $this->belongsTo(Room::class);
    }
    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }
    public function approval()
    {
        return $this->hasOne(Approval::class);
    }
}
