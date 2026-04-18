<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Analytics Report - Pamasoul</title>
    <style>
        @font-face {
            font-family: 'DejaVu Sans';
            font-style: normal;
            font-weight: normal;
            src: url("{{ storage_path('fonts/DejaVuSans.ttf') }}") format('truetype');
        }
        
        body {
            font-family: 'DejaVu Sans', sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            font-size: 12px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 25px;
            border-bottom: 3px solid #1a3a3a;
            padding-bottom: 15px;
        }
        
        .header h1 {
            margin: 0;
            color: #1a3a3a;
            font-size: 24px;
        }
        
        .header p {
            margin: 5px 0 0;
            color: #666;
            font-size: 11px;
        }
        
        .company-info {
            text-align: center;
            font-size: 10px;
            color: #888;
            margin-top: 5px;
        }
        
        .section {
            margin-bottom: 25px;
            page-break-inside: avoid;
        }
        
        .section-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 12px;
            padding-bottom: 5px;
            border-bottom: 2px solid #3B82F6;
            color: #1a3a3a;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin-bottom: 25px;
        }
        
        .stat-card {
            background: #f0f9ff;
            padding: 12px;
            border-radius: 8px;
            text-align: center;
            border-left: 3px solid #3B82F6;
        }
        
        .stat-value {
            font-size: 20px;
            font-weight: bold;
            color: #3B82F6;
        }
        
        .stat-label {
            font-size: 10px;
            color: #666;
            margin-top: 5px;
        }
        
        .two-column {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 25px;
        }
        
        .info-box {
            background: #f8f9fa;
            padding: 12px;
            border-radius: 6px;
        }
        
        .info-box h4 {
            margin: 0 0 8px 0;
            font-size: 13px;
            color: #3B82F6;
        }
        
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            border-bottom: 1px dashed #ddd;
        }
        
        .info-label {
            font-weight: bold;
            color: #555;
        }
        
        .info-value {
            color: #333;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        
        th, td {
            padding: 8px 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        
        th {
            background-color: #3B82F6;
            color: white;
            font-weight: bold;
            font-size: 11px;
        }
        
        tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        
        .text-right {
            text-align: right;
        }
        
        .text-center {
            text-align: center;
        }
        
        .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 9px;
            font-weight: bold;
        }
        
        .badge-success {
            background: #d1fae5;
            color: #065f46;
        }
        
        .badge-warning {
            background: #fed7aa;
            color: #92400e;
        }
        
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #ddd;
            font-size: 9px;
            color: #999;
        }
        
        .watermark {
            position: fixed;
            bottom: 50px;
            right: 30px;
            opacity: 0.05;
            font-size: 60px;
            font-weight: bold;
            transform: rotate(-30deg);
        }
    </style>
