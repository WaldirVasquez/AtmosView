@extends('layouts.app')

@section('title', 'Inicio')

@push('styles')
    @vite('resources/css/clima.css')
@endpush

@section('content')
    <div class="container">
        <!-- Buscador -->
        <div class="weather-search">
            <div class="search-wrapper">
                <input id="cityInput" type="text" placeholder="Buscar ciudad..." class="city-input" autocomplete="off">
                <div id="suggestions" class="suggestions-list"></div>
            </div>
            <button id="searchBtn">Buscar</button>
            <button id="geoBtn" title="Usar mi ubicación actual">📍</button>
        </div>

        <div class="weather-card">
            <!-- Header -->
            <div class="header">
                <div class="location-info">
                    <h1>Obteniendo datos....</h1>
                    <div class="time-badge">
                        <span>🕐</span>
                        <span>Obteniendo datos....</span>
                    </div>
                    <div class="description-badge">
                        <span>⚡</span>
                        <span>Obteniendo datos....</span>
                    </div>
                </div>
                <div class="weather-main">
                    <div class="weather-icon">Obteniendo datos....</div>
                    <div class="temperature">Obteniendo datos....</div>
                    <div class="condition">Obteniendo datos....</div>
                </div>
            </div>

            <!-- Weather Details -->
            <div class="details-grid">
                <div class="detail-card">
                    <div class="detail-icon">💧</div>
                    <div class="detail-label">Humedad</div>
                    <div class="detail-value">Obteniendo datos....</div>
                </div>
<div class="detail-card">
    <div class="detail-icon">
        <img id="precip-icon" alt="Precipitación" width="40" height="40">
    </div>
    <div class="detail-label">Precipitación</div>
    <div class="detail-value">Obteniendo datos...</div>
