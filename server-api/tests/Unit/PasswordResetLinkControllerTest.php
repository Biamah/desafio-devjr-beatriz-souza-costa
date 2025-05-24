<?php

namespace Tests\Unit;

use Illuminate\Support\Facades\Password;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use PHPUnit\Framework\Attributes\Test;

class PasswordResetLinkControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->artisan('migrate');

        Notification::fake();
    }

    #[Test]
    public function it_sends_password_reset_link_to_valid_email()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password')
        ]);

        $response = $this->postJson('/forgot-password', [
            'email' => 'test@example.com',
        ]);

        $response->assertOk()
            ->assertJson(['status' => trans(Password::RESET_LINK_SENT)]);

        Notification::assertSentTo(
            $user,
            ResetPassword::class,
            function ($notification, $channels) {
                return in_array('mail', $channels);
            }
        );
    }

    #[Test]
    public function it_requires_valid_email()
    {
        $response = $this->postJson('/forgot-password', [
            'email' => 'not-an-email',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    #[Test]
    public function it_returns_error_for_non_existent_email()
    {
        $response = $this->postJson('/forgot-password', [
            'email' => 'nonexistent@example.com',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    #[Test]
    public function it_handles_failed_password_reset_attempts()
    {
        Password::shouldReceive('sendResetLink')
            ->once()
            ->andReturn(Password::INVALID_USER);

        $response = $this->postJson('/forgot-password', [
            'email' => 'user@example.com',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    #[Test]
    public function it_handles_throttled_reset_attempts()
    {
        Password::shouldReceive('sendResetLink')
            ->once()
            ->andReturn(Password::RESET_THROTTLED);

        $response = $this->postJson('/forgot-password', [
            'email' => 'user@example.com',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'message' => trans(Password::RESET_THROTTLED),
                'errors' => [
                    'email' => [trans(Password::RESET_THROTTLED)]
                ]
            ]);
    }
}
