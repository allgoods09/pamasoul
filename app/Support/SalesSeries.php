<?php

namespace App\Support;

use App\Models\Order;
use Carbon\Carbon;

class SalesSeries
{
    public static function monthly($from, $to): array
    {
        $daily = Order::where('status', 'Completed')->whereBetween('created_at', [$from, $to])
            ->selectRaw('DATE(created_at) as date, SUM(total) as total, COUNT(*) as orders')
            ->groupByRaw('DATE(created_at)')->orderBy('date')->get();
        $groups = $daily->groupBy(fn ($row) => substr($row->date, 0, 7));
        $month = Carbon::parse($from)->startOfMonth();
        $end = Carbon::parse($to)->startOfMonth();
        $result = [];
        while ($month->lte($end)) {
            $key = $month->format('Y-m');
            $rows = $groups->get($key, collect());
            $total = (float) $rows->sum('total');
            $orders = (int) $rows->sum('orders');
            $result[] = ['month_key' => $key, 'month' => $month->format('M Y'), 'total' => $total, 'orders' => $orders,
                'avg_value' => $orders ? $total / $orders : 0, 'order_count' => $orders];
            $month->addMonth();
        }

        return $result;
    }
}
