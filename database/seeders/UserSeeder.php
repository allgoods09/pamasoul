<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin User (created April 2024)
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@pamasoul.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'email_verified_at' => Carbon::create(2024, 4, 1),
            'created_at' => Carbon::create(2024, 4, 1),
            'updated_at' => Carbon::now(),
        ]);

        // 8 Additional Customers with registration dates spread over 24 months
        $customers = [
            [
                'name' => 'Juan Dela Cruz',
                'email' => 'juan@example.com',
                'reg_date' => Carbon::create(2024, 5, 15),
            ],
            [
                'name' => 'Maria Santos',
                'email' => 'maria@example.com',
                'reg_date' => Carbon::create(2024, 7, 20),
            ],
            [
                'name' => 'Pedro Reyes',
                'email' => 'pedro@example.com',
                'reg_date' => Carbon::create(2024, 9, 10),
            ],
            [
                'name' => 'Ana Garcia',
                'email' => 'ana@example.com',
                'reg_date' => Carbon::create(2024, 12, 5),
            ],
            [
                'name' => 'Ramon Fernandez',
                'email' => 'ramon@example.com',
                'reg_date' => Carbon::create(2025, 2, 18),
            ],
            [
                'name' => 'Cristina Lopez',
                'email' => 'cristina@example.com',
                'reg_date' => Carbon::create(2025, 5, 22),
            ],
            [
                'name' => 'Manuel Santos',
                'email' => 'manuel@example.com',
                'reg_date' => Carbon::create(2025, 8, 14),
            ],
            [
                'name' => 'Isabella Cruz',
                'email' => 'isabella@example.com',
                'reg_date' => Carbon::create(2025, 11, 30),
            ],
        ];

        foreach ($customers as $customer) {
            User::create([
                'name' => $customer['name'],
                'email' => $customer['email'],
                'password' => Hash::make('password'),
                'role' => 'customer',
                'email_verified_at' => $customer['reg_date'],
                'created_at' => $customer['reg_date'],
                'updated_at' => Carbon::now(),
            ]);
        }

        // Default customer (created March 2026 - recent)
        User::create([
            'name' => 'Customer User',
            'email' => 'customer@pamasoul.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'email_verified_at' => Carbon::create(2026, 3, 1),
            'created_at' => Carbon::create(2026, 3, 1),
            'updated_at' => Carbon::now(),
        ]);

        // Add 5 more random customers with spread out dates
        $randomCustomers = [
            ['name' => 'Marco Antonio', 'email' => 'marco@example.com', 'reg_date' => Carbon::create(2024, 6, 8)],
            ['name' => 'Sofia Reyes', 'email' => 'sofia@example.com', 'reg_date' => Carbon::create(2024, 10, 25)],
            ['name' => 'Lucas Fernandez', 'email' => 'lucas@example.com', 'reg_date' => Carbon::create(2025, 3, 12)],
            ['name' => 'Elena Gomez', 'email' => 'elena@example.com', 'reg_date' => Carbon::create(2025, 7, 19)],
            ['name' => 'Diego Morales', 'email' => 'diego@example.com', 'reg_date' => Carbon::create(2026, 1, 5)],
        ];

        foreach ($randomCustomers as $customer) {
            User::create([
                'name' => $customer['name'],
                'email' => $customer['email'],
                'password' => Hash::make('password'),
                'role' => 'customer',
                'email_verified_at' => $customer['reg_date'],
                'created_at' => $customer['reg_date'],
                'updated_at' => Carbon::now(),
            ]);
        }

        $totalUsers = User::count();
        $this->command->info('Users seeded: ' . $totalUsers . ' total users (1 admin + ' . ($totalUsers - 1) . ' customers)');
    }
}