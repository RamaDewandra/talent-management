<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assessments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('manager_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('assessment_period_id')->constrained('assessment_periods')->onDelete('cascade');
            $table->enum('status', ['draft', 'submitted'])->default('draft');
            $table->decimal('performance_score', 5, 2)->nullable();
            $table->decimal('potential_score', 5, 2)->nullable();
            $table->string('talent_category')->nullable();
            $table->timestamps();

            $table->unique(['employee_id', 'assessment_period_id']);
            $table->index('manager_id');
            $table->index('status');
            $table->index('talent_category');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assessments');
    }
};
