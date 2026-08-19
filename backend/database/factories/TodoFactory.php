<?php

namespace Database\Factories;

use App\Models\Todo;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Todo>
 */
class TodoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->randomElement([
                '牛乳を買う',
                'レポートを書く',
                '掃除をする',
                'メールを返信する',
                '本を返却する',
                '歯医者の予約をする',
                '洗濯をする',
                '会議の資料を作る',
                'ジムに行く',
                '請求書を確認する',
            ]),
            'is_done' => false,
        ];
    }
}
