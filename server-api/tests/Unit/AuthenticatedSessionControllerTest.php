<?php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AuthenticatedSessionControllerTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_authenticates_user_with_valid_credentials()
    {
        $user = User::factory()->create([
            'password' => bcrypt('password123')
        ]);

        $response = $this->postJson('/login', [
            'email' => $user->email,
            'password' => 'password123'
        ]);

        $response->assertStatus(204);
        $this->assertAuthenticatedAs($user);
    }

    #[Test]
    public function it_rejects_invalid_credentials()
    {
        $user = User::factory()->create([
            'password' => bcrypt('password123')
        ]);

        $response = $this->postJson('/login', [
            'email' => $user->email,
            'password' => 'wrong-password'
        ]);

        $response->assertStatus(422);
        $this->assertGuest();
    }

    #[Test]
    public function it_logs_out_authenticated_user()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->postJson('/logout');

        $response->assertStatus(204);
        $this->assertGuest();
    }

    #[Test]
    public function it_invalidates_session_on_logout()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $sessionId = Session::getId();

        $this->postJson('/logout');

        $sessionContent = Session::getHandler()->read($sessionId);
        $this->assertTrue($sessionContent === false || $sessionContent === '', 'A sessão não foi completamente invalidada');
    }

    #[Test]
    public function test_it_invalidates_session_on_logout()
    {
        $sessionId = Session::getId();
        $this->postJson('/logout');

        // Verifica se a sessão foi realmente removida
        $this->assertEmpty(Session::getHandler()->read($sessionId));
    }
}
