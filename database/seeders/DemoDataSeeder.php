<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Hash;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        // Create categories if not exists
        $categories = [
            ['name' => 'Fishing Rods'],
            ['name' => 'Fishing Lines'],
            ['name' => 'Reels'],
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(['name' => $cat['name']], $cat);
        }

        // Get category IDs
        $rodsId = Category::where('name', 'Fishing Rods')->first()->id;
        $linesId = Category::where('name', 'Fishing Lines')->first()->id;
        $reelsId = Category::where('name', 'Reels')->first()->id;

        // Create demo products with PHP prices (₱58 = $1 USD)
        $products = [
            // FISHING RODS (Category 1) - 11 items
            [
                'name' => 'Bass Pro Carbon X Rod',
                'description' => 'High-quality carbon fiber fishing rod, lightweight and durable. Perfect for bass fishing.',
                'price' => 5219.00,
                'stock' => 15,
                'category_id' => $rodsId,
                'image' => 'https://assets.basspro.com/image/list/fn_select:jq:first(.%5B%5D%7Cselect(.public_id%20%7C%20endswith(%22main%22)))/2455098.json',
                'created_at' => now()->subDays(15),
                'updated_at' => now(),
            ],
            [
                'name' => 'Shimano Zodias Casting Rod',
                'description' => 'Premium casting rod with sensitive tip and powerful backbone.',
                'price' => 11599.00,
                'stock' => 8,
                'category_id' => $rodsId,
                'image' => 'https://sportsheadquarters.ca/cdn/shop/products/image_f349c37a-4ef5-4914-9996-53cb2355fa97.jpg?v=1597347477',
                'created_at' => now()->subDays(14),
                'updated_at' => now(),
            ],
            [
                'name' => 'Ugly Stik GX2 Spinning Rod',
                'description' => 'Tough and durable spinning rod, great for beginners and pros alike.',
                'price' => 2899.00,
                'stock' => 3,
                'category_id' => $rodsId,
                'image' => 'https://images.unsplash.com/photo-1594149965000-d6f3979c0e1a?w=400',
                'created_at' => now()->subDays(13),
                'updated_at' => now(),
            ],
            [
                'name' => 'St. Croix Triumph Rod',
                'description' => 'Premium rod with excellent sensitivity and strength.',
                'price' => 8699.00,
                'stock' => 12,
                'category_id' => $rodsId,
                'image' => 'https://images.unsplash.com/photo-1594149965000-d6f3979c0e1a?w=400',
                'created_at' => now()->subDays(12),
                'updated_at' => now(),
            ],
            [
                'name' => 'Penn Battalion Casting Rod',
                'description' => 'Heavy-duty rod designed for saltwater fishing. Built with durable graphite composite.',
                'price' => 7539.00,
                'stock' => 8,
                'category_id' => $rodsId,
                'image' => '',
                'created_at' => now()->subDays(11),
                'updated_at' => now(),
            ],
            [
                'name' => 'Daiwa Crossfire Spinning Rod',
                'description' => 'Affordable yet reliable spinning rod with fiberglass construction.',
                'price' => 2319.00,
                'stock' => 20,
                'category_id' => $rodsId,
                'image' => '',
                'created_at' => now()->subDays(10),
                'updated_at' => now(),
            ],
            [
                'name' => 'Gloomis NRX+ Fly Rod',
                'description' => 'Premium fly rod with advanced graphite technology. Ultra-sensitive.',
                'price' => 34799.00,
                'stock' => 4,
                'category_id' => $rodsId,
                'image' => '',
                'created_at' => now()->subDays(9),
                'updated_at' => now(),
            ],
            [
                'name' => 'Okuma Celilo Trout Rod',
                'description' => 'Light-action rod perfect for trout fishing. Great for beginners.',
                'price' => 2029.00,
                'stock' => 15,
                'category_id' => $rodsId,
                'image' => '',
                'created_at' => now()->subDays(8),
                'updated_at' => now(),
            ],
            [
                'name' => 'Fenwick HMG Spinning Rod',
                'description' => 'High-quality rod with aluminum oxide guides and cork handle.',
                'price' => 6959.00,
                'stock' => 6,
                'category_id' => $rodsId,
                'image' => '',
                'created_at' => now()->subDays(7),
                'updated_at' => now(),
            ],

            // FISHING LINES (Category 2) - 11 items
            [
                'name' => 'PowerPro Spectra Braided Line',
                'description' => 'Super strong braided fishing line, zero stretch, high sensitivity.',
                'price' => 1739.00,
                'stock' => 25,
                'category_id' => $linesId,
                'image' => 'https://images.unsplash.com/photo-1604334822364-97b6d8be9d31?w=400',
                'created_at' => now()->subDays(14),
                'updated_at' => now(),
            ],
            [
                'name' => 'Seaguar Red Label Fluorocarbon',
                'description' => 'High-quality fluorocarbon line, nearly invisible underwater.',
                'price' => 1449.00,
                'stock' => 18,
                'category_id' => $linesId,
                'image' => 'https://images.unsplash.com/photo-1604334822364-97b6d8be9d31?w=400',
                'created_at' => now()->subDays(13),
                'updated_at' => now(),
            ],
            [
                'name' => 'Berkley Trilene Monofilament',
                'description' => 'Classic monofilament line, great all-purpose fishing line.',
                'price' => 753.00,
                'stock' => 2,
                'category_id' => $linesId,
                'image' => 'https://images.unsplash.com/photo-1604334822364-97b6d8be9d31?w=400',
                'created_at' => now()->subDays(12),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sufix 832 Braided Line',
                'description' => 'Advanced braided line with GORE performance fibers. Superior abrasion resistance.',
                'price' => 2029.00,
                'stock' => 30,
                'category_id' => $linesId,
                'image' => '',
                'created_at' => now()->subDays(11),
                'updated_at' => now(),
            ],
            [
                'name' => 'Yo-Zuri Hybrid Line',
                'description' => 'Combines fluorocarbon and nylon for best of both worlds.',
                'price' => 1159.00,
                'stock' => 22,
                'category_id' => $linesId,
                'image' => '',
                'created_at' => now()->subDays(10),
                'updated_at' => now(),
            ],
            [
                'name' => 'Spiderwire Stealth Braid',
                'description' => 'Smooth-casting braided line with durability coating.',
                'price' => 1629.00,
                'stock' => 18,
                'category_id' => $linesId,
                'image' => '',
                'created_at' => now()->subDays(9),
                'updated_at' => now(),
            ],
            [
                'name' => 'Ande Monofilament',
                'description' => 'Tournament-proven monofilament with high knot strength.',
                'price' => 579.00,
                'stock' => 45,
                'category_id' => $linesId,
                'image' => '',
                'created_at' => now()->subDays(8),
                'updated_at' => now(),
            ],
            [
                'name' => 'P-Line Fluorocarbon',
                'description' => '100% fluorocarbon line with low visibility and high sensitivity.',
                'price' => 1275.00,
                'stock' => 12,
                'category_id' => $linesId,
                'image' => '',
                'created_at' => now()->subDays(7),
                'updated_at' => now(),
            ],
            [
                'name' => 'Varivas Braided Line',
                'description' => 'Japanese-made premium braided line for professional anglers.',
                'price' => 2319.00,
                'stock' => 8,
                'category_id' => $linesId,
                'image' => '',
                'created_at' => now()->subDays(6),
                'updated_at' => now(),
            ],

            // FISHING REELS (Category 3) - 11 items
            [
                'name' => 'Shimano Stradic CI4+',
                'description' => 'Premium spinning reel with smooth drag and lightweight design.',
                'price' => 14499.00,
                'stock' => 6,
                'category_id' => $reelsId,
                'image' => 'https://images.unsplash.com/photo-1589702540440-87e75be1fdf2?w=400',
                'created_at' => now()->subDays(14),
                'updated_at' => now(),
            ],
            [
                'name' => 'Daiwa Tatula Baitcasting Reel',
                'description' => 'High-performance baitcasting reel with smooth casting.',
                'price' => 10439.00,
                'stock' => 10,
                'category_id' => $reelsId,
                'image' => 'https://images.unsplash.com/photo-1589702540440-87e75be1fdf2?w=400',
                'created_at' => now()->subDays(13),
                'updated_at' => now(),
            ],
            [
                'name' => 'Pflueger President Spinning Reel',
                'description' => 'Great value spinning reel with smooth operation.',
                'price' => 3479.00,
                'stock' => 1,
                'category_id' => $reelsId,
                'image' => 'https://images.unsplash.com/photo-1589702540440-87e75be1fdf2?w=400',
                'created_at' => now()->subDays(12),
                'updated_at' => now(),
            ],
            [
                'name' => 'Abu Garcia Revo SX',
                'description' => 'Versatile baitcasting reel with durable construction.',
                'price' => 9279.00,
                'stock' => 7,
                'category_id' => $reelsId,
                'image' => 'https://images.unsplash.com/photo-1589702540440-87e75be1fdf2?w=400',
                'created_at' => now()->subDays(11),
                'updated_at' => now(),
            ],
            [
                'name' => 'Penn Battle III Spinning Reel',
                'description' => 'Saltwater-rated reel with full metal body and carbon fiber drag.',
                'price' => 7539.00,
                'stock' => 12,
                'category_id' => $reelsId,
                'image' => '',
                'created_at' => now()->subDays(10),
                'updated_at' => now(),
            ],
            [
                'name' => 'Lew\'s Mach Crush Baitcaster',
                'description' => 'High-speed baitcasting reel with double-bearing supported pinion.',
                'price' => 11599.00,
                'stock' => 5,
                'category_id' => $reelsId,
                'image' => '',
                'created_at' => now()->subDays(9),
                'updated_at' => now(),
            ],
            [
                'name' => 'KastKing Sharky III',
                'description' => 'Waterproof spinning reel with carbon fiber drag system.',
                'price' => 3189.00,
                'stock' => 25,
                'category_id' => $reelsId,
                'image' => '',
                'created_at' => now()->subDays(8),
                'updated_at' => now(),
            ],
            [
                'name' => 'Okuma Ceymar Spinning Reel',
                'description' => 'Lightweight reel with precision-machined brass gears.',
                'price' => 2899.00,
                'stock' => 14,
                'category_id' => $reelsId,
                'image' => '',
                'created_at' => now()->subDays(7),
                'updated_at' => now(),
            ],
            [
                'name' => 'Shimano Curado DC Baitcaster',
                'description' => 'Digital control braking system for consistent casting.',
                'price' => 17399.00,
                'stock' => 3,
                'category_id' => $reelsId,
                'image' => '',
                'created_at' => now()->subDays(6),
                'updated_at' => now(),
            ],
            [
                'name' => 'Daiwa BG Spinning Reel',
                'description' => 'Legendary saltwater reel with rugged design.',
                'price' => 8699.00,
                'stock' => 9,
                'category_id' => $reelsId,
                'image' => '',
                'created_at' => now()->subDays(5),
                'updated_at' => now(),
            ],
            [
                'name' => '13 Fishing Concept Z Baitcaster',
                'description' => 'Unique gearless design for silent operation.',
                'price' => 10439.00,
                'stock' => 6,
                'category_id' => $reelsId,
                'image' => '',
                'created_at' => now()->subDays(4),
                'updated_at' => now(),
            ],
            [
                'name' => 'Quantum Reliance Spinning Reel',
                'description' => 'Smooth drag system with 10 stainless steel bearings.',
                'price' => 4059.00,
                'stock' => 11,
                'category_id' => $reelsId,
                'image' => '',
                'created_at' => now()->subDays(3),
                'updated_at' => now(),
            ],
        ];

        foreach ($products as $product) {
            Product::updateOrCreate(
                ['name' => $product['name']],
                $product
            );
        }

        // Get customer user
        $customer = User::where('email', 'customer@pamasoul.com')->first();
        
        if ($customer) {
            // Create some orders for the customer
            // Order 1 - Completed
            $order1 = Order::create([
                'user_id' => $customer->id,
                'status' => 'Completed',
                'total' => 319.97,
                'payment_method' => 'COD',
                'shipping_address' => '123 Customer St, Manila, Philippines',
                'created_at' => now()->subDays(5),
            ]);
            
            OrderItem::create([
                'order_id' => $order1->id,
                'product_id' => Product::where('name', 'Bass Pro Carbon X Rod')->first()->id,
                'quantity' => 1,
                'price_snapshot' => 89.99,
            ]);
            
            OrderItem::create([
                'order_id' => $order1->id,
                'product_id' => Product::where('name', 'PowerPro Spectra Braided Line')->first()->id,
                'quantity' => 2,
                'price_snapshot' => 29.99,
            ]);
            
            // Order 2 - Pending
            $order2 = Order::create([
                'user_id' => $customer->id,
                'status' => 'Pending',
                'total' => 249.99,
                'payment_method' => 'BankTransfer',
                'shipping_address' => '123 Customer St, Manila, Philippines',
                'created_at' => now()->subDays(2),
            ]);
            
            OrderItem::create([
                'order_id' => $order2->id,
                'product_id' => Product::where('name', 'Shimano Stradic CI4+')->first()->id,
                'quantity' => 1,
                'price_snapshot' => 249.99,
            ]);
            
            // Order 3 - Shipped
            $order3 = Order::create([
                'user_id' => $customer->id,
                'status' => 'Shipped',
                'total' => 229.98,
                'payment_method' => 'COD',
                'shipping_address' => '456 Another St, Cebu, Philippines',
                'created_at' => now()->subDay(),
            ]);
            
            OrderItem::create([
                'order_id' => $order3->id,
                'product_id' => Product::where('name', 'Daiwa Tatula Baitcasting Reel')->first()->id,
                'quantity' => 1,
                'price_snapshot' => 179.99,
            ]);
            
            OrderItem::create([
                'order_id' => $order3->id,
                'product_id' => Product::where('name', 'Seaguar Red Label Fluorocarbon')->first()->id,
                'quantity' => 2,
                'price_snapshot' => 24.99,
            ]);
        }

        $this->command->info('Demo data seeded successfully!');
        $this->command->info('Added: 30 products with PHP prices');
        $this->command->info('Categories: Fishing Rods, Fishing Lines, Reels');
    }
}