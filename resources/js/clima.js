document.addEventListener("DOMContentLoaded", () => {
    const iconMap = {
        clearsky_day: "☀️",
        clearsky_night: "🌙",
        fair_day: "🌤️",
        fair_night: "🌤️",
        partlycloudy_day: "⛅",
        partlycloudy_night: "☁️",
        cloudy: "☁️",
        rainshowers_day: "🌦️",
        rainshowers_night: "🌦️",
        rain: "🌧️",
        heavyrain: "⛈️",
        heavyrainshowers_day: "⛈️",
        thunderstorm: "⚡",
        fog: "🌫️",
        sleet: "🌨️",
        snow: "❄️",
    };

    function normalizeSymbol(symbol) {
    if (!symbol) return "cloudy";
    // Eliminar sufijos no esperados (por ejemplo, "_polartwilight")
    symbol = symbol.replace("_polartwilight", "");

    // Si el símbolo tiene combinaciones (como "rainshowersandthunder_day")
    if (symbol.includes("andthunder")) return "thunderstorm";
    if (symbol.includes("heavyrainshowers")) return "heavyrain";
    if (symbol.includes("rainshowers")) return "rainshowers_day";
    if (symbol.includes("heavysnow")) return "snow";
    if (symbol.includes("snowshowers")) return "snow";
    if (symbol.includes("sleet")) return "sleet";
    if (symbol.includes("fog")) return "fog";

    // Dejar las versiones day/night correctas
    return symbol;
}


    const descMap = {
        clearsky_day: "Despejado",
        clearsky_night: "Despejado",
        fair_day: "Mayormente despejado",
        partlycloudy_day: "Parcialmente nublado",
        cloudy: "Nublado",
        rainshowers_day: "Lluvias ligeras",
        rain: "Lluvia",
        heavyrain: "Lluvia intensa",
        thunderstorm: "Tormenta eléctrica",
        fog: "Niebla",
        sleet: "Aguanieve",
        snow: "Nieve",
    };

    const el = {
        city: document.querySelector(".location-info h1"),
        time: document.querySelector(".time-badge span:nth-child(2)"),
        desc: document.querySelector(".description-badge span:nth-child(2)"),
        temp: document.querySelector(".temperature"),
        condition: document.querySelector(".condition"),
        humidity: document.querySelectorAll(".detail-value")[0],
        precip: document.querySelectorAll(".detail-value")[1],
        wind: document.querySelectorAll(".detail-value")[2],
        icon: document.querySelector(".weather-icon"),
        forecast: document.querySelector(".forecast-grid"),
    };

    async function getWeather(lat, lon, name = "Ubicación actual") {
        const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;
        const headers = { "User-Agent": "AtmosView/1.0 (ingeniero@tuapp.com)" };

        try {
            const res = await fetch(url, { headers });
            const data = await res.json();

            const series = data.properties.timeseries;
            const current = series[0].data;
            const currentSymbol =
                current.next_1_hours?.summary?.symbol_code ||
                current.next_6_hours?.summary?.symbol_code ||
                "cloudy";
            const temp = current.instant.details.air_temperature;
            const humidity = current.instant.details.relative_humidity;
            const wind = current.instant.details.wind_speed;
            const precip =
                current.next_1_hours?.details?.precipitation_amount ?? 0;

            // Normalizar el símbolo para evitar claves no contempladas
            const normalizedSymbol = normalizeSymbol(currentSymbol);

            // Elegir la mejor clave disponible para icon/desc
            function chooseSymbolKey(sym) {
                if (!sym) return "cloudy";
                // Preferir la clave exacta
                if (iconMap[sym] || descMap[sym]) return sym;
                // Probar sin sufijos _day/_night y sin otros sufijos conocidos
                const base = sym.replace(/_day|_night|_polartwilight/g, "");
                if (iconMap[base] || descMap[base]) return base;
                // Probar usando la normalización otra vez (por seguridad)
                const rebase = normalizeSymbol(base);
                if (iconMap[rebase] || descMap[rebase]) return rebase;
                return "cloudy";
            }

            const chosen = chooseSymbolKey(normalizedSymbol || currentSymbol);

            renderWeather({
                name,
                temp,
                humidity,
                wind,
                precip,
                icon: iconMap[chosen] || "🌡️",
                desc: descMap[chosen] || "Sin datos",
                series,
            });
        } catch (err) {
            console.error("Error al cargar clima:", err);
        }
    }

    function renderWeather({
        name,
        temp,
        humidity,
        wind,
        precip,
        icon,
        desc,
        series,
    }) {
        const now = new Date();

        // Datos actuales
        el.city.textContent = name;
        el.time.textContent = now.toLocaleString("es-ES", {
            weekday: "long",
            hour: "2-digit",
            minute: "2-digit",
        });
        el.desc.textContent = desc;
        el.temp.textContent = `${Math.round(temp)}°C`;
        el.condition.textContent = desc;
        el.humidity.textContent = `${Math.round(humidity)}%`;
        el.precip.textContent = `${precip.toFixed(1)} mm`;
        el.wind.textContent = `${Math.round(wind)} km/h`;
        el.icon.textContent = icon;

        // === Variación Horaria Dinámica ===
        const hourlyTemp = document.getElementById("temperature");
        const hourlyWind = document.getElementById("wind");
        const hourlyPrecip = document.getElementById("precipitation");

        

        // Limpiar anteriores
        hourlyTemp.innerHTML = "";
        hourlyWind.innerHTML = "";
        hourlyPrecip.innerHTML = "";

        // Filtrar solo las próximas 7 horas
        const nextHours = series.slice(0, 7);

        let tempMin = Infinity,
            tempMax = -Infinity;
        nextHours.forEach((e) => {
            const t = e.data.instant.details.air_temperature;
            if (t < tempMin) tempMin = t;
            if (t > tempMax) tempMax = t;
        });

        // === Temperatura ===
        hourlyTemp.innerHTML += `
            <div class="variation-header">
                <span class="variation-title">Variación de temperatura</span>
                    <span class="variation-range">${Math.round(
                        tempMax
                    )}° / ${Math.round(tempMin)}°</span>
            </div>`;

        nextHours.forEach((e) => {
            const d = new Date(e.time);
            const hour = d.toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
            });
            const t = e.data.instant.details.air_temperature;
            const percent = ((t - tempMin) / (tempMax - tempMin)) * 100;
            hourlyTemp.innerHTML += `
        <div class="variation-item">
            <span class="time-label">${hour}</span>
            <div class="progress-bar">
                <div class="progress-fill temperature-progress" style="width:${percent}%"></div>
            </div>
            <span class="value-label">${Math.round(t)}°</span>
        </div>`;
        });

        // === Viento ===
        // === Viento ===
        hourlyWind.innerHTML += `
        <div class="variation-header">
            <span class="variation-title">Variación de viento</span>
        </div>`;

        nextHours.forEach((e) => {
            const d = new Date(e.time);
            const hour = d.toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
            });

            const w = e.data.instant.details.wind_speed; // km/h
            const deg = e.data.instant.details.wind_from_direction; // grados (0-360)
            const percent = Math.min((w / 15) * 100, 100); // escala hasta 15 km/h

            // convertir dirección a flecha
            const dir = getWindArrow(deg);

            hourlyWind.innerHTML += `
        <div class="variation-item">
            <span class="time-label">${hour}</span>
            <div class="progress-bar">
                <div class="progress-fill wind-progress" style="width:${percent}%"></div>
            </div>
            <span class="value-label">${w.toFixed(1)} km/h ${dir}</span>
        </div>`;
        });

        // === Precipitación ===
        hourlyPrecip.innerHTML += `
        <div class="variation-header">
            <span class="variation-title">Probabilidad de precipitación</span>
        </div>`;

        nextHours.forEach((e) => {
            const d = new Date(e.time);
            const hour = d.toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
            });
            const p = e.data.next_1_hours?.details?.precipitation_amount ?? 0;
            const percent = Math.min((p / 10) * 100, 100); // escala hasta 10mm
            hourlyPrecip.innerHTML += `
        <div class="variation-item">
            <span class="time-label">${hour}</span>
            <div class="progress-bar">
                <div class="progress-fill precipitation-progress" style="width:${percent}%"></div>
            </div>
            <span class="value-label">${p.toFixed(1)} mm</span>
        </div>`;
        });

        // === Pronóstico por hora (solo el día actual) ===