</head>
<body>
    <div class="watermark">PAMASOUL</div>

    <div class="header">
        <h1>PAMASOUL FISHING TACKLE</h1>
        <p>Analytics & Performance Report</p>
        <div class="company-info">
            Tubigon, Bohol, Philippines | support@pamasoul.com | (+63) 938 931 7261
        </div>
    </div>

    <!-- Report Metadata -->
    <div class="info-box" style="margin-bottom: 20px;">
        <div class="info-row">
            <span class="info-label">Report Generated:</span>
            <span class="info-value">{{ $generated_at }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Period Covered:</span>
            <span class="info-value">{{ $date_range['from'] }} to {{ $date_range['to'] }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Generated By:</span>
            <span class="info-value">System Administrator</span>
        </div>
    </div>

    <!-- Key Metrics -->
    <div class="section">
        <div class="section-title">Key Performance Indicators</div>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">₱{{ number_format($total_sales, 2) }}</div>
                <div class="stat-label">Total Sales</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">{{ number_format($total_orders) }}</div>
                <div class="stat-label">Total Orders</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">₱{{ number_format($average_order_value, 2) }}</div>
                <div class="stat-label">Average Order Value</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">{{ number_format($total_customers ?? 0) }}</div>
                <div class="stat-label">Active Customers</div>
            </div>
        </div>
    </div>

    <!-- Additional Metrics -->
    <div class="two-column">
        <div class="info-box">
            <h4>💰 Revenue Breakdown</h4>
            <div class="info-row">
                <span class="info-label">Total Revenue:</span>
                <span class="info-value">₱{{ number_format($total_sales, 2) }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Average per Order:</span>
                <span class="info-value">₱{{ number_format($average_order_value, 2) }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Est. Monthly Average:</span>
                <span class="info-value">₱{{ number_format($total_sales / max(1, \Carbon\Carbon::parse($date_range['from'])->diffInMonths($date_range['to']) + 1), 2) }}</span>
            </div>
        </div>
        <div class="info-box">
            <h4>📊 Order Insights</h4>
            <div class="info-row">
                <span class="info-label">Total Orders:</span>
                <span class="info-value">{{ number_format($total_orders) }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Items Sold:</span>
                <span class="info-value">{{ number_format($total_items_sold ?? 0) }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Orders per Day:</span>
                <span class="info-value">{{ number_format($total_orders / max(1, \Carbon\Carbon::parse($date_range['from'])->diffInDays($date_range['to']) + 1), 1) }}</span>
            </div>
        </div>
    </div>

    <!-- Top Selling Products -->
    @if(count($top_products) > 0)
    <div class="section">
        <div class="section-title">🏆 Top Selling Products</div>
        <table>
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Product Name</th>
                    <th class="text-right">Quantity Sold</th>
                    <th class="text-right">Revenue</th>
                    <th class="text-center">% of Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($top_products as $index => $product)
                <tr>
                    <td>
                        @if($index == 0) 🥇
                        @elseif($index == 1) 🥈
                        @elseif($index == 2) 🥉
                        @else #{{ $index + 1 }}
                        @endif
                    </td>
                    <td>{{ $product->name }}</td>
                    <td class="text-right">{{ number_format($product->total_sold) }}</td>
                    <td class="text-right">₱{{ number_format($product->revenue, 2) }}</td>
                    <td class="text-center">
                        @php
                            $percentage = $total_sales > 0 ? ($product->revenue / $total_sales) * 100 : 0;
                        @endphp
                        <span class="badge badge-success">{{ number_format($percentage, 1) }}%</span>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    <!-- Category Sales -->
    @if(count($category_sales) > 0)
    <div class="section">
        <div class="section-title">📁 Sales by Category</div>
        <table>
            <thead>
                <tr>
                    <th>Category</th>
                    <th class="text-right">Total Sales</th>
                    <th class="text-center">Share</th>
                </tr>
            </thead>
            <tbody>
                @foreach($category_sales as $category)
                <tr>
                    <td>{{ $category->name }}</td>
                    <td class="text-right">₱{{ number_format($category->total, 2) }}</td>
                    <td class="text-center">
                        @php
                            $percentage = $total_sales > 0 ? ($category->total / $total_sales) * 100 : 0;
                        @endphp
                        <div class="badge badge-warning">{{ number_format($percentage, 1) }}%</div>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    <!-- Summary Notes -->
    <div class="section">
        <div class="section-title">📝 Executive Summary</div>
        <div class="info-box">
            <p style="margin: 0; line-height: 1.6;">
                During the reporting period from <strong>{{ $date_range['from'] }}</strong> to <strong>{{ $date_range['to'] }}</strong>,
                Pamasoul Fishing Tackle achieved <strong>₱{{ number_format($total_sales, 2) }}</strong> in total sales
                across <strong>{{ number_format($total_orders) }}</strong> orders. The average order value was 
                <strong>₱{{ number_format($average_order_value, 2) }}</strong>.
            </p>
            <p style="margin: 10px 0 0; line-height: 1.6;">
                @if(count($top_products) > 0)
                    The top-performing product was <strong>{{ $top_products[0]->name }}</strong> with 
                    {{ number_format($top_products[0]->total_sold) }} units sold.
                @endif
                @if(count($category_sales) > 0)
                    The leading category was <strong>{{ $category_sales[0]->name }}</strong>.
                @endif
            </p>
        </div>
    </div>

    <div class="footer">
        <p>Pamasoul Fishing Tackle - Premium Quality Fishing Gear</p>
        <p>This is a system-generated report. For questions, contact support@pamasoul.com</p>
        <p>Page 1 of 1 | Generated on {{ $generated_at }}</p>
    </div>
</body>
</html>