<?php
use App\Http\Controllers\Api\TodoController;
use Illuminate\Support\Facades\Route;

Route::delete('/todos/bulk-delete', [TodoController::class, 'bulkDestroy']);
Route::apiResource('todos', TodoController::class)->except(['show']);
