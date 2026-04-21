<?php

use App\Http\Controllers\Api\AssessmentController;
use App\Http\Controllers\Api\AssessmentPeriodController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\PerformanceIndicatorController;
use App\Http\Controllers\Api\PotentialIndicatorController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// Auth routes
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Users & Departments
    Route::get('/employees', [UserController::class, 'employees']);
    Route::get('/departments', [UserController::class, 'departments']);

    // Assessment Periods
    Route::get('/periods', [AssessmentPeriodController::class, 'index']);
    Route::get('/periods/{period}', [AssessmentPeriodController::class, 'show']);
    
    // HR-only period management
    Route::middleware('role:HR')->group(function () {
        Route::post('/periods', [AssessmentPeriodController::class, 'store']);
        Route::put('/periods/{period}', [AssessmentPeriodController::class, 'update']);
        Route::post('/periods/{period}/activate', [AssessmentPeriodController::class, 'activate']);
        Route::post('/periods/{period}/close', [AssessmentPeriodController::class, 'close']);
    });

    // Indicators
    Route::get('/performance-indicators', [PerformanceIndicatorController::class, 'index']);
    Route::get('/potential-indicators', [PotentialIndicatorController::class, 'index']);
    
    // HR-only indicator management
    Route::middleware('role:HR')->group(function () {
        Route::post('/performance-indicators', [PerformanceIndicatorController::class, 'store']);
        Route::put('/performance-indicators/{performanceIndicator}', [PerformanceIndicatorController::class, 'update']);
        Route::delete('/performance-indicators/{performanceIndicator}', [PerformanceIndicatorController::class, 'destroy']);
        
        Route::post('/potential-indicators', [PotentialIndicatorController::class, 'store']);
        Route::put('/potential-indicators/{potentialIndicator}', [PotentialIndicatorController::class, 'update']);
        Route::delete('/potential-indicators/{potentialIndicator}', [PotentialIndicatorController::class, 'destroy']);
    });

    // Assessments (HR and Managers)
    Route::middleware('role:HR,Manager')->group(function () {
        Route::get('/assessments', [AssessmentController::class, 'index']);
        Route::post('/assessments', [AssessmentController::class, 'store']);
        Route::get('/assessments/{assessment}', [AssessmentController::class, 'show']);
        Route::put('/assessments/{assessment}', [AssessmentController::class, 'update']);
        Route::post('/assessments/{assessment}/submit', [AssessmentController::class, 'submit']);
    });

    // Dashboard
    Route::get('/dashboard/summary', [DashboardController::class, 'summary']);
    Route::get('/dashboard/9box', [DashboardController::class, 'nineBox']);
});
