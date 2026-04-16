<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Analytics Report</title>
    <style>
        body {
            font-family: 'Helvetica', sans-serif;
            font-size: 12px;
            line-height: 1.4;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .header p {
            margin: 5px 0 0;
            color: #666;
        }
        .summary {
            margin-bottom: 30px;
        }
        .summary table {
            width: 100%;
            border-collapse: collapse;
        }
        .summary td {
            padding: 8px;
            border: 1px solid #ddd;
        }
        .summary .label {
            font-weight: bold;
            background-color: #f5f5f5;
        }
        h2 {
            font-size: 16px;
            margin-top: 20px;
            margin-bottom: 10px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f5f5f5;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 50px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
            font-size: 10px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Pamasoul Fishing Tackle - Analytics Report</h1>
        <p>Generated on: {{ $generated_at }}</p>
        <p>Period: {{ $date_range['from'] }} to {{ $date_range['to'] }}</p>
    </div>

    <div class="summary">
        <h2>Executive Summary</h2>
        <table>
            <tr>
                <td class="label">Total Sales</td>
                <td>₱{{ number_format($total_sales, 2) }}</td>
                <td class="label">Total Orders</td>
                <td>{{ $total_orders }}</td>
            </tr>
            <tr>
                <td class="label">Average Order Value</td>
                <td>₱{{ number_format($average_order_value, 2) }}</td>
                <td class="label"></td>
                <td></td>
            </tr>
        </table>
    </div>

    <h2>Top Selling Products</h2>
    <table>
        <thead>
            <tr>
                <th>Product Name</th>
                <th>Quantity Sold</th>
                <th>Revenue</th>
            </tr>
        </thead>
        <tbody>
            @foreach($top_products as $product)
            <tr>
                <td>{{ $product->name }}</td>
                <td>{{ $product->total_sold }}</td>
                <td>₱{{ number_format($product->revenue, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <h2>Sales by Category</h2>
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
                <td>₱{{ number_format($category->total, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>Pamasoul Fishing Tackle - Internal Analytics Report</p>
        <p>This report is confidential and for internal use only.</p>
    </div>
</body>
</html>