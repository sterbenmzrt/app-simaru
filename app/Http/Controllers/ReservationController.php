<?php

namespace App\Http\Controllers;

use App\Models\Approval;
use App\Models\Reservation;
use App\Models\User;
use App\Models\Room;
use App\Models\Schedule;
use App\Notifications\ApprovalWorkflowNotification;
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

        $user = Auth::user()->load('roles');

        // Permission based dashboard view
        $cans = [
            'view_reservation' => $user->can('view reservations'),
            'create_reservation' => $user->can('create reservations'),
            'edit_reservation' => $user->can('edit reservations'),
            'delete_reservation' => $user->can('delete reservations'),
        ];

        return Inertia::render('reservations/index', compact('reservations', 'users', 'rooms', 'schedules', 'cans', 'user'));
    }

    // Store new reservation
    public function store(Request $request)
    {
        // dd($request->all());

        // Schedule Check First
        $scheduleValidation = $request->validate([
            'start_time' => 'required|date|after:now',
            'end_time' => 'required|date|after:start_time',
            'room_id' => 'required|exists:rooms,id',
        ]);

        $roomId = $scheduleValidation['room_id'];

        // Check for conflict in the same room and status is pending or approved
        $conflict = Schedule::where('room_id', $roomId)
            ->whereHas('reservations', function ($query) {
                $query->whereIn('status', ['pending', 'approved']);
            })
            ->where(function ($query) use ($scheduleValidation) {
                $query->whereBetween('start_time', [$scheduleValidation['start_time'], $scheduleValidation['end_time']])
                    ->orWhereBetween('end_time', [$scheduleValidation['start_time'], $scheduleValidation['end_time']])
                    ->orWhere(function ($query) use ($scheduleValidation) {
                        $query->where('start_time', '<=', $scheduleValidation['start_time'])
                                ->where('end_time', '>=', $scheduleValidation['end_time']);
                    });
            })
            ->exists();

        if ($conflict) {
            return redirect()->back()->with([
                'error' => 'The selected time slot is already booked for this room.',
            ])->withInput();
        }

        // Create Schedule first
        $schedule = Schedule::create([
            'room_id' => $request->input('room_id'),
            'start_time' => $request->input('start_time'),
            'end_time' => $request->input('end_time'),
            'is_blocked' => false,
        ]);

        // get the id of the created schedule
        $scheduleId = $schedule->id;

        // get user id of the currently authenticated user
        $userId = Auth::id();
        $userRole = Auth::user()->load('roles');

        $validate = $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'status' => 'required|in:pending,approved,rejected,cancelled',
            'purpose' => 'nullable|string',
        ]);

        $reservation = Reservation::create(array_merge($validate, ['schedule_id' => $scheduleId, 'user_id' => $userId]));

        // Create Approval entry if the user is a Requestor
        if($userRole->hasRole('Requestor')){
            Approval::create([
                'reservation_id' => $reservation->id,
                'user_id' => $userId,
                'stages' => "REQUESTED",
                'notes' => $reservation->purpose,
                'status' => 'pending',
                'approved_at' => null,
            ]);
        }

        if($userRole->hasRole('Requestor')){
            return redirect()->route('dashboard')->with('success', 'Reservation created successfully.');
        }
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

        $userRole = Auth::user()->load('roles');

        // If the user is an Approver, update or create the Approval entry
        if($userRole->hasRole('Approver')){
            $approval = Approval::where('reservation_id', $reservation->id)
                ->first();

            if($approval){
                // if status is approved, set approved_at date
                if($request->input('status') === 'approved'){
                    $approval->update([
                        'stages' => 'approved',
                        'approved_at' => now(),
                        'status' => 'approved',
                    ]);
                    // Jika disetujui
                    $reservation->user->notify(new ApprovalWorkflowNotification($reservation->user, 'approved'));
                } elseif($request->input('status') === 'rejected'){
                    $approval->update([
                        'stages' => 'rejected',
                        'approved_at' => null,
                        'status' => 'rejected',
                    ]);
                    // Jika ditolak
                    $reservation->user->notify(new ApprovalWorkflowNotification($reservation->user, 'rejected', $request->input('notes')));
                }
            }

            return redirect()->route('dashboard')->with('success', 'Reservation updated successfully.');
        }

        return redirect()->route('reservations')->with('success', 'Reservation updated successfully.');
    }

    // Delete reservation
    public function destroy(Reservation $reservation)
    {
        $reservation->delete();
        return redirect()->route('reservations')->with('success', 'Reservation deleted successfully.');
    }
}
