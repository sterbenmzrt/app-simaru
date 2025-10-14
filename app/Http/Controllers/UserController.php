<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    //get all users
    public function index()
    {
        // get all users from database
        $users = User::with('roles')->get();
        $roles = Role::all();
        return Inertia::render('users/index', compact('users', 'roles'));
    }

    // store new user
    public function store(Request $request)
    {
        $validate = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'organization' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create($validate);

        // Assign default role
        $user->assignRole('Requestor');

        return redirect()->route('users')->with('success', 'User created successfully.');
    }

    // update user
    public function update(Request $request, User $user)
    {
        $validate = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'organization' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:8|confirmed',
            'role' => 'required|string|exists:roles,name',
        ]);

        if (!empty($validate['password'])) {
            $user->update($validate);
        } else {
            unset($validate['password']);
            $user->update($validate);
        }

        // sync roles
        $user->syncRoles($validate['role']);

        return redirect()->route('users')->with('success', 'User updated successfully.');
    }

    // delete user
    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('users')->with('success', 'User deleted successfully.');
    }
}
