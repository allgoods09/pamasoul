<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Fishing Rods', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Fishing Lines', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Reels', 'created_at' => now(), 'updated_at' => now()],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        $this->command->info('Categories seeded: ' . count($categories) . ' categories');
    }
}