const hourlyContainer = document.getElementById("hourlyForecast");
const hourlyTitle = document.getElementById("hourlyTitle");

if (hourlyContainer) {
    const now = new Date();
    const currentDay = now.getDate();
    const currentDayName = now.toLocaleDateString("es-ES", { weekday: "long" });

    // Encabezado del día
    hourlyTitle.textContent = `Pronóstico por hora — ${currentDayName.charAt(0).toUpperCase() + currentDayName.slice(1)}`;

    hourlyContainer.innerHTML = "";

    // Filtramos SOLO las horas del día actual
    const todayHours = series.filter(entry => {
        const d = new Date(entry.time);
        return d.getDate() === currentDay;
    });

    todayHours.forEach(entry => {
        const d = new Date(entry.time);
        const hour = d.toLocaleTimeString("es-ES", { hour: "numeric", hour12: true });
        const details = entry.data.instant.details;

        const symbol = normalizeSymbol(entry.data.next_1_hours?.summary?.symbol_code) || "cloudy";
        const icon = iconMap[symbol] || "🌡️";
        const temp = Math.round(details.air_temperature);
        const wind = Math.round(details.wind_speed);
        const rain = entry.data.next_1_hours?.details?.precipitation_amount ?? 0;

        hourlyContainer.innerHTML += `
            <div class="hour-item">
                <div class="hour-label">${hour}</div>
                <div class="hour-icon">${icon}</div>
                <div class="hour-temp">${temp}°</div>
                <div class="hour-extra">
                    <span>${wind} km/h</span> | <span>${rain.toFixed(1)} mm</span>
                </div>
            </div>`;
    });

    // Si no hay datos (por ejemplo, a las 23:59 del día), muestra aviso
    if (todayHours.length === 0) {
        hourlyContainer.innerHTML = `<p class="no-data">No hay datos disponibles para este día ⏳</p>`;
    }
}



        // === Pronóstico diario (7 días desde mañana) ===
        el.forecast.innerHTML = "";
        let addedDays = 0;
        for (let i = 0; i < series.length && addedDays < 7; i++) {
            const entry = series[i];
            const entryDate = new Date(entry.time);

            // Saltar las horas de hoy
            if (entryDate.getDate() === now.getDate()) continue;

            // Tomar solo una lectura por día (alrededor de las 12:00)
            if (entryDate.getHours() === 12) {
                const day = entryDate.toLocaleDateString("es-ES", {
                    weekday: "short",
                });
                const forecastSymbol =
                    entry.data.next_6_hours?.summary?.symbol_code || "cloudy";
                const fIcon = iconMap[forecastSymbol] || "🌡️";
                const fTemp = Math.round(
                    entry.data.instant.details.air_temperature
                );

                el.forecast.innerHTML += `
                    <div class="forecast-item">
                        <div class="forecast-day">${day}</div>
                        <div class="forecast-icon">${fIcon}</div>
                        <div class="forecast-temp">${fTemp}°</div>
                        <div class="forecast-low">-</div>
                    </div>`;
                addedDays++;
            }
        }

        function getWindArrow(deg) {
            if (deg >= 337.5 || deg < 22.5) return "↑"; // Norte
            if (deg >= 22.5 && deg < 67.5) return "↗"; // NE
            if (deg >= 67.5 && deg < 112.5) return "→"; // Este
            if (deg >= 112.5 && deg < 157.5) return "↘"; // SE
            if (deg >= 157.5 && deg < 202.5) return "↓"; // Sur
            if (deg >= 202.5 && deg < 247.5) return "↙"; // SO
            if (deg >= 247.5 && deg < 292.5) return "←"; // Oeste
            if (deg >= 292.5 && deg < 337.5) return "↖"; // NO
            return "·";
        }
    }

