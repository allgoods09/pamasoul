<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $customers = User::where('role', 'customer')->get();
        $products = Product::all();
        
        $statuses = ['Pending', 'Paid', 'Shipped', 'Completed'];
        $paymentMethods = ['COD', 'BankTransfer'];
        
        $addresses = [
            '123 Rizal St, Makati City, Metro Manila',
            '456 Mabini St, Manila, Metro Manila',
            '789 Bonifacio St, Quezon City, Metro Manila',
            '321 Luna St, Pasig City, Metro Manila',
            '654 Aquino St, Taguig City, Metro Manila',
            '987 Roxas St, Mandaluyong City, Metro Manila',
            '147 Osmena St, Pasay City, Metro Manila',
            '258 Quirino St, Paranaque City, Metro Manila',
            '369 Magsaysay St, Caloocan City, Metro Manila',
            '741 Rizal Ave, Manila, Metro Manila',
        ];

        foreach ($customers as $customer) {
            // Each customer has 2-5 orders
            $numOrders = rand(2, 5);
            
            for ($i = 0; $i < $numOrders; $i++) {
                $numItems = rand(1, 4);
                $randomProducts = $products->random($numItems);
                
                $subtotal = 0;
                $orderItems = [];
                
                foreach ($randomProducts as $product) {
                    $quantity = rand(1, 3);
                    $itemTotal = $product->price * $quantity;
                    $subtotal += $itemTotal;
                    
                    $orderItems[] = [
                        'product_id' => $product->id,
                        'quantity' => $quantity,
                        'price_snapshot' => $product->price,
                    ];
                }
                
                $shippingFee = 50;
                $total = $subtotal + $shippingFee;
                
                $status = $statuses[array_rand($statuses)];
                $paymentMethod = $paymentMethods[array_rand($paymentMethods)];
                $address = $addresses[array_rand($addresses)];
                
                // Random date within last 60 days
                $orderDate = now()->subDays(rand(1, 60));
                
                $order = Order::create([
                    'user_id' => $customer->id,
                    'status' => $status,
                    'total' => $total,
                    'payment_method' => $paymentMethod,
                    'shipping_address' => $address,
                    'created_at' => $orderDate,
                    'updated_at' => $orderDate,
                ]);
                
                foreach ($orderItems as $item) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $item['product_id'],
                        'quantity' => $item['quantity'],
                        'price_snapshot' => $item['price_snapshot'],
                        'created_at' => $orderDate,
                        'updated_at' => $orderDate,
                    ]);
                    
                    // Reduce stock for completed orders only
                    if ($status === 'Completed') {
                        $product = Product::find($item['product_id']);
                        $product->decrement('stock', $item['quantity']);
                    }
                }
            }
        }

        $totalOrders = Order::count();
        $totalOrderItems = OrderItem::count();
        
        $this->command->info('Orders seeded: ' . $totalOrders . ' orders');
        $this->command->info('Order Items seeded: ' . $totalOrderItems . ' items');
    }
}