<?php

namespace Database\Factories;

use App\Models\Reservation;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reservation>
 */
class ReservationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Reservation::class;

    public function definition(): array
    {
        return [
            'user_id' => 1,
            'room_id' => 1,
            'schedule_id' => Schedule::factory(),
            // 'status' => $this->faker->randomElement(['pending', 'approved', 'rejected', 'cancelled']),
            'status' => 'pending',
            'purpose' => $this->faker->sentence(),
        ];
    }
}
