<?php

namespace Database\Factories;

use App\Models\Schedule;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

class ScheduleFactory extends Factory
{
    protected $model = Schedule::class;

    public function definition(): array
    {
        // Ambil tanggal random dalam rentang 10 hari ke depan
        $date = $this->faker->dateTimeBetween('+1 days', '+10 days');

        // Jadikan Carbon object
        $date = Carbon::instance($date)->startOfDay(); // Buang jam, ambil hanya tanggal

        // Random jam antara 08:00 sampai 16:00 untuk start_time
        $startHour = rand(8, 16); // maksimal 16 supaya end_time tidak lewat 17:00
        $startTime = $date->copy()->addHours($startHour);

        // Random durasi (1 sampai 2 jam)
        $durationHours = rand(1, min(17 - $startHour, 2)); // max jam 5 sore
        $endTime = $startTime->copy()->addHours($durationHours);

        return [
            'start_time' => $startTime,
            'end_time' => $endTime,
            'is_blocked' => false,
        ];
    }
}
