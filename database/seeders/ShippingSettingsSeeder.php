<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ShippingSettingsSeeder extends Seeder
{
    public function run(): void
    {
        // Insert or update default shipping settings
        DB::table('settings')->updateOrInsert(
            ['key' => 'shipping.free_threshold'],
            [
                'value' => '3999',
                'group' => 'shipping',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
        
        DB::table('settings')->updateOrInsert(
            ['key' => 'shipping.base_fee'],
            [
                'value' => '250',
                'group' => 'shipping',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
        
        $this->command->info('Shipping settings seeded successfully!');
        $this->command->info('  - Free shipping threshold: ₱5,000');
        $this->command->info('  - Base shipping fee: ₱50');
    }
}