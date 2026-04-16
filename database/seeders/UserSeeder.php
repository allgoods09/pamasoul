<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin User
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@pamasoul.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 8 Additional Customers
        $customers = [
            [
                'name' => 'Juan Dela Cruz',
                'email' => 'juan@example.com',
                'address' => '123 Rizal St, Makati City',
                'phone' => '09123456789',
            ],
            [
                'name' => 'Maria Santos',
                'email' => 'maria@example.com',
                'address' => '456 Mabini St, Manila',
                'phone' => '09234567890',
            ],
            [
                'name' => 'Pedro Reyes',
                'email' => 'pedro@example.com',
                'address' => '789 Bonifacio St, Quezon City',
                'phone' => '09345678901',
            ],
            [
                'name' => 'Ana Garcia',
                'email' => 'ana@example.com',
                'address' => '321 Luna St, Pasig City',
                'phone' => '09456789012',
            ],
            [
                'name' => 'Ramon Fernandez',
                'email' => 'ramon@example.com',
                'address' => '654 Aquino St, Taguig',
                'phone' => '09567890123',
            ],
            [
                'name' => 'Cristina Lopez',
                'email' => 'cristina@example.com',
                'address' => '987 Roxas St, Mandaluyong',
                'phone' => '09678901234',
            ],
            [
                'name' => 'Manuel Santos',
                'email' => 'manuel@example.com',
                'address' => '147 Osmena St, Pasay',
                'phone' => '09789012345',
            ],
            [
                'name' => 'Isabella Cruz',
                'email' => 'isabella@example.com',
                'address' => '258 Quirino St, Paranaque',
                'phone' => '09890123456',
            ],
        ];

        foreach ($customers as $customer) {
            User::create([
                'name' => $customer['name'],
                'email' => $customer['email'],
                'password' => Hash::make('password'),
                'role' => 'customer',
                'email_verified_at' => now(),
                'created_at' => now()->subDays(rand(1, 60)),
                'updated_at' => now(),
            ]);
        }

        // Default customer (from original seeder)
        User::create([
            'name' => 'Customer User',
            'email' => 'customer@pamasoul.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->command->info('Users seeded: 1 admin + 9 customers = 10 total users');
    }
}