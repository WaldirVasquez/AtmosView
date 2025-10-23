<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class EspacioController extends Controller
{
    public function index()
    {
        return view('espacio');
    }
}
