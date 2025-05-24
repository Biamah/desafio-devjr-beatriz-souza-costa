<?php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\Notification;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class EmailVerificationNotificationControllerTest extends TestCase
{
    use \Illuminate\Foundation\Testing\RefreshDatabase;

    #[Test]
    public function it_sends_verification_email_to_unverified_user()
    {
        Notification::fake();
        $user = User::factory()->create(['email_verified_at' => null]);

        $response = $this->actingAs($user)
            ->postJson('/email/verification-notification');

        $response->assertStatus(200)
            ->assertJson(['status' => 'verification-link-sent']);

        Notification::assertSentTo(
            $user,
            VerifyEmail::class
        );
    }

    #[Test]
    public function it_does_not_send_verification_to_already_verified_user()
    {
        Notification::fake();
        $user = User::factory()->create(['email_verified_at' => now()]);

        $response = $this->actingAs($user)
            ->postJson('/email/verification-notification');

        $response->assertRedirect('/dashboard');
        Notification::assertNotSentTo($user, VerifyEmail::class);
    }

    #[Test]
    public function it_requires_authentication()
    {
        $response = $this->postJson('/email/verification-notification');

        $response->assertStatus(401);
    }
}
