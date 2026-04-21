<?php

use App\Http\Controllers\Api\AlertController;
use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\AssessmentController;
use App\Http\Controllers\Api\AssessmentPeriodController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\PerformanceIndicatorController;
use App\Http\Controllers\Api\PotentialIndicatorController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\UserManagementController;
use Illuminate\Support\Facades\Route;

// Public: Login
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    // ── Auth ──────────────────────────────────────────────────
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    // ── Alerts (All authenticated) ────────────────────────────
    Route::get('/alerts', [AlertController::class, 'index']);

    // ── Users & Departments ───────────────────────────────────
    Route::get('/employees',   [UserController::class, 'employees']);
    Route::get('/departments', [UserController::class, 'departments']);

    // ── Assessment Periods ────────────────────────────────────
    Route::get('/periods',          [AssessmentPeriodController::class, 'index']);
    Route::get('/periods/{period}', [AssessmentPeriodController::class, 'show']);

    // ── Indicators (read) ─────────────────────────────────────
    Route::get('/performance-indicators', [PerformanceIndicatorController::class, 'index']);
    Route::get('/potential-indicators',   [PotentialIndicatorController::class, 'index']);

    // ── Dashboard ─────────────────────────────────────────────
    Route::get('/dashboard/summary', [DashboardController::class, 'summary']);
    Route::get('/dashboard/9box',    [DashboardController::class, 'nineBox']);

    // ── Analytics ─────────────────────────────────────────────
    Route::get('/analytics/trends',                [AnalyticsController::class, 'trends']);
    Route::get('/analytics/department-summary',    [AnalyticsController::class, 'departmentSummary']);
    Route::get('/analytics/category-distribution', [AnalyticsController::class, 'categoryDistribution']);

    // ── Employee Profiles ─────────────────────────────────────
    Route::get('/employees/all',          [EmployeeController::class, 'index']);
    Route::get('/employees/{id}/profile', [EmployeeController::class, 'show']);

    // ── Assessments (HR & Manager) ────────────────────────────
    Route::middleware('role:HR,Manager')->group(function () {
        Route::get('/assessments',                   [AssessmentController::class, 'index']);
        Route::post('/assessments',                  [AssessmentController::class, 'store']);
        Route::get('/assessments/{assessment}',      [AssessmentController::class, 'show']);
        Route::put('/assessments/{assessment}',      [AssessmentController::class, 'update']);
        Route::post('/assessments/{assessment}/submit', [AssessmentController::class, 'submit']);
    });

    // ── HR-only routes ────────────────────────────────────────
    Route::middleware('role:HR')->group(function () {
        // Period management
        Route::post('/periods',                      [AssessmentPeriodController::class, 'store']);
        Route::put('/periods/{period}',              [AssessmentPeriodController::class, 'update']);
        Route::post('/periods/{period}/activate',    [AssessmentPeriodController::class, 'activate']);
        Route::post('/periods/{period}/close',       [AssessmentPeriodController::class, 'close']);

        // Indicator management
        Route::post('/performance-indicators',                         [PerformanceIndicatorController::class, 'store']);
        Route::put('/performance-indicators/{performanceIndicator}',   [PerformanceIndicatorController::class, 'update']);
        Route::delete('/performance-indicators/{performanceIndicator}',[PerformanceIndicatorController::class, 'destroy']);

        Route::post('/potential-indicators',                       [PotentialIndicatorController::class, 'store']);
        Route::put('/potential-indicators/{potentialIndicator}',   [PotentialIndicatorController::class, 'update']);
        Route::delete('/potential-indicators/{potentialIndicator}',[PotentialIndicatorController::class, 'destroy']);

        // User Management CRUD
        Route::get('/manage/users',              [UserManagementController::class, 'index']);
        Route::post('/manage/users',             [UserManagementController::class, 'store']);
        Route::put('/manage/users/{id}',         [UserManagementController::class, 'update']);
        Route::delete('/manage/users/{id}',      [UserManagementController::class, 'destroy']);
        Route::get('/manage/roles',              [UserManagementController::class, 'roles']);
        Route::get('/manage/departments-list',   [UserManagementController::class, 'departments']);
    });
});
