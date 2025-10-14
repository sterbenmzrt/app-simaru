<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Database\Seeders\RoleSeeder;
use App\Models\Room;
use App\Models\Facility;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        $this->call(RoleSeeder::class);

        // User::factory(10)->create();

        // 1. Super_Admin
        $superAdmin = User::firstOrCreate(
            ['email' => 'superadmin@example.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $superAdmin->assignRole('Super_Admin');

        // 2. Requestor
        $requestor = User::firstOrCreate(
            ['email' => 'requestor@example.com'],
            [
                'name' => 'Requestor User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $requestor->assignRole('Requestor');

        // 3. Aggregator
        $aggregator = User::firstOrCreate(
            ['email' => 'aggregator@example.com'],
            [
                'name' => 'Aggregator User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $aggregator->assignRole('Aggregator');

        // 4. Approver
        $approver = User::firstOrCreate(
            ['email' => 'approver@example.com'],
            [
                'name' => 'Approver User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $approver->assignRole('Approver');

        // Create rooms and facilities with relationships
        Facility::factory(5)->create();
        $allFacilities = Facility::all();

        Room::factory(10)->create()->each(function ($room) use ($allFacilities) {
            // Ambil random 1 sampai 5 fasilitas dari yang sudah ada
            $facilities = $allFacilities->random(rand(1, 5));
            $room->facilities()->attach($facilities->pluck('id')->toArray());
        });
    }
}
