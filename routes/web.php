<?php

use Illuminate\Support\Facades\Route;


use App\Http\Controllers\{
    HomeController,
    RadarController,
    NoticiasController,
    RegistroController,
    EspacioController
};

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/radar', [RadarController::class, 'index'])->name('radar');
Route::get('/noticias', [NoticiasController::class, 'index'])->name('noticias');
Route::get('/registro', [RegistroController::class, 'index'])->name('registro');
Route::get('/espacio', [EspacioController::class, 'index'])->name('espacio');

