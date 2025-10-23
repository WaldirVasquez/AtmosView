document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('theme-toggle');
    const body = document.body;
    const menu = document.getElementById('nav-menu');
    const burger = document.getElementById('menu-toggle');
    const loader = document.getElementById('loader');

    /* === EFECTO DE HEADER AL HACER SCROLL === */
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});


    /* === TEMA CLARO / OSCURO === */
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.replace('light-mode', 'dark-mode');
        toggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }

    toggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        body.classList.toggle('light-mode');
        const isDark = body.classList.contains('dark-mode');
        toggle.innerHTML = isDark
            ? '<i class="fa-solid fa-moon"></i>'
            : '<i class="fa-solid fa-sun"></i>';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    /* === MENÚ HAMBURGUESA === */
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        menu.classList.toggle('open');
        body.classList.toggle('menu-open');
    });

    /* === LOADER GLOBAL (4s exactos) === */
    if (loader) {
        loader.style.opacity = '1';
        loader.style.display = 'flex';

        // Espera 4 segundos y lo desvanece
        setTimeout(() => {
            loader.style.transition = 'opacity 0.8s ease';
            loader.style.opacity = '0';

            // 0.9s después lo oculta completamente
            setTimeout(() => {
                loader.style.display = 'none';
            }, 900);
        }, 3000);
    }
});
