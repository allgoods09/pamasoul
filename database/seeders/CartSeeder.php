<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;

class CartSeeder extends Seeder
{
    public function run(): void
    {
        // Get all customer users (excluding admin and demo accounts)
        // Exclude admin@pamasoul.com and customer@pamasoul.com
        $customers = User::where('role', 'customer')
            ->whereNotIn('email', ['customer@pamasoul.com'])
            ->get();
        
        $products = Product::all();

        foreach ($customers as $customer) {
            // Create cart for each customer
            $cart = Cart::create([
                'user_id' => $customer->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Add random items to cart (1-5 items per customer)
            $numItems = rand(1, 5);
            $randomProducts = $products->random(min($numItems, $products->count()));

            foreach ($randomProducts as $product) {
                $quantity = rand(1, 3);
                CartItem::create([
                    'cart_id' => $cart->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'price_snapshot' => $product->price,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $this->command->info('Carts seeded: ' . $customers->count() . ' carts with items');
    }
}