<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="{{ asset('images/LOGO2.png') }}">
    <title>@yield('title', 'AtmosView')</title>
    @vite(['resources/css/styles.css', 'resources/js/theme.js'])
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    @stack('styles')

</head>
<body class="dark-mode">


     <!-- === LOADER ANIMATION GLOBAL === -->
    <div id="loader">
        <div class="loader"></div>
    </div>

    @include('layouts.header')

    <main class="main-content">
        @yield('content')
    </main>

    @include('layouts.footer')

    
    @stack('scripts')
    


</body>
</html>
