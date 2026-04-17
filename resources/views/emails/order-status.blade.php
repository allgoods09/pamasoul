<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Order Status Update - Pamasoul</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background: #1a1a1a;
            color: white;
            padding: 30px;
            text-align: center;
        }
        .content {
            padding: 30px;
        }
        .status {
            display: inline-block;
            padding: 8px 16px;
            background: #e2e8f0;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
        }
        .status.Pending { background: #fef3c7; color: #92400e; }
        .status.Paid { background: #dbeafe; color: #1e40af; }
        .status.Shipped { background: #f3e8ff; color: #6b21a5; }
        .status.Completed { background: #d1fae5; color: #065f46; }
        .footer {
            background: #f9fafb;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
        }
        .button {
            display: inline-block;
            background: #1a1a1a;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 20px;
        }
        .order-details {
            background: #f9fafb;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        .text-right {
            text-align: right;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; font-weight: 300;">PAMASOUL</h1>
            <p style="margin: 5px 0 0; opacity: 0.8;">Premium Fishing Tackle</p>
        </div>

        <div class="content">
            <p style="font-size: 16px;">Dear <strong>{{ $order->user->name ?? 'Valued Customer' }}</strong>,</p>

            <p>Your order <strong>#{{ $order->id }}</strong> status has been updated to:</p>

            <div style="text-align: center; margin: 20px 0;">
                <span class="status {{ $order->status }}">{{ $order->status }}</span>
            </div>

            <div class="order-details">
                <h3 style="margin: 0 0 10px;">Order Summary</h3>
                
                @php
                    $subtotal = 0;
                    foreach($order->items as $item) {
                        $subtotal += floatval($item->price_snapshot) * $item->quantity;
                    }
                    $shippingFee = floatval($order->total) - $subtotal;
                @endphp

                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th class="text-right">Qty</th>
                            <th class="text-right">Price</th>
                            <th class="text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($order->items as $item)
                        <tr>
                            <td>{{ $item->product->name ?? 'Product' }}</td>
                            <td class="text-right">{{ $item->quantity }}</td>
                            <td class="text-right">₱{{ number_format(floatval($item->price_snapshot), 2) }}</td>
                            <td class="text-right">₱{{ number_format(floatval($item->price_snapshot) * $item->quantity, 2) }}</td>
                        </tr>
                        @endforeach
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" class="text-right"><strong>Subtotal</strong></td>
                            <td class="text-right">₱{{ number_format($subtotal, 2) }}</td>
                        </tr>
                        <tr>
                            <td colspan="3" class="text-right">Shipping Fee</td>
                            <td class="text-right">
                                @if($shippingFee > 0)
                                    ₱{{ number_format($shippingFee, 2) }}
                                @else
                                    FREE
                                @endif
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3" class="text-right"><strong>TOTAL</strong></td>
                            <td class="text-right"><strong>₱{{ number_format(floatval($order->total), 2) }}</strong></td>
                        </tr>
                    </tfoot>
                </table>
                <hr style="margin: 15px 0; border-color: #e5e7eb;">
                <p style="margin: 5px 0;"><strong>Payment Method:</strong> {{ $order->payment_method === 'COD' ? 'Cash on Delivery' : 'Bank Transfer' }}</p>
            </div>

            @if($order->status === 'Shipped')
            <div style="background: #e0f2fe; padding: 15px; border-radius: 8px; margin-top: 20px;">
                <p style="margin: 0;"><strong>📦 Your order is on the way!</strong></p>
                <p style="margin: 5px 0 0; font-size: 14px;">Track your package using the tracking number provided in your account dashboard.</p>
            </div>
            @endif

            @if($order->status === 'Completed')
            <div style="background: #d1fae5; padding: 15px; border-radius: 8px; margin-top: 20px;">
                <p style="margin: 0;"><strong>✓ Order Completed</strong></p>
                <p style="margin: 5px 0 0; font-size: 14px;">Thank you for shopping with Pamasoul! We hope you enjoy your fishing gear.</p>
            </div>
            @endif

            <div style="text-align: center;">
                <a href="{{ route('customer.orders.show', $order->id) }}" class="button">View Order Details</a>
            </div>
        </div>

        <div class="footer">
            <p>&copy; {{ date('Y') }} Pamasoul Fishing Tackle. All rights reserved.</p>
            <p>Tubigon, Bohol, Philippines | support@pamasoul.com | (+63) 938 931 7261</p>
            <p style="font-size: 11px;">This email was sent to {{ $order->user->email }}. If you didn't receive this email, please contact support.</p>
        </div>
    </div>
</body>
</html>