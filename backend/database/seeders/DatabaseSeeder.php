<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\PerformanceIndicator;
use App\Models\PotentialIndicator;
use App\Models\Role;
use App\Models\User;
use App\Models\AssessmentPeriod;
use App\Models\Assessment;
use App\Models\AssessmentScore;
use App\Services\AssessmentScoringService;
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

        // ==========================================
        // TAMBAHAN DATA DUMMY
        // ==========================================

        // 1. Create Assessment Periods
        $period1 = AssessmentPeriod::create([
            'name' => 'Q3 2025 (Period Lalu)',
            'start_date' => now()->subMonths(6),
            'end_date' => now()->subMonths(3),
            'status' => 'closed',
        ]);

        $period2 = AssessmentPeriod::create([
            'name' => 'Q4 2025 (Aktif)',
            'start_date' => now()->subMonths(1),
            'end_date' => now()->addMonths(2),
            'status' => 'active',
        ]);

        // 2. Create More Users
        $employees = [];
        $departments = [$itDept, $hrDept, $financeDept, $marketingDept];
        for ($i = 1; $i <= 30; $i++) {
            $employees[] = User::create([
                'name' => "Karyawan Dummy $i",
                'email' => "dummy{$i}@example.com",
                'password' => Hash::make('password'),
                'role_id' => $employeeRole->id,
                'department_id' => $departments[array_rand($departments)]->id,
            ]);
        }
        
        // Add original employees to the list
        $employees[] = User::where('email', 'employee@example.com')->first();
        $employees[] = User::where('email', 'jane@example.com')->first();

        // Setup Scoring Service
        $scoringService = app(AssessmentScoringService::class);
        $manager = User::where('email', 'manager@example.com')->first(); // Manager gives assessment
        
        $perfIndicators = PerformanceIndicator::all();
        $potIndicators = PotentialIndicator::all();

        // 3. Create Assessments for Period 1 (All Submitted) 
        // to populate the 9 Box and dashboard
        foreach ($employees as $emp) {
            $assessment = Assessment::create([
                'employee_id' => $emp->id,
                'manager_id' => $manager->id,
                'assessment_period_id' => $period1->id,
                'status' => 'draft',
            ]);

            foreach ($perfIndicators as $pi) {
                AssessmentScore::create([
                    'assessment_id' => $assessment->id,
                    'indicator_type' => 'performance',
                    'indicator_id' => $pi->id,
                    'score' => rand(2, 5), // Score 2 to 5 to scatter them across the 9 boxes
                ]);
            }
            foreach ($potIndicators as $pi) {
                AssessmentScore::create([
                    'assessment_id' => $assessment->id,
                    'indicator_type' => 'potential',
                    'indicator_id' => $pi->id,
                    'score' => rand(2, 5),
                ]);
            }

            // Let the Scoring Service calculate avg & talent category, then submit!
            $scoringService->calculateAndSubmit($assessment);
        }

        // 4. Create Assessments for Period 2 (Half draft, Half submitted)
        // Only for a slice of employees to simulate ongoing process
        foreach (array_slice($employees, 0, 15) as $emp) {
            $assessment = Assessment::create([
                'employee_id' => $emp->id,
                'manager_id' => $manager->id,
                'assessment_period_id' => $period2->id,
                'status' => 'draft',
            ]);

            foreach ($perfIndicators as $pi) {
                AssessmentScore::create([
                    'assessment_id' => $assessment->id,
                    'indicator_type' => 'performance',
                    'indicator_id' => $pi->id,
                    'score' => rand(3, 5), 
                ]);
            }
            foreach ($potIndicators as $pi) {
                AssessmentScore::create([
                    'assessment_id' => $assessment->id,
                    'indicator_type' => 'potential',
                    'indicator_id' => $pi->id,
                    'score' => rand(1, 4),
                ]);
            }
            
            if (rand(0, 1) === 1) { // 50% chance submitted
                $scoringService->calculateAndSubmit($assessment);
            }
        }
    }
}
