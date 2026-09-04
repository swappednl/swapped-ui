<?php

declare(strict_types=1);

namespace Swapped\Ui;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;

final class UiServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'swapped-ui');

        // <x-swapped::icon name="…"/> — de apps mogen er hun eigen <x-icon> omheen houden.
        Blade::anonymousComponentPath(__DIR__.'/../resources/views/components', 'swapped');
    }
}
