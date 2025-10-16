<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Room;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        // Get Reservations with related User, Room, Schedule, and Approvals
        $reservations = Reservation::with(['user', 'room', 'schedule', 'approval'])->get();
        $rooms = Room::all();

        $user = Auth::user()->load('roles');
        // Get Own Reservations
        $userReservations = Reservation::with(['room', 'schedule', 'approval'])
            ->where('user_id', $user->id)
            ->get();


        // Permission based dashboard view
        $cans = [
            'view_reservation' => $user->can('view reservations'),
            'create_reservation' => $user->can('create reservations'),
            'edit_reservation' => $user->can('edit reservations'),
            'delete_reservation' => $user->can('delete reservations'),
        ];

        return Inertia::render('dashboard', compact('reservations', 'rooms', 'userReservations', 'cans', 'user'));
    }
}
