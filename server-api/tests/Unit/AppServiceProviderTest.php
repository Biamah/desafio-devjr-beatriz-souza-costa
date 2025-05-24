<?php

namespace Tests\Unit;

use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class AppServiceProviderTest extends TestCase
{
    public function it_sets_default_string_length_in_boot_method()
    {
        $provider = new \App\Providers\AppServiceProvider($this->app);
        $provider->boot();

        $this->assertEquals(191, Schema::getDefaultStringLength());
    }
}
