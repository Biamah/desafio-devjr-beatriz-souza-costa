<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;

class IndexController extends Controller
{
    public function index(Request $request, Response $response)
    {

        return 'Teste';
    }
}
