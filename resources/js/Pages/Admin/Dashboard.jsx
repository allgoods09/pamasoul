import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import {
    CurrencyDollarIcon,
    ShoppingCartIcon,
    UsersIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

export default function Dashboard({ stats, lowStockProducts, recentOrders, ordersByStatus, topProducts, monthlySales }) {
    const statCards = [
        {
            name: 'Total Sales',
            value: `₱${Number(stats.totalSales).toLocaleString()}`,
            icon: CurrencyDollarIcon,
            color: 'bg-green-500',
        },
        {
            name: 'Total Orders',
            value: stats.totalOrders,
            icon: ShoppingCartIcon,
            color: 'bg-blue-500',
        },
        {
            name: 'Total Customers',
            value: stats.totalCustomers,
            icon: UsersIcon,
            color: 'bg-purple-500',
        },
        {
            name: 'Low Stock Items',
            value: stats.lowStockCount,
            icon: ExclamationTriangleIcon,
            color: 'bg-red-500',
        },
    ];

    const statusColors = {
        Pending: 'bg-yellow-100 text-yellow-800',
        Paid: 'bg-blue-100 text-blue-800',
        Shipped: 'bg-purple-100 text-purple-800',
        Completed: 'bg-green-100 text-green-800',
    };

    return (
        <AdminLayout>
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Page header */}
                <div className="sm:flex sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat) => (
                        <div key={stat.name} className="overflow-hidden rounded-lg bg-white shadow">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className={`rounded-lg p-3 ${stat.color}`}>
                                            <stat.icon className="h-6 w-6 text-white" />
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="truncate text-sm font-medium text-gray-500">
                                                {stat.name}
                                            </dt>
                                            <dd className="text-2xl font-semibold text-gray-900">
                                                {stat.value}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Two column layout */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Low Stock Alert */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Low Stock Alert</h2>
                            {lowStockProducts.length > 0 ? (
                                <div className="space-y-3">
                                    {lowStockProducts.map((product) => (
                                        <div key={product.id} className="flex items-center justify-between border-b pb-3">
                                            <div>
                                                <p className="font-medium text-gray-900">{product.name}</p>
                                                <p className="text-sm text-gray-500">{product.category?.name}</p>
                                            </div>
                                            <span className="text-sm font-medium text-red-600">
                                                Stock: {product.stock}
                                            </span>
                                        </div>
                                    ))}
                                    <Link
                                        href="/admin/products?stock_status=low_stock"
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        View all low stock products →
                                    </Link>
                                </div>
                            ) : (
                                <p className="text-gray-500">All products are well stocked.</p>
                            )}
                        </div>
                    </div>

                    {/* Top Selling Products */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Top Selling Products</h2>
                            {topProducts.length > 0 ? (
                                <div className="space-y-3">
                                    {topProducts.map((product) => (
                                        <div key={product.id} className="flex items-center justify-between border-b pb-3">
                                            <div>
                                                <p className="font-medium text-gray-900">{product.name}</p>
                                                <p className="text-sm text-gray-500">{product.category?.name}</p>
                                            </div>
                                            <span className="text-sm font-medium text-gray-600">
                                                {product.order_items_count} sold
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No sales data yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
                            <Link href="/admin/orders" className="text-sm text-blue-600 hover:text-blue-800">
                                View all →
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-3 py-3 text-sm text-gray-900">#{order.id}</td>
                                            <td className="px-3 py-3 text-sm text-gray-600">{order.user?.name}</td>
                                            <td className="px-3 py-3 text-sm text-gray-900">₱{Number(order.total).toLocaleString()}</td>
                                            <td className="px-3 py-3">
                                                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusColors[order.status]}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}