<?php

use Illuminate\Support\Facades\Route;


use App\Http\Controllers\{
    HomeController,
    RadarController,
    NoticiasController,
    RegistroController,
    EspacioController
};

Route::get('/', function () {
    return view('home');
})->name('home');

//ruta para la vista radar
Route::get('/radar', [RadarController::class, 'index'])->name('radar');
