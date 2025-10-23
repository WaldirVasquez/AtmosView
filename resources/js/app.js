// ======= NAVBAR BURGER EFFECT =======
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav-menu');

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        nav.classList.toggle('active');
    });
});

// ======= LOADER Animacion =======
document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('fade-out');
    setTimeout(() => loader.style.display = 'none', 1000);
  }, 3000); // 3 segundos
});
