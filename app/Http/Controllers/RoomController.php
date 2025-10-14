<?php

namespace App\Http\Controllers;

use App\Models\Facility;
use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoomController extends Controller
{
    // get all rooms
    public function index()
    {
        // get all rooms from database
        $rooms = Room::with('facilities')->get();
        $facilities = Facility::all();
        return Inertia::render('rooms/index', compact('rooms', 'facilities'));
    }

    // store new room
    public function store(Request $request)
    {
        $validate = $request->validate([
            'name' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
            'location' => 'required|string|max:255',
            'facilities' => 'nullable|array',
            'facilities.*' => 'integer|exists:facilities,id',
        ]);
        $room = Room::create($validate);
        if (isset($validate['facilities'])) {
            $room->facilities()->sync($validate['facilities']); // Sync facilities if provided
        }
        return redirect()->route('rooms')->with('success', 'Room created successfully.');
    }

    // update room
    public function update(Request $request, Room $room)
    {
        $validate = $request->validate([
            'name' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
            'location' => 'required|string|max:255',
            'facilities' => 'nullable|array',
            'facilities.*' => 'integer|exists:facilities,id',
        ]);
        $room->update($validate);
        if (isset($validate['facilities'])) {
            $room->facilities()->sync($validate['facilities']); // Sync facilities if provided
        } else {
            $room->facilities()->sync([]); // Clear all facilities if none provided
            $room->update(['facilities' => []]);
        }
        return redirect()->route('rooms')->with('success', 'Room updated successfully.');
    }

    // delete room
    public function destroy(Room $room)
    {
        $room->delete();
        return redirect()->route('rooms')->with('success', 'Room deleted successfully.');
    }
}
