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
            'name' => 'Standar Kerja (Work Standard)',
            'weight' => 0.25,
            'is_active' => true,
        ]);

        PotentialIndicator::create([
            'name' => 'Orientasi Pelanggan (Customer Orientation)',
            'weight' => 0.25,
            'is_active' => true,
        ]);

        PotentialIndicator::create([
            'name' => 'Perencanaan dan Pengorganisasian (Planning & Organizing)',
            'weight' => 0.25,
            'is_active' => true,
        ]);

        PotentialIndicator::create([
            'name' => 'Komunikasi (Communication)',
            'weight' => 0.25,
            'is_active' => true,
        ]);

        PotentialIndicator::create([
            'name' => 'Orientasi Pembelajaran (Learning Orientation)',
            'weight' => 0.25,
            'is_active' => true,
        ]);

        PotentialIndicator::create([
            'name' => 'Membangun Hubungan Kerja yang Positif (Building Positive Working Relationship)',
            'weight' => 0.25,
            'is_active' => true,
        ]);

        PotentialIndicator::create([
            'name' => 'Kepemimpinan (Leadership)',
            'weight' => 0.25,
            'is_active' => true,
        ]);

        PotentialIndicator::create([
            'name' => 'Pengambilan Keputusan (Decision Making)',
            'weight' => 0.25,
            'is_active' => true,
        ]);

        PotentialIndicator::create([
            'name' => 'Melatih dan Mengembangkan Orang Lain (Coaching and Developing Others)',
            'weight' => 0.25,
            'is_active' => true,
        ]);

        PotentialIndicator::create([
            'name' => 'Mendapatkan Komitmen (Gaining Commitment)',
            'weight' => 0.25,
            'is_active' => true,
        ]);

        PotentialIndicator::create([
            'name' => 'Mendelegasikan Tanggung Jawab (Delegating Responsibility)',
            'weight' => 0.25,
            'is_active' => true,
        ]);

        PotentialIndicator::create([
            'name' => 'Kecakapan Bisnis (Business Acumen)',
            'weight' => 0.25,
            'is_active' => true,
        ]);

        PotentialIndicator::create([
            'name' => 'Gairah untuk Hasil (Passion for Results)',
            'weight' => 0.25,
            'is_active' => true,
        ]);

        PotentialIndicator::create([
            'name' => 'Menetapkan Arah Strategis (Establishing Strategic Direction)',
            'weight' => 0.25,
            'is_active' => true,
        ]);

        PotentialIndicator::create([
            'name' => 'Menggerakkan Pelaksanaan (Driving Execution )',
            'weight' => 0.25,
            'is_active' => true,
        ]);

        PotentialIndicator::create([
            'name' => 'Kewirausahaan (Entrepreneurship)',
            'weight' => 0.25,
            'is_active' => true,
        ]);

        PotentialIndicator::create([
            'name' => 'Memimpin Perubahan (Leading Change)',
            'weight' => 0.25,
            'is_active' => true,
        ]);

        PotentialIndicator::create([
            'name' => 'Menjual Visi (Selling the Vision)',
            'weight' => 0.25,
            'is_active' => true,
        ]);

        PotentialIndicator::create([
            'name' => 'Mengembangkan Hubungan Strategis (Developing Strategic Relationship )',
            'weight' => 0.25,
            'is_active' => true,
        ]);

        PotentialIndicator::create([
            'name' => 'Membangun Kepercayaan (Building Trust)',
            'weight' => 0.25,
            'is_active' => true,
        ]);
    }
}
