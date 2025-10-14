<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Facility>
 */
class FacilityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $facilities = [
            'Proyektor',
            'Whiteboard',
            'Koneksi Internet',
            'Sound System',
            'AC',
            'Meja dan Kursi',
            'Papan Tulis',
            'Layar Proyeksi',
            'Microphone',
            'Speaker',
        ];
        return [
            //create fake data for facilities table
            'name' => fake()->randomElement($facilities),
            'description' => fake()->sentence(),
        ];
    }
}
