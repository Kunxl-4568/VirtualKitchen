<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('recipes', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->integer('prep_time')->comment('minutes');
            $table->integer('cook_time')->comment('minutes');
            $table->integer('servings');
            $table->enum('difficulty', ['easy', 'medium', 'hard']);
            $table->string('image')->nullable();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('cuisine_id')->constrained();
            $table->foreignId('category_id')->constrained();
            $table->boolean('is_published')->default(false);
            $table->integer('views_count')->default(0);
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['is_published', 'difficulty']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('recipes');
    }
};