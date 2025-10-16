<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
     /** @use HasFactory<\Database\Factories\ReservationFactory> */
    use HasFactory;

    protected $fillable = [
        'room_id',
        'start_time',
        'end_time',
        'is_blocked',
    ];

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
