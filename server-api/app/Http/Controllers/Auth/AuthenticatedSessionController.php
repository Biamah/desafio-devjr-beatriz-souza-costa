<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): Response
    {
        $request->authenticate();

        $request->session()->regenerate();

        return response()->noContent();
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): Response
    {
        $handler = $request->session()->getHandler();
        $sessionId = $request->session()->getId();

        Auth::guard('web')->logout();

        // Destruição explícita da sessão
        $handler->destroy($sessionId);

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->noContent();
    }
}