// === Buscar ciudad con GEOAPIFY (prioriza El Salvador y muestra hora local real) ===
const GEOAPIFY_KEY = "59efd1fba6de465194802ec4f0dcd34f";

document.getElementById("searchBtn").addEventListener("click", async () => {
    const query = document.getElementById("cityInput").value.trim();
    if (!query) return alert("Escribe una ciudad, municipio o país 🌍");

    try {
        const lowerQuery = query.toLowerCase();
        const knownCountries = [
            "españa", "francia", "alemania", "méxico", "argentina", "chile",
            "colombia", "perú", "guatemala", "honduras", "nicaragua", "panamá",
            "canadá", "eeuu", "estados unidos", "brasil", "italia", "japón", "china"
        ];

        const isGlobalSearch = knownCountries.some(c => lowerQuery.includes(c));
        const biasParam = isGlobalSearch ? "" : "&bias=countrycode:sv"; // Prioriza El Salvador 🇸🇻

        // === Llamada a Geoapify ===
        const geoUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(query)}&lang=es${biasParam}&limit=1&format=json&apiKey=${GEOAPIFY_KEY}`;
        const res = await fetch(geoUrl);
        const data = await res.json();

        console.log("Geoapify resultado:", data); // 👀 Debug

        if (!data || !data.results || data.results.length === 0)
            return alert("No se encontró la ubicación 😕");

        // Tomar el primer resultado
        const loc = data.results[0];
        const lat = loc.lat;
        const lon = loc.lon;

        if (!lat || !lon) {
            console.error("Sin coordenadas válidas:", loc);
            return alert("No se pudieron obtener coordenadas válidas ❌");
        }

        // Nombre amigable
        const placeName = [
            loc.city || loc.town || loc.village || loc.suburb || loc.name,
            loc.state || loc.county,
            loc.country
        ].filter(Boolean).join(", ");

        // === Obtener hora local exacta ===
        const tzUrl = `https://api.geoapify.com/v1/timezone?lat=${lat}&lon=${lon}&apiKey=${GEOAPIFY_KEY}`;
        const tzRes = await fetch(tzUrl);
        const tzData = await tzRes.json();

        if (!tzData || !tzData.timezone || !tzData.timezone.name) {
            console.warn("No se encontró zona horaria, se usará local");
        }

        const tz = tzData?.timezone?.name || "America/El_Salvador";
        const localTime = new Date().toLocaleString("es-ES", {
            timeZone: tz,
            weekday: "long",
            hour: "2-digit",
            minute: "2-digit"
        });

        // Mostrar hora local
        const badge = document.querySelector(".time-badge span:nth-child(2)");
        if (badge) badge.textContent = `${localTime} (${tz})`;

        // === Cargar el clima ===
        getWeather(lat, lon, placeName);
        window.lastCoords = { lat, lon, name: placeName };

    } catch (err) {
        console.error("Error al buscar ubicación:", err);
        alert("Error al buscar ubicación ❌");
    }
});


