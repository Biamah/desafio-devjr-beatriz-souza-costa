<?php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\URL;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;;

class VerifyEmailControllerTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_verifies_a_user_email()
    {
        Event::fake();

        $user = User::factory()->create([
            'email_verified_at' => null,
        ]);
        $user = User::find($user->id);

        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            [
                'id' => $user->id,
                'hash' => sha1($user->email),
            ]
        );

        $this->actingAs($user);

        $response = $this->get($verificationUrl);

        $response->assertRedirect(config('app.frontend_url') . '/dashboard?verified=1');

        $freshUser = $user->fresh();
        $this->assertNotNull($freshUser->email_verified_at);

        Event::assertDispatched(Verified::class, function ($e) use ($user) {
            return $e->user->id === $user->id;
        });
    }
}
