<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    public function run()
    {
        // Buat permissions
        $permissions = [
            'view reservations',
            'create reservations',
            'edit reservations',
            'delete reservations',
        ];

        $superAdmin = Role::firstOrCreate(['name' => 'Super_Admin']);
        $approver = Role::firstOrCreate(['name' => 'Approver']);
        $requestor = Role::firstOrCreate(['name' => 'Requestor']);

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Assign ke role tertentu
        $superAdmin->givePermissionTo($permissions);

        // Approver & Requestor hanya bisa "view reservations"
        $viewerPermission = ['view reservations'];
        $createdPermission = ['create reservations'];
        $updatedPermission = ['edit reservations'];

        $approver->givePermissionTo($viewerPermission, $updatedPermission);
        $requestor->givePermissionTo($viewerPermission, $createdPermission);
    }
}
