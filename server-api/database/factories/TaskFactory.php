<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    public function definition()
    {
        return [
            'title' => $this->faker->sentence,
            'description' => $this->faker->paragraph,
            'end_date' => $this->faker->dateTimeBetween('now', '+1 year'),
            'completed' => $this->faker->boolean,
        ];
    }
}