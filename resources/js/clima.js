document.addEventListener("DOMContentLoaded", () => {
    const descMap = {
  // ☀️ Cielos despejados
  clearsky_day: "Cielo despejado",
  clearsky_night: "Cielo despejado",
  clearsky_polartwilight: "Cielo despejado",

  // 🌤️ Parcialmente despejado
  fair_day: "Mayormente despejado",
  fair_night: "Mayormente despejado",
  fair_polartwilight: "Mayormente despejado",

  // ⛅ Parcialmente nublado
  partlycloudy_day: "Parcialmente nublado",
  partlycloudy_night: "Parcialmente nublado",
  partlycloudy_polartwilight: "Parcialmente nublado",

  // ☁️ Nublado
  cloudy: "Nublado",

  // 🌫️ Niebla
  fog: "Niebla o neblina",

  // 🌦️ Lloviznas / chubascos ligeros
  rainshowers_day: "Chubascos dispersos",
  rainshowers_night: "Chubascos nocturnos",
  rainshowers_polartwilight: "Chubascos ligeros",
  lightrainshowers_day: "Lloviznas intermitentes",
  lightrainshowers_night: "Lloviznas nocturnas",
  lightrainshowers_polartwilight: "Lloviznas",

  // 🌧️ Lluvias continuas
  lightrain: "Llovizna",
  rain: "Lluvia moderada",
  heavyrain: "Lluvia intensa",

  // ⛈️ Tormentas
  rainandthunder: "Tormenta eléctrica con lluvia",
  lightrainandthunder: "Tormenta eléctrica leve",
  heavyrainandthunder: "Tormenta eléctrica intensa",
  rainshowersandthunder_day: "Chubascos con tormentas eléctricas",
  rainshowersandthunder_night: "Chubascos con tormentas eléctricas nocturnas",
  rainshowersandthunder_polartwilight: "Chubascos con tormentas eléctricas",

  // 🌨️ Nieve
  snow: "Nieve",
  lightsnow: "Nieve ligera",
  heavysnow: "Nieve intensa",
  snowshowers_day: "Chubascos de nieve",
  snowshowers_night: "Chubascos de nieve nocturnos",
  snowshowers_polartwilight: "Chubascos de nieve",
  snowandthunder: "Tormenta de nieve eléctrica",

  // 🌨️ Aguanieve
  sleet: "Aguanieve",
  sleetshowers_day: "Chubascos de aguanieve",
  sleetshowers_night: "Chubascos de aguanieve nocturnos",
  sleetshowers_polartwilight: "Chubascos de aguanieve",
  sleetandthunder: "Tormenta con aguanieve",

  // ⚡ Tormentas generales
  thunderstorm: "Tormenta eléctrica",
  heavyrainandthunder: "Tormenta eléctrica fuerte",
  lightrainandthunder: "Tormenta eléctrica leve",
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

    // === CLAVES / CONFIG ===
    const TZDB_KEY = "70HPMUDQHER2"; // <-- pon tu clave gratuita de https://timezonedb.com

    // === CACHE LOCAL DE UBICACIÓN ===
    let cachedLocation = null;
    let lastFetchTime = 0;

    // === FUNCIÓN PRINCIPAL DE CLIMA ===
    async function getWeather(lat, lon, name = "Ubicación actual") {
        const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;
        const headers = { "User-Agent": "AtmosView/1.0 (ingeniero@tuapp.com)" };

        // cache rápido para ubicación actual
        if (
            name === "Tu ubicación 📍" &&
            cachedLocation &&
            Date.now() - lastFetchTime < 5 * 60 * 1000
        ) {
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
            const chosen = normalizedSymbol || "cloudy";
            const iconUrl = `https://cdn.jsdelivr.net/gh/metno/weathericons@master/weather/svg/${chosen}.svg`;








            // === Zona horaria real (TimeZoneDB) ===
            // === Zona horaria real (TimeZoneDB) ===
            let timeZone = "America/El_Salvador";
            try {
                if (TZDB_KEY && TZDB_KEY !== "YOUR_TZDB_KEY") {
                    const tzUrl = `https://api.timezonedb.com/v2.1/get-time-zone?key=${encodeURIComponent(
                        TZDB_KEY
                    )}&format=json&by=position&lat=${lat}&lng=${lon}`;
                    const tzRes = await fetch(tzUrl);
                    const tzJson = await tzRes.json();
                    if (tzJson && tzJson.status === "OK" && tzJson.zoneName) {
                        timeZone = tzJson.zoneName;
                    } else {
                        console.warn(
                            "⚠️ TimeZoneDB no devolvió zona, usando local"
                        );
                        timeZone =
                            Intl.DateTimeFormat().resolvedOptions().timeZone ||
                            "America/El_Salvador";
                    }
                    console.log("Zona horaria detectada:", timeZone);
                } else {
                    console.warn(
                        "⚠️ No se configuró TZDB_KEY, usando hora local"
                    );
                    timeZone =
                        Intl.DateTimeFormat().resolvedOptions().timeZone ||
                        "America/El_Salvador";
                }
            } catch (err) {
                console.error("Error en detección de zona horaria:", err);
                timeZone =
                    Intl.DateTimeFormat().resolvedOptions().timeZone ||
                    "America/El_Salvador";
            }

            // === GUARDAR EN CACHÉ ===
            if (name === "Tu ubicación 📍") {
                cachedLocation = {
                    name,
                    temp,
                    humidity,
                    wind,
                    precip,
                    icon: iconUrl,

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
                icon: iconUrl,
                desc: descMap[chosen] || "Sin datos",
                series,
                timeZone,
                lat,    
                lon,
            });
            await updateSolarPath(lat, lon, timeZone);
            await updateLunarPath(lat, lon, timeZone);
            await updateExtraMetrics(lat, lon, name, temp, humidity, wind);
            updateSpecialForecasts(temp, humidity, wind, precip, normalizedSymbol);

        } catch (err) {
            console.error("Error al cargar clima:", err);
        }
    }

    // === FUNCIÓN DE RENDERIZADO (TU LÓGICA COMPLETA) ===
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
        lat,    
        lon,
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
// Conversión mm → % estimado
const precipProb = Math.min(Math.round((precip / 10) * 100), 100);
el.precip.textContent = `${precipProb}%`;

        el.wind.textContent = `${Math.round(wind)} km/h`;
        el.icon.innerHTML = `<img src="${icon}" alt="${desc}" width="90" height="90">`;
// Cambiar ícono de precipitación según el clima actual
const precipIcon = document.getElementById("precip-icon");
if (precipIcon) precipIcon.src = icon; // "icon" ya viene del clima actual




        // === VARIACIONES ===
        const hourlyTemp = document.getElementById("temperature");
        const hourlyWind = document.getElementById("wind");
        const hourlyPrecip = document.getElementById("precipitation");

        if (hourlyTemp) hourlyTemp.innerHTML = "";
        if (hourlyWind) hourlyWind.innerHTML = "";
        if (hourlyPrecip) hourlyPrecip.innerHTML = "";

        const nextHours = series.slice(0, 7);
        let tempMin = Infinity,
            tempMax = -Infinity;
        nextHours.forEach((e) => {
            const t = e.data.instant.details.air_temperature;
            if (t < tempMin) tempMin = t;
            if (t > tempMax) tempMax = t;
        });

        if (hourlyTemp) {
            hourlyTemp.innerHTML += `
            <div class="variation-header">
                <span class="variation-title">Variación de temperatura</span>
                <span class="variation-range">${Math.round(
                tempMax
            )}° / ${Math.round(tempMin)}°</span>
            </div>`;
        }

        nextHours.forEach((e) => {
            const d = new Date(e.time);
            const hour = d.toLocaleTimeString("es-ES", {
                timeZone: timeZone,
                hour: "2-digit",
                minute: "2-digit",
            });
            const t = e.data.instant.details.air_temperature;
            const percent =
                tempMax === tempMin
                    ? 0
                    : ((t - tempMin) / (tempMax - tempMin)) * 100;
            if (hourlyTemp) {
                hourlyTemp.innerHTML += `
                <div class="variation-item">
                    <span class="time-label">${hour}</span>
                    <div class="progress-bar">
                        <div class="progress-fill temperature-progress" style="width:${percent}%"></div>
                    </div>
                    <span class="value-label">${Math.round(t)}°</span>
                </div>`;
            }
        });

        // === Viento ===
        if (hourlyWind)
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
            if (hourlyWind) {
                hourlyWind.innerHTML += `
                <div class="variation-item">
                    <span class="time-label">${hour}</span>
                    <div class="progress-bar">
                        <div class="progress-fill wind-progress" style="width:${percent}%"></div>
                    </div>
                    <span class="value-label">${w.toFixed(1)} km/h ${dir}</span>
                </div>`;
            }
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

        // === Precipitación ===
        if (hourlyPrecip)
            hourlyPrecip.innerHTML += `
    <div class="variation-header">
    <span class="variation-title">Variación de precipitación</span>
    </div>`;

nextHours.forEach((e) => {
    const d = new Date(e.time);
    const hour = d.toLocaleTimeString("es-ES", {
        timeZone: timeZone,
        hour: "2-digit",
        minute: "2-digit",
    });
    const rain = e.data.next_1_hours?.details?.precipitation_amount ?? 0;
    const percent = Math.min((rain / 10) * 100, 100);
    const rainProb = Math.min(Math.round((rain / 10) * 100), 100);

    if (hourlyPrecip) {
        hourlyPrecip.innerHTML += `
            <div class="variation-item">
                <span class="time-label">${hour}</span>
                <div class="progress-bar">
                    <div class="progress-fill precipitation-progress" style="width:${percent}%"></div>
                </div>
                <span class="value-label">${rainProb}%</span>
            </div>`;
    }
});


        // === PRONÓSTICO POR HORA (HOY) ===
        const hourlyContainer = document.getElementById("hourlyForecast");
        const hourlyTitle = document.getElementById("hourlyTitle");

        if (hourlyContainer && hourlyTitle) {
            const now = new Date();
            const nowLocal = new Date(
                now.toLocaleString("en-US", { timeZone })
            );
            const currentDay = nowLocal.getDate();
            const currentDayName = nowLocal.toLocaleDateString("es-ES", {
                weekday: "long",
            });

            hourlyTitle.textContent = `Pronóstico por hora — ${currentDayName.charAt(0).toUpperCase() + currentDayName.slice(1)
                }`;
            hourlyContainer.innerHTML = "";

            const todayHours = series.filter((entry) => {
                const utc = new Date(entry.time);
                const local = new Date(
                    utc.toLocaleString("en-US", { timeZone })
                );
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
                const symbol = normalizeSymbol(entry.data.next_1_hours?.summary?.symbol_code) || "cloudy";
                const icon = `https://cdn.jsdelivr.net/gh/metno/weathericons@master/weather/svg/${symbol}.svg`;




                const temp = Math.round(details.air_temperature);
                const wind = Math.round(details.wind_speed);
                const rain =
                    entry.data.next_1_hours?.details?.precipitation_amount ?? 0;

                hourlyContainer.innerHTML += `
                    <div class="hour-item">
                        <div class="hour-label">${hour}</div>
                        <div class="hour-icon"><img src="${icon}" alt="${symbol}" width="45" height="45"></div>

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

        // === DIAGNÓSTICO DEL DÍA ===
        (() => {
            try {
                if (!series || !series.length) {
                    console.warn("⚠️ Sin datos de series para diagnóstico.");
                    document.getElementById("diagnostic-text").textContent =
                        "No hay datos suficientes para el diagnóstico.";
                    return;
                }

                const normalizeSymbolLocal = (symbol) => {
                    if (!symbol) return "cloudy";
                    symbol = symbol.replace("_polartwilight", "");
                    if (symbol.includes("andthunder")) return "thunderstorm";
                    if (symbol.includes("heavyrainshowers")) return "heavyrain";
                    if (symbol.includes("rainshowers"))
                        return "rainshowers_day";
                    if (symbol.includes("heavysnow")) return "snow";
                    if (symbol.includes("snowshowers")) return "snow";
                    if (symbol.includes("sleet")) return "sleet";
                    if (symbol.includes("fog")) return "fog";
                    return symbol;
                };

                const nowSymbol = normalizeSymbolLocal(
                    series[0]?.data?.next_1_hours?.summary?.symbol_code || ""
                );
                const currentRain =
                    series[0]?.data?.next_1_hours?.details
                        ?.precipitation_amount ?? 0;

                let msgList = [];

                // === Clima actual ===
                if (nowSymbol.includes("snow"))
                    msgList.push("❄️ Está nevando actualmente.");
                else if (nowSymbol.includes("rain") && currentRain > 0.5)
                    msgList.push("🌧️ Está lloviendo en este momento.");
                else if (nowSymbol.includes("sleet"))
                    msgList.push("🌨️ Hay aguanieve en la zona.");
                else if (nowSymbol.includes("thunderstorm"))
                    msgList.push("⚡ Hay tormentas eléctricas activas.");
                else if (nowSymbol.includes("fog"))
                    msgList.push(
                        "🌫️ Hay presencia de niebla, conduce con precaución."
                    );
                else if (nowSymbol.includes("clear"))
                    msgList.push("☀️ Cielo despejado, excelente visibilidad.");
                else if (nowSymbol.includes("cloudy"))
                    msgList.push("☁️ El cielo está mayormente nublado.");
                else msgList.push("🌤️ Condiciones estables en este momento.");

  // === Lluvias o nieve próximas ===
const nextHours = series.slice(1, 6);
const rainHours = nextHours.filter(
    (e) =>
        (e.data.next_1_hours?.details?.precipitation_amount ?? 0) > 0.5 ||
        (e.data.next_1_hours?.summary?.symbol_code || "").includes("snow")
).length;

// Determinar si está en zona tropical (sin nieve)
const isTropical = Math.abs(lat) <= 30; // <- lat viene de getWeather()

if (rainHours >= 3) {
    msgList.push("☂️ Se esperan precipitaciones continuas durante las próximas horas.");
} else if (rainHours > 0) {
    if (isTropical)
        msgList.push("🌦️ Podría llover intermitentemente en las próximas horas.");
    else
        msgList.push("🌦️ Podría llover o nevar intermitentemente en las próximas horas.");
} else if (currentRain === 0) {
    msgList.push("☼ No se esperan precipitaciones por ahora.");
}


                // === Temperatura ===
                if (temp > 32)
                    msgList.push("♨ Hace bastante calor, hidrátate bien.");
                else if (temp < 5)
                    msgList.push(
                        "🧤 Día muy frío, abrígate y cuidado con el hielo."
                    );
                else if (temp < 15)
                    msgList.push("🧣 Día fresco, abrígate un poco.");
                else msgList.push("⛅ Temperatura agradable.");

                // === Viento ===
                if (wind > 30)
                    msgList.push(
                        "🌀 Viento fuerte, evita zonas abiertas o elevadas."
                    );
                else if (wind > 15) msgList.push("💨 Brisa moderada presente.");

                // === Cierre general ===
                msgList.push(
                    "🌍 Disfruta el día y mantente atento a los cambios del clima."
                );

                // === Mostrar formateado ===
                const diagEl = document.getElementById("diagnostic-text");
                if (diagEl) {
                    diagEl.innerHTML = msgList
                        .map((line) => `<div class="diag-line">${line}</div>`)
                        .join("");
                }

                console.log("✅ Diagnóstico actualizado:", msgList);
            } catch (err) {
                console.error("❌ Error generando diagnóstico:", err);
                const diagEl = document.getElementById("diagnostic-text");
                if (diagEl)
                    diagEl.textContent =
                        "Ocurrió un error al generar el diagnóstico del día.";
            }
        })();

        // === PRONÓSTICO DIARIO (7 DÍAS) ===
        if (el.forecast) el.forecast.innerHTML = "";
        const nowLocal2 = new Date(
            new Date().toLocaleString("en-US", { timeZone })
        );
        const currentDay2 = nowLocal2.getDate();
        let addedDays = 0;
        let lastDaySeen = null;

        for (let i = 0; i < series.length && addedDays < 7; i++) {
            const entry = series[i];
            const entryDate = new Date(entry.time);
            const localEntry = new Date(
                entryDate.toLocaleString("en-US", { timeZone })
            );

            const dayNum = localEntry.getDate();
            if (dayNum === currentDay2) continue;

            if (dayNum !== lastDaySeen) {
                lastDaySeen = dayNum;
                const day = localEntry.toLocaleDateString("es-ES", {
                    weekday: "short",
                });
                const forecastSymbol = entry.data.next_6_hours?.summary?.symbol_code || entry.data.next_12_hours?.summary?.symbol_code || "cloudy";
                const fIcon = `https://cdn.jsdelivr.net/gh/metno/weathericons@master/weather/svg/${normalizeSymbol(forecastSymbol)}.svg`;


                const fTemp = Math.round(
                    entry.data.instant.details.air_temperature
                );

                if (el.forecast) {
                    el.forecast.innerHTML += `
                    <div class="forecast-item">
                        <div class="forecast-day">${day}</div>
                        <div class="forecast-icon"><img src="${fIcon}" alt="${forecastSymbol}" width="50" height="50"></div>

                        <div class="forecast-temp">${fTemp}°</div>
                    </div>`;
                }

                addedDays++;
            }
        }
    }

    // === AUTOCOMPLETADO (Nominatim) ===
    const input = document.getElementById("cityInput");
    const suggestions = document.getElementById("suggestions");

    input.addEventListener("input", async () => {
        const query = input.value.trim();
        if (query.length < 3) {
            suggestions.innerHTML = "";
            return;
        }

        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
        )}&addressdetails=1&limit=5&accept-language=es`;
        try {
            const res = await fetch(url, {
                headers: {
                    "User-Agent": "AtmosView/1.0 (ingeniero@tuapp.com)",
                },
            });
            const data = await res.json();
            suggestions.innerHTML = "";

            data.forEach((f) => {
                const p = f.address || {};
                const name =
                    p.city ||
                    p.town ||
                    p.village ||
                    f.display_name.split(",")[0] ||
                    "Lugar sin nombre";
                const country = p.country || "";
                const lat = f.lat;
                const lon = f.lon;
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
            const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                query
            )}&addressdetails=1&limit=1&accept-language=es`;
            const res = await fetch(geoUrl, {
                headers: {
                    "User-Agent": "AtmosView/1.0 (ingeniero@tuapp.com)",
                },
            });
            const data = await res.json();

            if (!data || !data.length)
                return alert("No se encontró la ubicación 😕");

            const loc = data[0];
            const lat = loc.lat;
            const lon = loc.lon;
            const p = loc.address || {};
            const placeName = [
                p.city || p.town || p.village || loc.display_name.split(",")[0],
                p.state || p.county,
                p.country,
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
            () => { },
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

    // === ACTUALIZAR RECORRIDO SOLAR ===
    async function updateSolarPath(lat, lon, timeZone) {
        try {
            const apiUrl = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`;
            const res = await fetch(apiUrl);
            const data = await res.json();

            const sunrise = new Date(data.results.sunrise);
            const sunset = new Date(data.results.sunset);
            const now = new Date(
                new Date().toLocaleString("en-US", { timeZone })
            );

            const totalDay = sunset - sunrise;
            const elapsed = now - sunrise;
            const progress = Math.max(0, Math.min(elapsed / totalDay, 1));

            // Posición del sol ☀️
            const svg = document.getElementById("solar-curve");
            const sun = document.getElementById("sun");
            const path = svg.querySelector("path");
            const pathLength = path.getTotalLength();

            const point = path.getPointAtLength(progress * pathLength);
            sun.setAttribute("cx", point.x);
            sun.setAttribute("cy", point.y);

            // Mostrar info
            const sunriseStr = sunrise.toLocaleTimeString("es-ES", {
                timeZone,
                hour: "2-digit",
                minute: "2-digit",
            });
            const sunsetStr = sunset.toLocaleTimeString("es-ES", {
                timeZone,
                hour: "2-digit",
                minute: "2-digit",
            });

            const dayHours = (totalDay / (1000 * 60 * 60)).toFixed(1);

            document.getElementById(
                "sunrise"
            ).textContent = `Amanecer: ${sunriseStr}`;
            document.getElementById(
                "sunset"
            ).textContent = `Atardecer: ${sunsetStr}`;
            document.getElementById(
                "day-length"
            ).textContent = `Duración: ${dayHours} h`;
        } catch (err) {
            console.error("Error al obtener recorrido solar:", err);
        }
    }

    // === FASE LUNAR ===
    // === FASE LUNAR (Met.no) ===
    async function updateLunarPath(lat, lon, timeZone) {
        try {
            const dateStr = new Date().toISOString().split("T")[0];
            const apiUrl = `https://api.met.no/weatherapi/sunrise/2.0/.xml?lat=${lat}&lon=${lon}&date=${dateStr}&days=1`;

            const res = await fetch(apiUrl, {
                headers: {
                    "User-Agent": "AtmosView/1.0 (ingeniero@tuapp.com)",
                },
            });

            if (!res.ok) throw new Error("Error al obtener datos de Met.no");
            const xmlText = await res.text();

            // === Parseo manual (XML simple) ===
            const parser = new DOMParser();
            const xml = parser.parseFromString(xmlText, "text/xml");

            const moonEl = xml.querySelector("moonphase");
            const moonRise = xml.querySelector("moonrise");
            const moonSet = xml.querySelector("moonset");

            const phase = moonEl?.getAttribute("value") || "Desconocida";
            const moonriseTime = moonRise?.getAttribute("time");
            const moonsetTime = moonSet?.getAttribute("time");

            const moonriseLocal = moonriseTime
                ? new Date(moonriseTime).toLocaleTimeString("es-ES", {
                    timeZone,
                    hour: "2-digit",
                    minute: "2-digit",
                })
                : "No disponible";

            const moonsetLocal = moonsetTime
                ? new Date(moonsetTime).toLocaleTimeString("es-ES", {
                    timeZone,
                    hour: "2-digit",
                    minute: "2-digit",
                })
                : "No disponible";

            // === Mostrar info ===
            document.getElementById(
                "moon-phase-name"
            ).textContent = `Fase lunar: ${phase}`;
            document.getElementById(
                "moonrise"
            ).textContent = `Salida de la luna: ${moonriseLocal}`;
            document.getElementById(
                "moonset"
            ).textContent = `Puesta de la luna: ${moonsetLocal}`;

            // === Imagen según fase ===
            const moonImgEl = document.getElementById("moon-image");
            if (moonImgEl) {
                let imgUrl = "";
                if (phase.includes("new"))
                    imgUrl = "https://www.timeanddate.com/scripts/moon.php?i=0";
                else if (phase.includes("waxing_crescent"))
                    imgUrl = "https://www.timeanddate.com/scripts/moon.php?i=4";
                else if (phase.includes("first_quarter"))
                    imgUrl = "https://www.timeanddate.com/scripts/moon.php?i=8";
                else if (phase.includes("waxing_gibbous"))
                    imgUrl =
                        "https://www.timeanddate.com/scripts/moon.php?i=12";
                else if (phase.includes("full"))
                    imgUrl =
                        "https://www.timeanddate.com/scripts/moon.php?i=16";
                else if (phase.includes("waning_gibbous"))
                    imgUrl =
                        "https://www.timeanddate.com/scripts/moon.php?i=20";
                else if (phase.includes("last_quarter"))
                    imgUrl =
                        "https://www.timeanddate.com/scripts/moon.php?i=24";
                else if (phase.includes("waning_crescent"))
                    imgUrl =
                        "https://www.timeanddate.com/scripts/moon.php?i=28";

                if (imgUrl) {
                    moonImgEl.src = imgUrl;
                    moonImgEl.alt = phase;
                    moonImgEl.style.display = "block";
                } else {
                    moonImgEl.style.display = "none";
                }
            }

            console.log("🌙 Datos lunares (Met.no):", {
                phase,
                moonriseLocal,
                moonsetLocal,
            });
        } catch (err) {
            console.error("Error al obtener datos lunares (Met.no):", err);
            document.getElementById("moon-phase-name").textContent =
                "Fase lunar: No disponible";
            document.getElementById("moonrise").textContent =
                "Salida de la luna: --";
            document.getElementById("moonset").textContent =
                "Puesta de la luna: --";
            const moonImgEl = document.getElementById("moon-image");
            if (moonImgEl) moonImgEl.style.display = "none";
        }
    }

    // === FUNCIÓN: MÉTRICAS EXTRAS ===
    async function updateExtraMetrics(lat, lon, name, temp, humidity, wind) {
        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,dew_point_2m,uv_index,pressure_msl,visibility&timezone=auto`;
            const res = await fetch(url);
            const data = await res.json();

            if (!data || !data.current) throw new Error("Datos no disponibles");

            const uv = data.current.uv_index ?? 0;
            const dew = data.current.dew_point_2m ?? "--";
            const pressure = data.current.pressure_msl ?? "--";
            const vis = data.current.visibility
                ? (data.current.visibility / 1000).toFixed(2)
                : "--";

            // === Asignar al DOM ===
            document.querySelector("#uv-level").textContent =
                uv >= 8
                    ? "Muy alto"
                    : uv >= 6
                        ? "Alto"
                        : uv >= 3
                            ? "Moderado"
                            : "Bajo";
            document.querySelector("#uv-value").textContent = uv;

            const uvBar = document.querySelector("#uv-bar-fill");
            uvBar.style.width = `${Math.min((uv / 11) * 100, 100)}%`;
            uvBar.style.background =
                uv >= 8 ? "#e63946" : uv >= 6 ? "#f1a208" : "#43aa8b";

            document.querySelector("#dew-desc").textContent =
                dew >= 20
                    ? "Sofocante"
                    : dew >= 15
                        ? "Húmedo"
                        : dew >= 10
                            ? "Confortable"
                            : "Seco";
            document.querySelector("#dew-value").textContent = `${dew}°`;

            document.querySelector("#pressure-desc").textContent =
                pressure > 1013
                    ? "Alta presión"
                    : pressure < 1000
                        ? "Baja presión"
                        : "Normal";
            document.querySelector(
                "#pressure-value"
            ).textContent = `${pressure} mb`;

            document.querySelector("#vis-desc").textContent =
                vis < 5
                    ? "Visibilidad reducida"
                    : vis < 10
                        ? "Buena visibilidad"
                        : "Excelente visibilidad";
            document.querySelector("#vis-value").textContent = `${vis} km`;

            console.log("🌡️ Métricas actualizadas correctamente para", name);
        } catch (err) {
            console.error("Error al obtener métricas extra:", err);
            document.querySelector("#uv-level").textContent = "Sin datos";
            document.querySelector("#uv-value").textContent = "--";
            document.querySelector("#dew-value").textContent = "--°";
            document.querySelector("#vis-value").textContent = "-- km";
            document.querySelector("#pressure-value").textContent = "-- mb";
        }
    }

    function updateSpecialForecasts(temp, humidity, wind, precip, symbol) {
    const hikers = document.querySelector("#hikers-desc");
    const farmers = document.querySelector("#farmers-desc");
    const marine = document.querySelector("#marine-desc");
    const astro = document.querySelector("#astro-desc");

    // 🥾 Excursionistas
    if (symbol.includes("snow") || temp < 0) {
        hikers.textContent = "Terreno cubierto de nieve, precaución en pendientes.";
    } else if (precip > 2) {
        hikers.textContent = "Lluvias ligeras, senderos resbaladizos. Lleva impermeable.";
    } else if (temp > 32) {
        hikers.textContent = "Calor intenso, hidrátate bien y evita el mediodía.";
    } else if (temp < 15) {
        hikers.textContent = "Temperatura fresca, ideal para caminatas.";
    } else {
        hikers.textContent = "Día estable, buen clima para explorar rutas.";
    }

    // 🌾 Agricultores
    if (symbol.includes("snow") || temp < 2) {
        farmers.textContent = "Condiciones inadecuadas para cultivos, riesgo de heladas.";
    } else if (precip > 5) {
        farmers.textContent = "Lluvias fuertes, riesgo de encharcamiento en cultivos.";
    } else if (precip > 2) {
        farmers.textContent = "Lluvias útiles para los cultivos.";
    } else if (humidity < 40) {
        farmers.textContent = "Baja humedad, conviene programar riego.";
    } else {
        farmers.textContent = "Condiciones normales para labores agrícolas.";
    }

    // 🌊 Navegantes
    if (symbol.includes("thunder") || wind > 25) {
        marine.textContent = "Tormentas o vientos fuertes, navegación peligrosa.";
    } else if (wind > 15) {
        marine.textContent = "Oleaje moderado, ten precaución en zonas abiertas.";
    } else {
        marine.textContent = "Mares tranquilos, condiciones ideales para navegación.";
    }

    // 🌙 Astrónomos
    if (symbol.includes("cloudy") || symbol.includes("rain") || humidity > 80) {
        astro.textContent = "Cielos cubiertos o húmedos, baja visibilidad nocturna.";
    } else {
        astro.textContent = "Cielos despejados, excelentes condiciones para observación.";
    }
}

});
