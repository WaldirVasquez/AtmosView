<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'AtmosView')</title>
    @vite(['resources/css/styles.css', 'resources/js/app.js'])

    @stack('styles')
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

</head>

<body>

    <!-- Loader Animation -->
    <div id="loader">
        <div class="loader"></div>
    </div>



    <header class="navbar">
        <div class="nav-container">
            <h1 class="logo">AtmosView</h1>

            <div class="menu-toggle" id="menu-toggle">
                <span></span>
                <span></span>
                <span></span>
            </div>

            <nav id="nav-menu">
                <a href="{{ route('home') }}">Inicio</a>
                <a href="{{ route('radar') }}">Radar</a>
                <a href="{{ route('noticias') }}">Noticias</a>
                <a href="{{ route('espacio') }}">Espacio</a>
                <a href="{{ route('registro') }}">Registro</a>
            </nav>
        </div>
    </header>


    <main>
        @yield('content')
    </main>

    <footer>
        <p class="footer-year">© 2025 AtmosView</p>
        <div class="footer-divider"></div>
        <p class="footer-author">Desarrollado por Waldir Vásquez</p>

        <div class="social-icons">
            <a href="https://instagram.com/" class="instagram" target="_blank">
                <i class="fab fa-instagram"></i>
            </a>
            <a href="https://www.facebook.com/share/1Sktope52N/" class="facebook" target="_blank">
                <i class="fab fa-facebook"></i>
            </a>
            <a href="https://github.com/WaldirVasquez" class="github" target="_blank">
                <i class="fab fa-github"></i>
            </a>
        </div>
    </footer>

</body>

</html>