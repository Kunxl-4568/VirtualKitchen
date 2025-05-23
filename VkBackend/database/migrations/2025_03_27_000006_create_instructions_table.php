<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('instructions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recipe_id')->constrained()->cascadeOnDelete();
            $table->integer('step_number');
            $table->text('description');
            $table->timestamps();
            
            $table->unique(['recipe_id', 'step_number']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('instructions');
    }
};