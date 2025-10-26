@extends('layouts.app')

@section('title', 'Radar Meteorológico')

@push('styles')
    @vite('resources/css/radar.css')
@endpush


@section('content')
<main class="radar-main">
    <div class="radar-header">
        <h2>🌎 Radar Meteorológico - El Salvador</h2>
        <p>Mapa interactivo cortesía de <strong>Windy.com</strong></p>
    </div>

    <div class="radar-controls">
        <button class="active" onclick="changeLayer('radar', this)">Radar</button>
        <button onclick="changeLayer('satellite', this)">Satelite</button>
        <button onclick="changeLayer('rain', this)">Lluvias, Truenos</button>
        <button onclick="changeLayer('wind', this)">💨 Viento</button>
        <button onclick="changeLayer('clouds', this)">☁️ Nubes</button>
        <button onclick="changeLayer('temp', this)">🌡️ Temperatura</button>
        <button onclick="changeLayer('waves', this)">🌊 Olas</button>
    </div>

    <div class="radar-map">
        <iframe 
            id="windyFrame"
            src="https://embed.windy.com/embed.html?type=map&zoom=8&overlay=radar&product=ecmwf&level=surface&lat=13.69&lon=-89.19"
            frameborder="0"
            allow="geolocation"
            allowfullscreen>
        </iframe>
    </div>
</main>

@endsection


    @push('scripts')
        @vite('resources/js/radar.js')

    @endpush

