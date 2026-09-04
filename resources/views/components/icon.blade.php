@props(['name', 'class' => 'h-4.5 w-4.5'])
{{-- Lijnicoon uit de Swapped-set (zie Swapped\Ui\Icons); stroke-width 1.6 is de huisstijl. --}}
<svg {{ $attributes->merge(['class' => $class]) }} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" d="{{ \Swapped\Ui\Icons::path($name) }}"/>
</svg>
