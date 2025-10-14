<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\FacilityController;
use App\Http\Controllers\ReservationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    // User Management
    Route::get('users', [UserController::class, 'index'])->name('users');
    Route::post('users', [UserController::class, 'store'])->name('users.store');
    Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

    // Room Management
    Route::get('rooms', [RoomController::class, 'index'])->name('rooms');
    Route::post('rooms', [RoomController::class, 'store'])->name('rooms.store');
    Route::put('rooms/{room}', [RoomController::class, 'update'])->name('rooms.update');
    Route::delete('rooms/{room}', [RoomController::class, 'destroy'])->name('rooms.destroy');

    // Facility Management
    Route::get('facilities', [FacilityController::class, 'index'])->name('facilities');
    Route::post('facilities', [FacilityController::class, 'store'])->name('facilities.store');
    Route::put('facilities/{facility}', [FacilityController::class, 'update'])->name('facilities.update');
    Route::delete('facilities/{facility}', [FacilityController::class, 'destroy'])->name('facilities.destroy');

    // Reservation Management
    Route::get('reservations', [ReservationController::class, 'index'])->name('reservations');
    Route::post('reservations', [ReservationController::class, 'store'])->name('reservations.store');
    Route::put('reservations/{reservation}', [ReservationController::class, 'update'])->name('reservations.update');
    Route::delete('reservations/{reservation}', [ReservationController::class, 'destroy'])->name('reservations.destroy');

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
