<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            CategorySeeder::class,      // First: Categories
            ProductSeeder::class,       // Second: Products (depends on categories)
            UserSeeder::class,          // Third: Users (independent)
            CartSeeder::class,          // Fourth: Carts (depends on users & products)
            OrderSeeder::class,         // Fifth: Orders (depends on users & products)
        ]);
        
        $this->command->info('========================================');
        $this->command->info('All seeders completed successfully!');
        $this->command->info('========================================');
        $this->command->info('Categories: 3');
        $this->command->info('Products: 30');
        $this->command->info('Users: 1 Admin + 9 Customers = 10 total');
        $this->command->info('Carts: 9 (one per customer)');
        $this->command->info('Orders: ~20-50 orders with items');
        $this->command->info('========================================');
    }
}