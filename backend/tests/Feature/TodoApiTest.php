<?php

namespace Tests\Feature;

use App\Models\Todo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TodoApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_一覧が取得できる(): void
    {
        Todo::factory()->count(3)->create();

        $response = $this->getJson('/api/todos');

        $response->assertStatus(200);
        $response->assertJsonCount(3);
    }

    public function test_新規作成できる(): void
    {
        $response = $this->postJson('/api/todos', [
            'title' => '牛乳を買う',
        ]);

        $response->assertStatus(201);
        $response->assertJsonFragment(['title' => '牛乳を買う']);
        $this->assertDatabaseHas('todos', ['title' => '牛乳を買う']);
    }

    public function test_タイトルが空だとエラーになる(): void
    {
        $response = $this->postJson('/api/todos', [
            'title' => '',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['title']);
    }

    public function test_完了フラグを更新できる(): void
    {
        $todo = Todo::factory()->create(['is_done' => false]);

        $response = $this->putJson("/api/todos/{$todo->id}", [
            'is_done' => true,
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('todos', ['id' => $todo->id, 'is_done' => true]);
    }

    public function test_削除できる(): void
    {
        $todo = Todo::factory()->create();

        $response = $this->deleteJson("/api/todos/{$todo->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('todos', ['id' => $todo->id]);
    }

    public function test_タイトルで検索できる(): void
    {
        Todo::factory()->create(['title' => '牛乳を買う']);
        Todo::factory()->create(['title' => 'レポートを書く']);

        $response = $this->getJson('/api/todos?search=牛乳');

        $response->assertStatus(200);
        $response->assertJsonCount(1);
        $response->assertJsonFragment(['title' => '牛乳を買う']);
    }

    public function test_完了状態で絞り込める(): void
    {
        Todo::factory()->create(['is_done' => true]);
        Todo::factory()->create(['is_done' => false]);

        $response = $this->getJson('/api/todos?status=done');

        $response->assertStatus(200);
        $response->assertJsonCount(1);
    }
}
