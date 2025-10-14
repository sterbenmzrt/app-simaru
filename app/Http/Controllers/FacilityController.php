<?php

namespace App\Http\Controllers;

use App\Models\Facility;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FacilityController extends Controller
{
    // get all facilities
    public function index()
    {
        $facilities = Facility::all();
        return Inertia::render('facilities/index', compact('facilities'));
    }

    // store new facility
    public function store(Request $request)
    {
        $validate = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        Facility::create($validate);

        return redirect()->route('facilities')->with('success', 'Facility created successfully.');
    }

    // update facility
    public function update(Request $request, Facility $facility)
    {
        $validate = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $facility->update($validate);

        return redirect()->route('facilities')->with('success', 'Facility updated successfully.');
    }

    // delete facility
    public function destroy(Facility $facility)
    {
        $facility->delete();

        return redirect()->route('facilities')->with('success', 'Facility deleted successfully.');
    }
}
