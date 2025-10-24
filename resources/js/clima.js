document.addEventListener("DOMContentLoaded", () => {
    // === ICONOS Y DESCRIPCIONES ===
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

    function normalizeSymbol(symbol) {
        if (!symbol) return "cloudy";
        symbol = symbol.replace("_polartwilight", "");
        if (symbol.includes("andthunder")) return "thunderstorm";
        if (symbol.includes("heavyrainshowers")) return "heavyrain";
        if (symbol.includes("rainshowers")) return "rainshowers_day";
        if (symbol.includes("heavysnow")) return "snow";
        if (symbol.includes("snowshowers")) return "snow";
        if (symbol.includes("sleet")) return "sleet";
        if (symbol.includes("fog")) return "fog";
        return symbol;
    }

    // === ELEMENTOS DOM ===
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

    const GEOAPIFY_KEY = "59efd1fba6de465194802ec4f0dcd34f";

    // === NUEVO: CACHE LOCAL DE UBICACIÓN ===
    let cachedLocation = null;
    let lastFetchTime = 0;

    // === FUNCIÓN PRINCIPAL DE CLIMA ===
    async function getWeather(lat, lon, name = "Ubicación actual") {
        const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;
        const headers = { "User-Agent": "AtmosView/1.0 (ingeniero@tuapp.com)" };

        // Si es la ubicación local y hay datos recientes (menos de 5 minutos), mostrar cacheado instantáneamente
        if (name === "Tu ubicación 📍" && cachedLocation && Date.now() - lastFetchTime < 5 * 60 * 1000) {
            console.log("⏩ Mostrando clima cacheado mientras se actualiza...");
            renderWeather(cachedLocation);
        }

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

            const normalizedSymbol = normalizeSymbol(currentSymbol);
            const chosen =
                iconMap[normalizedSymbol] || descMap[normalizedSymbol]
                    ? normalizedSymbol
                    : "cloudy";

            // === Detección automática de zona horaria confiable ===
            let timeZone = "America/El_Salvador";
            try {
                const tzUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${GEOAPIFY_KEY}`;
                const tzRes = await fetch(tzUrl);
                const tzData = await tzRes.json();
                const props = tzData?.features?.[0]?.properties || {};
                if (props.timezone && props.timezone.name) {
                    timeZone = props.timezone.name;
                } else if (props.timezone_offset_sec) {
                    const offsetHours = props.timezone_offset_sec / 3600;
                    timeZone = `UTC${offsetHours >= 0 ? "+" : ""}${offsetHours}`;
                }
                console.log("Zona horaria detectada:", timeZone);
            } catch (err) {
                timeZone =
                    Intl.DateTimeFormat().resolvedOptions().timeZone ||
                    "America/El_Salvador";
                console.warn("Usando zona local del navegador:", timeZone);
            }

            // === GUARDAR EN CACHÉ ===
            if (name === "Tu ubicación 📍") {
                cachedLocation = {
                    name,
                    temp,
                    humidity,
                    wind,
                    precip,
                    icon: iconMap[chosen] || "🌡️",
                    desc: descMap[chosen] || "Sin datos",
                    series,
                    timeZone,
                };
                lastFetchTime = Date.now();
                console.log("✅ Clima cacheado actualizado.");
            }

            renderWeather({
                name,
                temp,
                humidity,
                wind,
                precip,
                icon: iconMap[chosen] || "🌡️",
                desc: descMap[chosen] || "Sin datos",
                series,
                timeZone,
            });
        } catch (err) {
            console.error("Error al cargar clima:", err);
        }
    }

    // === FUNCIÓN DE RENDERIZADO ===
    function renderWeather({
        name,
        temp,
        humidity,
        wind,
        precip,
        icon,
        desc,
        series,
        timeZone,
    }) {
        el.city.textContent = name;
        el.time.textContent = new Date().toLocaleString("es-ES", {
            timeZone: timeZone,
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

        // === VARIACIONES ===
        const hourlyTemp = document.getElementById("temperature");
        const hourlyWind = document.getElementById("wind");
        const hourlyPrecip = document.getElementById("precipitation");

        hourlyTemp.innerHTML = "";
        hourlyWind.innerHTML = "";
        hourlyPrecip.innerHTML = "";

        const nextHours = series.slice(0, 7);
        let tempMin = Infinity,
            tempMax = -Infinity;
        nextHours.forEach((e) => {
            const t = e.data.instant.details.air_temperature;
            if (t < tempMin) tempMin = t;
            if (t > tempMax) tempMax = t;
        });

        hourlyTemp.innerHTML += `
            <div class="variation-header">
                <span class="variation-title">Variación de temperatura</span>
                <span class="variation-range">${Math.round(tempMax)}° / ${Math.round(tempMin)}°</span>
            </div>`;

        nextHours.forEach((e) => {
            const d = new Date(e.time);
            const hour = d.toLocaleTimeString("es-ES", {
                timeZone: timeZone,
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
        hourlyWind.innerHTML += `<div class="variation-header"><span class="variation-title">Variación de viento</span></div>`;
        nextHours.forEach((e) => {
            const d = new Date(e.time);
            const hour = d.toLocaleTimeString("es-ES", {
                timeZone: timeZone,
                hour: "2-digit",
                minute: "2-digit",
            });
            const w = e.data.instant.details.wind_speed;
            const deg = e.data.instant.details.wind_from_direction;
            const percent = Math.min((w / 15) * 100, 100);
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
        hourlyPrecip.innerHTML += `<div class="variation-header"><span class="variation-title">Probabilidad de precipitación</span></div>`;
        nextHours.forEach((e) => {
            const d = new Date(e.time);
            const hour = d.toLocaleTimeString("es-ES", {
                timeZone: timeZone,
                hour: "2-digit",
                minute: "2-digit",
            });
            const p = e.data.next_1_hours?.details?.precipitation_amount ?? 0;
            const percent = Math.min((p / 10) * 100, 100);
            hourlyPrecip.innerHTML += `
                <div class="variation-item">
                    <span class="time-label">${hour}</span>
                    <div class="progress-bar">
                        <div class="progress-fill precipitation-progress" style="width:${percent}%"></div>
                    </div>
                    <span class="value-label">${p.toFixed(1)} mm</span>
                </div>`;
        });

        function getWindArrow(deg) {
            if (deg >= 337.5 || deg < 22.5) return "↑";
            if (deg >= 22.5 && deg < 67.5) return "↗";
            if (deg >= 67.5 && deg < 112.5) return "→";
            if (deg >= 112.5 && deg < 157.5) return "↘";
            if (deg >= 157.5 && deg < 202.5) return "↓";
            if (deg >= 202.5 && deg < 247.5) return "↙";
            if (deg >= 247.5 && deg < 292.5) return "←";
            if (deg >= 292.5 && deg < 337.5) return "↖";
            return "·";
        }

        // === PRONÓSTICO POR HORA === (ya bien con zona local)
        const hourlyContainer = document.getElementById("hourlyForecast");
        const hourlyTitle = document.getElementById("hourlyTitle");

        if (hourlyContainer) {
            const now = new Date();
            const nowLocal = new Date(now.toLocaleString("en-US", { timeZone }));
            const currentDay = nowLocal.getDate();
            const currentDayName = nowLocal.toLocaleDateString("es-ES", {
                weekday: "long",
            });

            hourlyTitle.textContent = `Pronóstico por hora — ${
                currentDayName.charAt(0).toUpperCase() +
                currentDayName.slice(1)
            }`;
            hourlyContainer.innerHTML = "";

            const todayHours = series.filter((entry) => {
                const utc = new Date(entry.time);
                const local = new Date(utc.toLocaleString("en-US", { timeZone }));
                return local.getDate() === currentDay;
            });

            todayHours.forEach((entry) => {
                const d = new Date(entry.time);
                const hour = d.toLocaleTimeString("es-ES", {
                    timeZone: timeZone,
                    hour: "numeric",
                    hour12: true,
                });
                const details = entry.data.instant.details;
                const symbol =
                    normalizeSymbol(entry.data.next_1_hours?.summary?.symbol_code) ||
                    "cloudy";
                const icon = iconMap[symbol] || "🌡️";
                const temp = Math.round(details.air_temperature);
                const wind = Math.round(details.wind_speed);
                const rain =
                    entry.data.next_1_hours?.details?.precipitation_amount ?? 0;

                hourlyContainer.innerHTML += `
                    <div class="hour-item">
                        <div class="hour-label">${hour}</div>
                        <div class="hour-icon">${icon}</div>
                        <div class="hour-temp">${temp}°</div>
                        <div class="hour-extra">
                            <span>${wind} km/h</span> | <span>${rain.toFixed(
                    1
                )} mm</span>
                        </div>
                    </div>`;
            });

            if (todayHours.length === 0) {
                hourlyContainer.innerHTML = `<p class="no-data">No hay datos disponibles para este día ⏳</p>`;
            }
        }

        // === PRONÓSTICO DIARIO (7 DÍAS) ===
        el.forecast.innerHTML = "";
        const nowLocal = new Date(new Date().toLocaleString("en-US", { timeZone }));
        const currentDay = nowLocal.getDate();
        let addedDays = 0;
        let lastDaySeen = null;

        for (let i = 0; i < series.length && addedDays < 7; i++) {
            const entry = series[i];
            const entryDate = new Date(entry.time);
            const localEntry = new Date(
                entryDate.toLocaleString("en-US", { timeZone })
            );

            const dayNum = localEntry.getDate();
            if (dayNum === currentDay) continue;

            if (dayNum !== lastDaySeen) {
                lastDaySeen = dayNum;
                const day = localEntry.toLocaleDateString("es-ES", {
                    weekday: "short",
                });
                const forecastSymbol =
                    entry.data.next_6_hours?.summary?.symbol_code ||
                    entry.data.next_12_hours?.summary?.symbol_code ||
                    "cloudy";
                const fIcon = iconMap[normalizeSymbol(forecastSymbol)] || "🌡️";
                const fTemp = Math.round(
                    entry.data.instant.details.air_temperature
                );

                el.forecast.innerHTML += `
            <div class="forecast-item">
                <div class="forecast-day">${day}</div>
                <div class="forecast-icon">${fIcon}</div>
                <div class="forecast-temp">${fTemp}°</div>
            </div>`;

                addedDays++;
            }
        }
    }

    // === AUTOCOMPLETADO GEOAPIFY ===
    const input = document.getElementById("cityInput");
    const suggestions = document.getElementById("suggestions");

    input.addEventListener("input", async () => {
        const query = input.value.trim();
        if (query.length < 3) {
            suggestions.innerHTML = "";
            return;
        }

        const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
            query
        )}&lang=es&limit=5&apiKey=${GEOAPIFY_KEY}`;
        try {
            const res = await fetch(url);
            const data = await res.json();
            suggestions.innerHTML = "";

            data.features.forEach((f) => {
                const p = f.properties;
                const name =
                    p.city ||
                    p.town ||
                    p.village ||
                    p.name ||
                    "Lugar sin nombre";
                const country = p.country || "";
                const lat = p.lat;
                const lon = p.lon;
                const flag = p.country_code
                    ? `<img src="https://flagcdn.com/24x18/${p.country_code.toLowerCase()}.png" alt="${country}">`
                    : "";

                const item = document.createElement("div");
                item.className = "suggestion-item";
                item.innerHTML = `${flag}<span>${name}, ${country}</span>`;
                item.addEventListener("click", () => {
                    input.value = `${name}, ${country}`;
                    suggestions.innerHTML = "";
                    getWeather(lat, lon, `${name}, ${country}`);
                    window.lastCoords = {
                        lat,
                        lon,
                        name: `${name}, ${country}`,
                    };
                });
                suggestions.appendChild(item);
            });
        } catch (err) {
            console.error("Error en autocompletado:", err);
        }
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".search-wrapper")) suggestions.innerHTML = "";
    });

    // === BOTÓN DE BÚSQUEDA (funciona con o sin sugerencias) ===
    document.getElementById("searchBtn").addEventListener("click", async () => {
        const query = document.getElementById("cityInput").value.trim();
        if (!query) return alert("Escribe una ciudad, municipio o país 🌍");

        if (
            window.lastCoords &&
            window.lastCoords.name.toLowerCase().includes(query.toLowerCase())
        ) {
            const { lat, lon, name } = window.lastCoords;
            getWeather(lat, lon, name);
            return;
        }

        try {
            const geoUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
                query
            )}&lang=es&limit=1&apiKey=${GEOAPIFY_KEY}`;
            const res = await fetch(geoUrl);
            const data = await res.json();

            if (!data || !data.results || data.results.length === 0)
                return alert("No se encontró la ubicación 😕");

            const loc = data.results[0];
            const lat = loc.lat;
            const lon = loc.lon;
            const placeName = [
                loc.city || loc.town || loc.village || loc.name,
                loc.state || loc.county,
                loc.country,
            ]
                .filter(Boolean)
                .join(", ");

            window.lastCoords = { lat, lon, name: placeName };
            getWeather(lat, lon, placeName);
        } catch (err) {
            console.error("Error al buscar ubicación:", err);
            alert("Error al buscar ubicación ❌");
        }
    });

    // === GEOLOCALIZACIÓN ===
    document.getElementById("geoBtn").addEventListener("click", () => {
        if (!navigator.geolocation)
            return alert("Tu navegador no soporta geolocalización ❌");

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                getWeather(
                    pos.coords.latitude,
                    pos.coords.longitude,
                    "Tu ubicación 📍"
                );
            },
            (err) => {
                console.warn("Error de geolocalización:", err);
                alert("No se pudo obtener tu ubicación. Activa el GPS 🌎");
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
        );
    });

    // === CARGA INICIAL ===
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (p) => {
                getWeather(
                    p.coords.latitude,
                    p.coords.longitude,
                    "Tu ubicación 📍"
                );
            },
            () => {},
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
        );
    }

    // === CONTROL DE PESTAÑAS ===
    window.showTab = function (tabName) {
        document
            .querySelectorAll(".variation-content")
            .forEach((el) => el.classList.remove("active"));
        document
            .querySelectorAll(".tab")
            .forEach((btn) => btn.classList.remove("active"));
        const target = document.getElementById(tabName);
        if (target) target.classList.add("active");
        const activeBtn = Array.from(document.querySelectorAll(".tab")).find(
            (btn) =>
                btn.textContent.toLowerCase().includes(tabName.toLowerCase())
        );
        if (activeBtn) activeBtn.classList.add("active");
    };
});
