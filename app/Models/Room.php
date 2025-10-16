<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    /** @use HasFactory<\Database\Factories\RoomFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'location',
        'capacity',
    ];

    public function facilities()
    {
        return $this->belongsToMany(Facility::class);
    }
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }
}
