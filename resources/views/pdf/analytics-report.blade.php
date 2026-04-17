<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Analytics Report</title>
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
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #3B82F6;
            padding-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            color: #1a3a3a;
        }
        .header p {
            margin: 5px 0 0;
            color: #666;
        }
        .section {
            margin-bottom: 30px;
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            padding-bottom: 5px;
            border-bottom: 1px solid #ddd;
            color: #3B82F6;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
        }
        .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: #3B82F6;
        }
        .stat-label {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #f8f9fa;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 10px;
            color: #999;
        }
        .currency {
            font-family: 'DejaVu Sans', sans-serif;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Pamasoul Fishing Tackle - Analytics Report</h1>
        <p>Generated on: {{ $generated_at }}</p>
        <p>Date Range: {{ $date_range['from'] }} to {{ $date_range['to'] }}</p>
    </div>

    <div class="section">
        <div class="section-title">Sales Overview</div>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">PHP {{ number_format($total_sales, 2) }}</div>
                <div class="stat-label">Total Sales</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">{{ $total_orders }}</div>
                <div class="stat-label">Total Orders</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">PHP {{ number_format($average_order_value, 2) }}</div>
                <div class="stat-label">Average Order Value</div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Top Selling Products</div>
        <table>
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Product Name</th>
                    <th>Quantity Sold</th>
                    <th>Revenue</th>
                </tr>
            </thead>
            <tbody>
                @foreach($top_products as $index => $product)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $product->name }}</td>
                    <td>{{ $product->total_sold }}</td>
                    <td class="currency">PHP {{ number_format($product->revenue, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Sales by Category</div>
        <table>
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Total Sales</th>
                </tr>
            </thead>
            <tbody>
                @foreach($category_sales as $category)
                <tr>
                    <td>{{ $category->name }}</td>
                    <td class="currency">PHP {{ number_format($category->total, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="footer">
        <p>Pamasoul Fishing Tackle - Your Trusted Fishing Gear Partner</p>
        <p>This report is system-generated. For inquiries, contact support@pamasoul.com</p>
    </div>
</body>
</html>