// --- Botón para usar mi ubicación ---
document.getElementById("geoBtn").addEventListener("click", () => {
    if (!navigator.geolocation)
        return alert("Tu navegador no soporta geolocalización ❌");

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            getWeather(pos.coords.latitude, pos.coords.longitude, "Tu ubicación 📍");
        },
        (err) => {
            console.warn("Error de geolocalización:", err);
            alert("No se pudo obtener tu ubicación. Activa el GPS o permite el acceso 🌎");
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
});

// --- Cargar clima inicial ---
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (p) => {
            getWeather(p.coords.latitude, p.coords.longitude, "Tu ubicación 📍");
        },
        (err) => {
            console.warn("No se pudo obtener geolocalización:", err);
            alert("Activa la ubicación para ver el clima de tu zona 🌎");
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
} else {
    alert("Tu navegador no soporta geolocalización ❌");
}


    // === Control de pestañas (usa los onclick del HTML) ===
    window.showTab = function (tabName) {
        // Ocultar todos los contenidos
        document
            .querySelectorAll(".variation-content")
            .forEach((el) => el.classList.remove("active"));
        // Quitar 'active' de los botones
        document
            .querySelectorAll(".tab")
            .forEach((btn) => btn.classList.remove("active"));

        // Mostrar la sección seleccionada
        const target = document.getElementById(tabName);
        if (target) target.classList.add("active");

        // Activar el botón correspondiente
        const activeBtn = Array.from(document.querySelectorAll(".tab")).find(
            (btn) =>
                btn.textContent.toLowerCase().includes(tabName.toLowerCase())
        );
        if (activeBtn) activeBtn.classList.add("active");
    };

    // --- Actualiza el día en el encabezado cada minuto ---
setInterval(() => {
    const now = new Date();
    const day = now.toLocaleDateString("es-ES", { weekday: "long" });
    const title = document.getElementById("hourlyTitle");
    if (title)
        title.textContent = `Pronóstico por hora — ${day.charAt(0).toUpperCase() + day.slice(1)}`;
}, 60000);

// --- Recarga automática al cambiar de día ---
let lastDay = new Date().getDate();

setInterval(() => {
    const now = new Date();
    const currentDay = now.getDate();

    if (currentDay !== lastDay) {
        // Día nuevo → recargamos el clima
        if (window.lastCoords) {
            getWeather(window.lastCoords.lat, window.lastCoords.lon, window.lastCoords.name || "Tu ubicación");
        }
        lastDay = currentDay;
    }
}, 60000); // Verifica cada minuto


});