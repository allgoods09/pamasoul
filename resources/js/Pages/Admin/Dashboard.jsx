import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import {
    CurrencyDollarIcon,
    ShoppingCartIcon,
    UsersIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import StatCard from '@/Components/Admin/StatCard';
import SalesChart from '@/Components/Admin/SalesChart';
import OrdersByStatusChart from '@/Components/Admin/OrdersByStatusChart';
import RecentOrdersTable from '@/Components/Admin/RecentOrdersTable';
import TopProductsList from '@/Components/Admin/TopProductsList';
import LowStockAlert from '@/Components/Admin/LowStockAlert';

export default function Dashboard({ stats, lowStockProducts, recentOrders, ordersByStatus, topProducts, monthlySales }) {
    // Calculate trend percentages (optional - you can calculate in backend)
    const statCards = [
        {
            title: 'Total Sales',
            value: `₱${Number(stats.totalSales).toLocaleString()}`,
            icon: CurrencyDollarIcon,
            color: 'bg-green-500',
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders.toLocaleString(),
            icon: ShoppingCartIcon,
            color: 'bg-blue-500',
        },
        {
            title: 'Total Customers',
            value: stats.totalCustomers.toLocaleString(),
            icon: UsersIcon,
            color: 'bg-purple-500',
        },
        {
            title: 'Low Stock Items',
            value: stats.lowStockCount,
            icon: ExclamationTriangleIcon,
            color: 'bg-red-500',
        },
    ];

    return (
        <AdminLayout>
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Page header */}
                <div className="sm:flex sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-2 sm:mt-0">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat) => (
                        <StatCard key={stat.title} {...stat} />
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <SalesChart monthlySales={monthlySales} />
                    <OrdersByStatusChart ordersByStatus={ordersByStatus} />
                </div>

                {/* Low Stock and Top Products */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <LowStockAlert products={lowStockProducts} />
                    <TopProductsList products={topProducts} />
                </div>

                {/* Recent Orders Table */}
                <RecentOrdersTable orders={recentOrders} />
            </div>
        </AdminLayout>
    );
}