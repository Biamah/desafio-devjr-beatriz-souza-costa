<?php

namespace Tests\Unit;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class TaskTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_belongs_to_a_user()
    {
        $user = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $task->user);
        $this->assertEquals($user->id, $task->user->id);
    }

    #[Test]
    public function it_can_be_completed()
    {
        $user = \App\Models\User::factory()->create();

        $task = Task::factory()->create([
            'user_id' => $user->id,
            'completed' => false
        ]);

        $task->markAsCompleted();

        $this->assertTrue($task->fresh()->completed);
    }

    #[Test]
    public function it_can_be_incompleted()
    {
        $user = \App\Models\User::factory()->create();

        $task = Task::factory()->create([
            'user_id' => $user->id,
            'completed' => true
        ]);

        $task->markAsIncompleted();

        $this->assertFalse($task->fresh()->completed);
    }

    #[Test]
    public function it_can_be_marked_as_incompleted()
    {
        $user = \App\Models\User::factory()->create();

        $task = Task::factory()->create([
            'user_id' => $user->id,
            'completed' => true
        ]);

        $task->markAsIncompleted();

        $this->assertFalse($task->fresh()->completed);
    }

    #[Test]
    public function it_casts_end_date_and_completed_correctly()
    {
        $user = \App\Models\User::factory()->create();

        $task = Task::factory()->create([
            'user_id' => $user->id,
            'end_date' => '2025-12-31',
            'completed' => 1,
        ]);

        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $task->end_date);
        $this->assertTrue($task->completed);
    }

    #[Test]
    public function it_allows_mass_assignment_of_fillable_attributes()
    {
        $user = User::factory()->create();

        $data = [
            'title' => 'Test Task',
            'description' => 'This is a test task.',
            'end_date' => '2025-12-31',
            'completed' => false,
            'user_id' => $user->id,
        ];

        $task = Task::create($data);

        $this->assertEquals('Test Task', $task->title);
        $this->assertEquals('This is a test task.', $task->description);
        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $task->end_date);
        $this->assertFalse($task->completed);
        $this->assertEquals($user->id, $task->user_id);
    }
}