</div>

                <div class="detail-card">
                    <div class="detail-icon">💨</div>
                    <div class="detail-label">Viento</div>
                    <div class="detail-value">Obteniendo datos....</div>
                </div>
            </div>

            <!-- Variations Section -->
            <div class="variations-section">
                <h2 class="section-title">Variación Horaria</h2>
                <div class="tabs">
                    <button class="tab active" onclick="showTab('temperature')">Temperatura</button>
                    <button class="tab" onclick="showTab('wind')">Viento</button>
                    <button class="tab" onclick="showTab('precipitation')">Precipitación</button>
                </div>

                <!-- Temperature Variation -->
                <div id="temperature" class="variation-content active">
                    <div class="variation-header">
                        <span class="variation-title">Variación de temperatura</span>
                        <span class="variation-range">32° / 28°</span>
                    </div>
                    <div class="variation-item">
                        <span class="time-label">12:00</span>
                        <div class="progress-bar">
                            <div class="progress-fill temperature-progress" style="width: 40%"></div>
                        </div>
                        <span class="value-label">28°</span>
                    </div>
                    <div class="variation-item">
                        <span class="time-label">13:00</span>
                        <div class="progress-bar">
                            <div class="progress-fill temperature-progress" style="width: 60%"></div>
                        </div>
                        <span class="value-label">30°</span>
                    </div>
                    <div class="variation-item">
                        <span class="time-label">14:00</span>
                        <div class="progress-bar">
                            <div class="progress-fill temperature-progress" style="width: 80%"></div>
                        </div>
                        <span class="value-label">31°</span>
                    </div>
                    <div class="variation-item">
                        <span class="time-label">15:00</span>
                        <div class="progress-bar">
                            <div class="progress-fill temperature-progress" style="width: 100%"></div>
                        </div>
                        <span class="value-label">32°</span>
                    </div>
                    <div class="variation-item">
                        <span class="time-label">16:00</span>
                        <div class="progress-bar">
                            <div class="progress-fill temperature-progress" style="width: 80%"></div>
                        </div>
                        <span class="value-label">31°</span>
                    </div>
                    <div class="variation-item">
                        <span class="time-label">17:00</span>
                        <div class="progress-bar">
                            <div class="progress-fill temperature-progress" style="width: 60%"></div>
                        </div>
                        <span class="value-label">30°</span>
                    </div>
                    <div class="variation-item">
                        <span class="time-label">18:00</span>
                        <div class="progress-bar">
                            <div class="progress-fill temperature-progress" style="width: 40%"></div>
                        </div>
                        <span class="value-label">29°</span>
                    </div>
                </div>

                <!-- Wind Variation -->
                <div id="wind" class="variation-content">
                    <div class="variation-header">
                        <span class="variation-title">Variación de viento</span>
                        <span class="variation-range">5 km/h / 1 km/h</span>
                    </div>
                    <div class="variation-item">
                        <span class="time-label">12:00</span>
                        <div class="progress-bar">
                            <div class="progress-fill wind-progress" style="width: 20%"></div>
                        </div>
                        <span class="value-label">2 km/h</span>
                    </div>
                    <div class="variation-item">
                        <span class="time-label">13:00</span>
                        <div class="progress-bar">
                            <div class="progress-fill wind-progress" style="width: 40%"></div>
                        </div>
                        <span class="value-label">3 km/h</span>
                    </div>
                    <div class="variation-item">
                        <span class="time-label">14:00</span>
                        <div class="progress-bar">
                            <div class="progress-fill wind-progress" style="width: 60%"></div>
                        </div>
                        <span class="value-label">4 km/h</span>
                    </div>
                    <div class="variation-item">
                        <span class="time-label">15:00</span>
                        <div class="progress-bar">
                            <div class="progress-fill wind-progress" style="width: 100%"></div>
                        </div>
                        <span class="value-label">5 km/h</span>
                    </div>
                    <div class="variation-item">
                        <span class="time-label">16:00</span>
                        <div class="progress-bar">
                            <div class="progress-fill wind-progress" style="width: 40%"></div>
                        </div>
                        <span class="value-label">3 km/h</span>
                    </div>
                    <div class="variation-item">
                        <span class="time-label">17:00</span>
                        <div class="progress-bar">
                            <div class="progress-fill wind-progress" style="width: 20%"></div>
                        </div>
                        <span class="value-label">2 km/h</span>
                    </div>
                    <div class="variation-item">
                        <span class="time-label">18:00</span>
                        <div class="progress-bar">
                            <div class="progress-fill wind-progress" style="width: 10%"></div>
                        </div>
                        <span class="value-label">1 km/h</span>
                    </div>
                </div>

                <!-- Precipitation Variation -->
                <div id="precipitation" class="variation-content">
                    <div class="variation-header">
                        <span class="variation-title">Probabilidad de precipitación</span>
                        <span class="variation-range">60% / 10%</span>
                    </div>
                    <div class="variation-item">
                        <span class="time-label">12:00</span>
                        <div class="progress-bar">
                            <div class="progress-fill precipitation-progress" style="width: 17%"></div>
                        </div>
                        <span class="value-label">10%</span>
                    </div>
                    <div class="variation-item">
                        <span class="time-label">13:00</span>
                        <div class="progress-bar">
                            <div class="progress-fill precipitation-progress" style="width: 33%"></div>
                        </div>
                        <span class="value-label">20%</span>
                    </div>
                    <div class="variation-item">
                        <span class="time-label">14:00</span>
                        <div class="progress-bar">
                            <div class="progress-fill precipitation-progress" style="width: 67%"></div>
                        </div>
                        <span class="value-label">40%</span>
                    </div>
                    <div class="variation-item">
                        <span class="time-label">15:00</span>
                        <div class="progress-bar">
                            <div class="progress-fill precipitation-progress" style="width: 100%"></div>
                        </div>
                        <span class="value-label">60%</span>
                    </div>
                    <div class="variation-item">
                        <span class="time-label">16:00</span>
                        <div class="progress-bar">
                            <div class="progress-fill precipitation-progress" style="width: 83%"></div>
                        </div>
                        <span class="value-label">50%</span>
                    </div>
                    <div class="variation-item">
                        <span class="time-label">17:00</span>
                        <div class="progress-bar">
                            <div class="progress-fill precipitation-progress" style="width: 50%"></div>
                        </div>
                        <span class="value-label">30%</span>
                    </div>
                    <div class="variation-item">
                        <span class="time-label">18:00</span>
                        <div class="progress-bar">
                            <div class="progress-fill precipitation-progress" style="width: 33%"></div>
                        </div>
                        <span class="value-label">20%</span>
                    </div>
                </div>
            </div>

            <!-- Pronóstico por hora -->

            <div class="forecast-hourly-section">
                <h2 class="section-title" id="hourlyTitle">Pronóstico por hora — </h2>
                <div class="forecast-hourly-container">
                    <div class="forecast-hourly-grid" id="hourlyForecast"></div>
                </div>
            </div>

            <section id="daily-diagnostic" class="diagnostic-card">
                <div class="diagnostic-content">
                    <h3>Diagnóstico del día</h3>
                    <p id="diagnostic-text">Analizando condiciones...</p>
                </div>
            </section>


            <!-- Pronóstico diario -->
            <section class="forecast-daily-section">
                <h2 class="section-title">Pronóstico diario (7 días)</h2>
                <div class="forecast-grid"></div>
            </section>
        </div>

        <section class="astro-section">
            <!-- Sol -->
            <div class="astro-card">
                <h3>☀️ Sol</h3>
                <svg id="solar-curve" viewBox="0 0 100 50" preserveAspectRatio="none">
                    <path d="M0,40 Q50,0 100,40" fill="none" stroke="#ffcc33" stroke-width="2" />
                    <circle id="sun" cx="0" cy="40" r="3" fill="#ffcc33" />
                </svg>
                <div class="astro-info">
                    <p id="sunrise">Amanecer: --:--</p>
                    <p id="sunset">Atardecer: --:--</p>
                    <p id="day-length">Duración: -- h</p>
                </div>
            </div>

            <!-- Luna -->
            <!-- Luna -->
            <div class="astro-card moon-card">
                <h3>🌙 Luna</h3>
                <div class="moon-visual">
                    <img id="moon-image" src="" alt="Fase lunar" />
                    <div class="moon-info">
                        <p id="moon-phase-name">Fase lunar: --</p>
                        <p id="moonrise">Salida de la luna: --:--</p>
                        <p id="moonset">Puesta de la luna: --:--</p>
                    </div>
                </div>
            </div>

        </section>


        <section id="extra-metrics" class="metrics-grid">
            <div class="metric-card uv">
                <div class="metric-header">
                    <svg class="metric-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="1.5">
                        <circle cx="12" cy="12" r="5"></circle>
                        <path
                            d="M12 1v2M12 21v2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M1 12h2M21 12h2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" />
                    </svg>
                    <h4>Índice UV</h4>
                </div>
                <p id="uv-level">Cargando...</p>
                <div class="uv-bar">
                    <div id="uv-bar-fill"></div>
                </div>
                <span id="uv-value" class="metric-big-value">--</span>
            </div>

            <div class="metric-card dew">
                <div class="metric-header">
                    <svg class="metric-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" />
                    </svg>
                    <h4>Punto de rocío</h4>
                </div>
                <p id="dew-desc">Calculando...</p>
                <span id="dew-value" class="metric-big-value">--°</span>
            </div>

            <div class="metric-card vis">
                <div class="metric-header">
                    <svg class="metric-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="1.8">
                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                    <h4>Visibilidad</h4>
                </div>
                <p id="vis-desc">Analizando...</p>
                <span id="vis-value" class="metric-big-value">-- km</span>
            </div>

            <div class="metric-card pressure">
                <div class="metric-header">
                    <svg class="metric-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="1.5">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 3" />
                    </svg>
                    <h4>Presión</h4>
                </div>
                <p id="pressure-desc">Calculando...</p>
                <span id="pressure-value" class="metric-big-value">-- mb</span>
            </div>
        </section>

        <section id="special-forecast" class="special-grid">
            <!-- Excursionistas -->
            <div class="special-card hikers">
                <div class="special-header">
                    <svg class="special-icon" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="1.8"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 3a2 2 0 1 0 6 0 2 2 0 0 0-6 0zM10 22v-4l-2-4 3-3 3 2 2 9" />
                        <path d="M13 12h2l4 8" />
                    </svg>
                    <h4>Clima para excursionistas</h4>
                </div>
                <p id="hikers-desc">Analizando condiciones...</p>
            </div>

            <!-- Agricultores -->
            <div class="special-card farmers">
                <div class="special-header">
                    <svg class="special-icon" viewBox="0 0 24 24" fill="none" stroke="#facc15" stroke-width="1.8"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M2 16s3-5 10-5 10 5 10 5" />
                        <path d="M2 20s3-5 10-5 10 5 10 5" />
                        <line x1="12" y1="11" x2="12" y2="22" />
                    </svg>
                    <h4>Pronóstico para agricultores</h4>
                </div>
                <p id="farmers-desc">Analizando condiciones...</p>
            </div>

            <!-- Navegantes -->
            <div class="special-card marine">
                <div class="special-header">
                    <svg class="special-icon" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="1.8"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M2 20c3-2 6-2 10 0s7 2 10 0" />
                        <path d="M2 14c3-2 6-2 10 0s7 2 10 0" />
                        <path d="M12 2v8" />
                    </svg>
                    <h4>Clima marino para navegantes</h4>
                </div>
                <p id="marine-desc">Analizando condiciones...</p>
            </div>

            <!-- Astrónomos -->
            <div class="special-card astro">
                <div class="special-header">
                    <svg class="special-icon" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="1.8"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                    <h4>Observadores del cielo</h4>
                </div>
                <p id="astro-desc">Analizando condiciones...</p>
            </div>
        </section>
    </div>

    @push('scripts')
        @vite('resources/js/clima.js')
    @endpush
    
@endsection