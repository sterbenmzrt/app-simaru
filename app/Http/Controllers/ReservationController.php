<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\User;
use App\Models\Room;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;


class ReservationController extends Controller
{
    // Get all reservations
    public function index()
    {
        $reservations = Reservation::with(['user', 'room', 'schedule'])->get();
        $users = User::all();
        $rooms = Room::all();
        $schedules = Schedule::all();

        return Inertia::render('reservations/index', compact('reservations', 'users', 'rooms', 'schedules'));
    }

    // Store new reservation
    public function store(Request $request)
    {
        // dd($request->all());

        // Create Schedule first
        $schedule = Schedule::create([
            'start_time' => $request->input('start_time'),
            'end_time' => $request->input('end_time'),
            'is_blocked' => false,
        ]);

        // get the id of the created schedule
        $scheduleId = $schedule->id;

        // get user id of the currently authenticated user
        $userId = Auth::id();

        $validate = $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'status' => 'required|in:pending,approved,rejected,cancelled',
            'purpose' => 'nullable|string',
        ]);

        Reservation::create(array_merge($validate, ['schedule_id' => $scheduleId, 'user_id' => $userId]));

        return redirect()->route('reservations')->with('success', 'Reservation created successfully.');
    }

    // Update reservation
    public function update(Request $request, Reservation $reservation)
    {
        // dd($request->all());
        $validate = $request->validate([
            'status' => 'required|in:pending,approved,rejected,cancelled',
            'purpose' => 'nullable|string',
        ]);

        $reservation->update($validate);

        return redirect()->route('reservations')->with('success', 'Reservation updated successfully.');
    }

    // Delete reservation
    public function destroy(Reservation $reservation)
    {
        $reservation->delete();
        return redirect()->route('reservations')->with('success', 'Reservation deleted successfully.');
    }
}
