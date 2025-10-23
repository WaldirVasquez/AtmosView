<header class="navbar">
    <div class="nav-container">
        <a href="{{ route('home') }}" class="logo-link">
            <img src="{{ asset('images/LOGO.png') }}" alt="Logo" class="logo">
        </a>


        <nav class="nav-menu" id="nav-menu">
            <a href="{{ route('home') }}"><i class="fa-solid fa-house"></i> Inicio</a>
            <a href="#"><i class="fa-solid fa-satellite-dish"></i> Radar</a>
            <a href="#"><i class="fa-solid fa-globe"></i> Espacio</a>
            <a href="#"><i class="fa-solid fa-newspaper"></i> Noticias</a>
            <a href="#"><i class="fa-solid fa-bell"></i> Notificaciones</a>
        </nav>

        <div class="icons">
            <button id="theme-toggle"><i class="fa-solid fa-sun"></i></button>
            <div id="menu-toggle" class="menu-toggle">
                <span></span><span></span><span></span>
            </div>
        </div>
    </div>
</header>