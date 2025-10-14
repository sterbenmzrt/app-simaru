<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Room>
 */
class RoomFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        $namaGedung = [
            'Gedung Merdeka',
            'Aula Garuda',
            'Ruang Serba Guna',
            'Gedung Bina Nusantara',
            'Balai Pertemuan',
            'Gedung Pancasila',
            'Ruang Rapat Utama',
            'Gedung Harmoni',
            'Gedung Nusantara',
            'Aula Mandala',
        ];
        return [
            //create fake data for rooms table
            'name' => fake('id_ID')->randomElement($namaGedung),
            'location' => fake('id_ID')->address(),
            'capacity' => fake()->numberBetween(1, 100),
        ];
    }
}
