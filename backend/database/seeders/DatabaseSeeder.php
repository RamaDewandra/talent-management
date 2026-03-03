<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\PerformanceIndicator;
use App\Models\PotentialIndicator;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create Roles
        $hrRole = Role::create(['name' => 'HR']);
        $managerRole = Role::create(['name' => 'Manager']);
        $employeeRole = Role::create(['name' => 'Employee']);

        // Create Departments
        $itDept = Department::create(['name' => 'Information Technology']);
        $hrDept = Department::create(['name' => 'Human Resources']);
        $financeDept = Department::create(['name' => 'Finance']);
        $marketingDept = Department::create(['name' => 'Marketing']);

        // Create Sample Users
        User::create([
            'name' => 'HR Admin',
            'email' => 'hr@example.com',
            'password' => Hash::make('password'),
            'role_id' => $hrRole->id,
            'department_id' => $hrDept->id,
        ]);

        User::create([
            'name' => 'IT Manager',
            'email' => 'manager@example.com',
            'password' => Hash::make('password'),
            'role_id' => $managerRole->id,
            'department_id' => $itDept->id,
        ]);

        User::create([
            'name' => 'John Employee',
            'email' => 'employee@example.com',
            'password' => Hash::make('password'),
            'role_id' => $employeeRole->id,
            'department_id' => $itDept->id,
        ]);

        User::create([
            'name' => 'Jane Developer',
            'email' => 'jane@example.com',
            'password' => Hash::make('password'),
            'role_id' => $employeeRole->id,
            'department_id' => $itDept->id,
        ]);

        // Create Performance Indicators
        PerformanceIndicator::create([
            'name' => 'Quality of Work',
            'category' => 'Work Output',
            'weight' => 1.5,
            'is_active' => true,
        ]);

        PerformanceIndicator::create([
            'name' => 'Productivity',
            'category' => 'Work Output',
            'weight' => 1.5,
            'is_active' => true,
        ]);

        PerformanceIndicator::create([
            'name' => 'Communication Skills',
            'category' => 'Soft Skills',
            'weight' => 1.0,
            'is_active' => true,
        ]);

        PerformanceIndicator::create([
            'name' => 'Teamwork',
            'category' => 'Soft Skills',
            'weight' => 1.0,
            'is_active' => true,
        ]);

        PerformanceIndicator::create([
            'name' => 'Technical Skills',
            'category' => 'Hard Skills',
            'weight' => 1.0,
            'is_active' => true,
        ]);

        // Create Potential Indicators
        PotentialIndicator::create([
            'name' => 'Leadership Capability',
            'weight' => 1.5,
            'is_active' => true,
        ]);

        PotentialIndicator::create([
            'name' => 'Learning Agility',
            'weight' => 1.5,
            'is_active' => true,
        ]);

        PotentialIndicator::create([
            'name' => 'Adaptability',
            'weight' => 1.0,
            'is_active' => true,
        ]);

        PotentialIndicator::create([
            'name' => 'Innovation',
            'weight' => 1.0,
            'is_active' => true,
        ]);
    }
}
