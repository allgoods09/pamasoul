<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Carbon\Carbon;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        // Get shipping config values
        $freeThreshold = config('shipping.free_threshold', 5000);
        $baseFee = config('shipping.base_fee', 50);
        
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

        $orderCount = 0;
        $totalOrdersRevenue = 0;

        // Generate orders spanning 24 months (April 2024 - April 2026)
        $startDate = Carbon::create(2024, 4, 1);
        $endDate = Carbon::now();
        
        // Seasonal multipliers (higher sales during peak months)
        $seasonalMultipliers = [
            1 => 0.7,  // January (post-holiday slow)
            2 => 0.7,  // February (slow)
            3 => 0.8,  // March (pre-summer)
            4 => 1.2,  // April (summer starts)
            5 => 1.3,  // May (summer peak)
            6 => 1.4,  // June (summer peak)
            7 => 1.2,  // July (still summer)
            8 => 1.1,  // August (winding down)
            9 => 0.8,  // September (slow)
            10 => 0.8, // October (slow)
            11 => 1.0, // November (pre-holiday)
            12 => 1.5, // December (holiday peak)
        ];

        foreach ($customers as $customer) {
            // Get customer registration date
            $customerRegDate = Carbon::parse($customer->created_at);
            
            // Determine how many orders based on customer age and random factor
            $monthsAsCustomer = max(1, $customerRegDate->diffInMonths($endDate));
            $baseOrdersPerMonth = 0.3; // Average 0.3 orders per month (~3-4 per year)
            $expectedOrders = round($monthsAsCustomer * $baseOrdersPerMonth * rand(8, 12) / 10);
            $numOrders = max(1, min($expectedOrders, 15)); // Between 1-15 orders per customer
            
            for ($i = 0; $i < $numOrders; $i++) {
                // Random date between customer registration and now
                $maxDate = min($endDate, Carbon::now());
                $orderDate = Carbon::createFromTimestamp(rand(
                    $customerRegDate->copy()->startOfMonth()->timestamp,
                    $maxDate->timestamp
                ));
                
                // Apply seasonal multiplier for this month
                $monthMultiplier = $seasonalMultipliers[$orderDate->month] ?? 1.0;
                
                // Determine number of items (1-5, with more during peak seasons)
                $numItems = rand(1, 5);
                $randomProducts = $products->random(min($numItems, $products->count()));
                
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
                
                // Calculate shipping using config
                $shippingFee = $subtotal >= $freeThreshold ? 0 : $baseFee;
                $total = $subtotal + $shippingFee;
                
                // Determine status based on order age
                $daysOld = $orderDate->diffInDays(Carbon::now());
                $status = $this->determineStatus($daysOld, $orderDate);
                
                $paymentMethod = $paymentMethods[array_rand($paymentMethods)];
                $address = $addresses[array_rand($addresses)];
                
                // Create timestamps based on status
                $timestamps = $this->getStatusTimestamps($orderDate, $status);
                
                $order = Order::create([
                    'user_id' => $customer->id,
                    'status' => $status,
                    'total' => $total,
                    'payment_method' => $paymentMethod,
                    'shipping_address' => $address,
                    'created_at' => $timestamps['created_at'],
                    'updated_at' => $timestamps['updated_at'],
                ]);
                
                foreach ($orderItems as $item) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $item['product_id'],
                        'quantity' => $item['quantity'],
                        'price_snapshot' => $item['price_snapshot'],
                        'created_at' => $timestamps['created_at'],
                        'updated_at' => $timestamps['updated_at'],
                    ]);
                    
                    // Reduce stock only for completed orders
                    if ($status === 'Completed') {
                        $product = Product::find($item['product_id']);
                        if ($product && $product->stock >= $item['quantity']) {
                            $product->decrement('stock', $item['quantity']);
                        }
                    }
                }
                
                $orderCount++;
                $totalOrdersRevenue += $total;
            }
        }

        $this->command->info('Orders seeded: ' . $orderCount . ' orders');
        $this->command->info('Total revenue: ₱' . number_format($totalOrdersRevenue, 2));
        $this->command->info('Average order value: ₱' . number_format($totalOrdersRevenue / max(1, $orderCount), 2));
    }
    
    private function determineStatus($daysOld, $orderDate)
    {
        // Orders older than 30 days are completed
        if ($daysOld > 30) {
            return 'Completed';
        }
        // Orders older than 14 days but less than 30 are shipped
        if ($daysOld > 14) {
            return 'Shipped';
        }
        // Orders older than 7 days but less than 14 are paid
        if ($daysOld > 7) {
            return 'Paid';
        }
        // Recent orders are pending (but add some randomness)
        $random = rand(1, 10);
        if ($random <= 7) {
            return 'Pending';
        } elseif ($random <= 9) {
            return 'Paid';
        } else {
            return 'Shipped';
        }
    }
    
    private function getStatusTimestamps($orderDate, $status)
    {
        $timestamps = [
            'created_at' => $orderDate,
            'updated_at' => $orderDate,
        ];
        
        // Add realistic timestamps based on status
        switch ($status) {
            case 'Paid':
                $timestamps['updated_at'] = $orderDate->copy()->addDays(rand(1, 2));
                break;
            case 'Shipped':
                $timestamps['updated_at'] = $orderDate->copy()->addDays(rand(3, 5));
                break;
            case 'Completed':
                $timestamps['updated_at'] = $orderDate->copy()->addDays(rand(6, 10));
                break;
            default:
                // Pending - no extra days
                break;
        }
        
        return $timestamps;
    }
}