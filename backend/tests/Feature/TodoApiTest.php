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
    public function test_期限日付きで作成できる(): void
    {
        $response = $this->postJson('/api/todos', [
            'title' => 'レポート提出',
            'due_date' => '2026-09-01',
        ]);
        $response->assertStatus(201);
        $response->assertJsonFragment(['title' => 'レポート提出']);
        $this->assertDatabaseHas('todos', [
            'title' => 'レポート提出',
            'due_date' => '2026-09-01',
        ]);
    }
    public function test_期限日が不正な形式だとエラーになる(): void
    {
        $response = $this->postJson('/api/todos', [
            'title' => 'テスト',
            'due_date' => 'not-a-date',
        ]);
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['due_date']);
    }
    public function test_カテゴリ付きで作成できる(): void
    {
        $response = $this->postJson('/api/todos', [
            'title' => '企画書を書く',
            'category' => '仕事',
        ]);
        $response->assertStatus(201);
        $response->assertJsonFragment(['title' => '企画書を書く', 'category' => '仕事']);
        $this->assertDatabaseHas('todos', [
            'title' => '企画書を書く',
            'category' => '仕事',
        ]);
    }
    public function test_カテゴリで絞り込める(): void
    {
        Todo::factory()->count(2)->create(['category' => '仕事']);
        Todo::factory()->count(3)->create(['category' => 'プライベート']);
        $response = $this->getJson('/api/todos?category=仕事');
        $response->assertStatus(200);
        $response->assertJsonCount(2);
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
    public function test_複数選択して一括削除できる(): void
    {
        $todos = Todo::factory()->count(3)->create();
        $ids = $todos->pluck('id')->take(2)->toArray();

        $response = $this->deleteJson('/api/todos/bulk-delete', ['ids' => $ids]);

        $response->assertStatus(204);
        foreach ($ids as $id) {
            $this->assertDatabaseMissing('todos', ['id' => $id]);
        }
        $this->assertDatabaseCount('todos', 1);
    }
    public function test_存在しないidを含む一括削除はエラーになる(): void
    {
        $todo = Todo::factory()->create();

        $response = $this->deleteJson('/api/todos/bulk-delete', ['ids' => [$todo->id, 99999]]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['ids.1']);
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
        Todo::factory()->count(2)->done()->create();
        Todo::factory()->count(3)->create();
        $response = $this->getJson('/api/todos?status=done');
        $response->assertStatus(200);
        $response->assertJsonCount(2);
    }
    public function test_未完了で絞り込める(): void
    {
        Todo::factory()->count(2)->done()->create();
        Todo::factory()->count(3)->create();
        $response = $this->getJson('/api/todos?status=undone');
        $response->assertStatus(200);
        $response->assertJsonCount(3);
    }
}
