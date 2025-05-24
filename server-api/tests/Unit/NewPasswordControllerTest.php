<?php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class NewPasswordControllerTest extends TestCase
{
    use \Illuminate\Foundation\Testing\RefreshDatabase;

    #[Test]
    public function it_resets_password_successfully()
    {
        Event::fake();
        $user = User::factory()->create();
        $token = Password::createToken($user);
        $newPassword = 'new-secret-password';

        $response = $this->postJson('/reset-password', [
            'token' => $token,
            'email' => $user->email,
            'password' => $newPassword,
            'password_confirmation' => $newPassword,
        ]);

        $response->assertStatus(200)
            ->assertJson(['status' => trans(Password::PASSWORD_RESET)]);

        $this->assertTrue(Hash::check($newPassword, $user->fresh()->password));
        Event::assertDispatched(PasswordReset::class);
    }

    #[Test]
    public function it_requires_valid_token()
    {
        $user = User::factory()->create();
        $invalidToken = 'invalid-token';

        $response = $this->postJson('/reset-password', [
            'token' => $invalidToken,
            'email' => $user->email,
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    #[Test]
    public function it_requires_valid_email()
    {
        $response = $this->postJson('/reset-password', [
            'token' => 'any-token',
            'email' => 'not-an-email',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    #[Test]
    public function it_requires_password_confirmation()
    {
        $user = User::factory()->create();
        $token = Password::createToken($user);

        $response = $this->postJson('/reset-password', [
            'token' => $token,
            'email' => $user->email,
            'password' => 'new-password',
            'password_confirmation' => 'different-password',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    #[Test]
    public function it_requires_strong_password()
    {
        $user = User::factory()->create();
        $token = Password::createToken($user);

        $response = $this->postJson('/reset-password', [
            'token' => $token,
            'email' => $user->email,
            'password' => '123',
            'password_confirmation' => '123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    #[Test]
    public function it_handles_expired_tokens()
    {
        $user = User::factory()->create();
        $token = Password::createToken($user);

        // Simula token expirado
        Password::shouldReceive('reset')
            ->once()
            ->andReturn(Password::INVALID_TOKEN);

        $response = $this->postJson('/reset-password', [
            'token' => $token,
            'email' => $user->email,
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }
}
