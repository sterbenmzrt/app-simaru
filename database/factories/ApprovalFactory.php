<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Approval;
use App\Models\Reservation;
use App\Models\User;
use Spatie\Permission\Models\Role;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Approval>
 */
class ApprovalFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Approval::class;

    public function definition()
    {
        $stage = $this->faker->randomElement(['requested', 'approved', 'rejected']);
        $status = $this->faker->randomElement(['pending', 'approved', 'rejected', 'cancelled']);

        return [
            'reservation_id' => Reservation::factory(),
            'user_id' => User::role('approval')->inRandomOrder()->first()?->id ?? User::factory(),
            'stage' => $stage,
            'status' => $status,
            'notes' => $this->faker->optional()->sentence(),
            'approved_at' => in_array($status, ['approved']) ? $this->faker->date() : null,
        ];
    }
}
