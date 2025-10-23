@extends('layouts.app')
@push('styles')
@vite('resources/css/home.css', )
@endpush

@section('title', 'Inicio | AtmosView')

@section('content')
<section class="home">
    <h1>Bienvenido a <strong>AtmosView</strong></h1>
    <p>Observa el clima desde una nueva perspectiva.</p>

    <div class="contenedor-clima">
        <h2>Clima actual</h2>
        <p>Próximamente se mostrará la información meteorológica en tiempo real.</p>
    </div>
</section>
@endsection
