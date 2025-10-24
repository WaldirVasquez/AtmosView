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
                <div class="detail-icon">🌧️</div>
                <div class="detail-label">Precipitación</div>
                <div class="detail-value">Obteniendo datos....</div>
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

        <!-- Pronóstico diario -->
        <section class="forecast-daily-section">
            <h2 class="section-title">Pronóstico diario (7 días)</h2>
            <div class="forecast-grid"></div>
        </section>


    </div>
</div>

@push('scripts')
@vite('resources/js/clima.js')
@endpush
@endsection