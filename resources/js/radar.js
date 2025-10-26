// radar.js
window.changeLayer = function (layer, btn) {
  const iframe = document.getElementById('windyFrame');
  const zoom = 8;

  function setMap(lat, lon) {
    const url = `https://embed.windy.com/embed.html?type=map&location=coordinates&zoom=${zoom}&overlay=${layer}&product=ecmwf&level=surface&lat=${lat}&lon=${lon}`;
    iframe.src = url;
  }

  // Detectar ubicación real del usuario (en tu dominio, no dentro del iframe)
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        console.log(`📍 Ubicación detectada: ${latitude}, ${longitude}`);
        setMap(latitude, longitude);
      },
      err => {
        console.warn("No se pudo obtener ubicación, usando vista por defecto:", err.message);
        setMap(13.69, -89.19); // fallback: San Salvador
      }
    );
  } else {
    console.warn("Geolocalización no soportada");
    setMap(13.69, -89.19);
  }

  // Marcar botón activo
  document.querySelectorAll('.radar-controls button').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
};

// Ejecutar la detección automática al cargar la página (por defecto capa radar)
document.addEventListener("DOMContentLoaded", () => {
  changeLayer('radar', document.querySelector('button.active'));
});
