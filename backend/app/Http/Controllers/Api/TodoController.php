<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Todo;
use Illuminate\Http\Request;

class TodoController extends Controller
{
    /**
     * 一覧取得
     */
    public function index()
    {
        return Todo::orderBy('created_at', 'desc')->get();
    }

    /**
     * 新規作成
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $todo = Todo::create($validated);

        return response()->json($todo, 201);
    }

    /**
     * 詳細取得（今回は未使用）
     */
    public function show(Todo $todo)
    {
        //
    }

    /**
     * 更新（完了フラグの切り替えなど）
     */
    public function update(Request $request, Todo $todo)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'is_done' => 'sometimes|boolean',
        ]);

        $todo->update($validated);

        return response()->json($todo);
    }

    /**
     * 削除
     */
    public function destroy(Todo $todo)
    {
        $todo->delete();

        return response()->json(null, 204);
    }
}
