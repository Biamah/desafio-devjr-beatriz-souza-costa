<?php

namespace Tests\Unit;

use App\Http\Middleware\EnsureEmailIsVerified;
use App\Models\User;
use Illuminate\Auth\Middleware\EnsureEmailIsVerified as BaseEnsureEmailIsVerified;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class EnsureEmailIsVerifiedTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_allows_verified_users_to_proceed()
    {
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $request = Request::create('/test-route', 'GET');
        $request->setUserResolver(fn() => $user);

        $middleware = new EnsureEmailIsVerified();
        $response = $middleware->handle($request, fn($req) => response('OK'));

        $this->assertEquals('OK', $response->getContent());
    }

    #[Test]
    public function it_allows_non_must_verify_email_users_to_proceed()
    {
        // Criamos um mock de usuário que não implementa MustVerifyEmail
        $user = new class {
            public function hasVerifiedEmail()
            {
                return false;
            }
        };

        $request = Request::create('/test-route', 'GET');
        $request->setUserResolver(fn() => $user);

        $middleware = new EnsureEmailIsVerified();
        $response = $middleware->handle($request, fn($req) => response('OK'));

        $this->assertEquals('OK', $response->getContent());
    }

    #[Test]
    public function it_blocks_guest_users()
    {
        $request = Request::create('/test-route', 'GET');
        $request->setUserResolver(fn() => null);

        $middleware = new EnsureEmailIsVerified();
        $response = $middleware->handle($request, fn($req) => response('OK'));

        $this->assertEquals(401, $response->getStatusCode());
        $this->assertEquals(
            'Unauthenticated.',
            json_decode($response->getContent())->message
        );
    }
}
