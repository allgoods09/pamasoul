import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { DocumentArrowDownIcon, ChartBarIcon, CurrencyDollarIcon, ShoppingCartIcon, UsersIcon, CubeIcon } from '@heroicons/react/24/outline';

export default function AnalyticsIndex({ stats, dailySales, categorySales, topProducts, monthlyTrends, paymentDistribution, orderStatusDistribution, filters }) {
    const [dateFrom, setDateFrom] = useState(filters.date_from);
    const [dateTo, setDateTo] = useState(filters.date_to);
    const [isExporting, setIsExporting] = useState(false);

    const applyFilters = () => {
        router.get('/admin/analytics', { date_from: dateFrom, date_to: dateTo });
    };

    const exportPdf = () => {
        setIsExporting(true);
        window.open(`/admin/analytics/export-pdf?date_from=${dateFrom}&date_to=${dateTo}`, '_blank');
        setTimeout(() => setIsExporting(false), 1000);
    };

    const exportCsv = () => {
        window.open(`/admin/analytics/export-csv?date_from=${dateFrom}&date_to=${dateTo}`, '_blank');
    };

    const statCards = [
        { name: 'Total Sales', value: `₱${Number(stats.totalSales).toLocaleString()}`, icon: CurrencyDollarIcon, color: 'bg-green-500' },
        { name: 'Total Orders', value: stats.totalOrders, icon: ShoppingCartIcon, color: 'bg-blue-500' },
        { name: 'Avg Order Value', value: `₱${Number(stats.averageOrderValue).toLocaleString()}`, icon: ChartBarIcon, color: 'bg-purple-500' },
        { name: 'Total Customers', value: stats.totalCustomers, icon: UsersIcon, color: 'bg-indigo-500' },
        { name: 'New Customers', value: stats.newCustomers, icon: UsersIcon, color: 'bg-teal-500' },
        { name: 'Repeat Customers', value: stats.repeatCustomers, icon: UsersIcon, color: 'bg-orange-500' },
        { name: 'Low Stock', value: stats.lowStockProducts, icon: CubeIcon, color: 'bg-yellow-500' },
        { name: 'Out of Stock', value: stats.outOfStockProducts, icon: CubeIcon, color: 'bg-red-500' },
    ];

    return (
        <AdminLayout>
            <Head title="Analytics" />

            <div className="space-y-6">
                {/* Header */}
                <div className="sm:flex sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>
                    <div className="mt-4 sm:mt-0 flex space-x-3">
                        <button
                            onClick={exportCsv}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                            <DocumentArrowDownIcon className="mr-2 h-4 w-4" />
                            Export CSV
                        </button>
                        <button
                            onClick={exportPdf}
                            disabled={isExporting}
                            className="inline-flex items-center rounded-md bg-pamasoul-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pamasoul-500 disabled:opacity-50"
                        >
                            <DocumentArrowDownIcon className="mr-2 h-4 w-4" />
                            {isExporting ? 'Generating...' : 'Export PDF'}
                        </button>
                    </div>
                </div>

                {/* Date Range Filter */}
                <div className="rounded-lg bg-white p-4 shadow">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date From</label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date To</label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={applyFilters}
                                className="w-full rounded-md bg-pamasoul-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pamasoul-500"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
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
                                            <dt className="truncate text-sm font-medium text-gray-500">{stat.name}</dt>
                                            <dd className="text-lg font-semibold text-gray-900">{stat.value}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Top Selling Products */}
                    <div className="rounded-lg bg-white shadow">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">Top Selling Products</h2>
                        </div>
                        <div className="p-6">
                            {topProducts.length > 0 ? (
                                <div className="space-y-4">
                                    {topProducts.map((product, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div>
                                                <span className="text-sm font-medium text-gray-900">{product.name}</span>
                                                <p className="text-xs text-gray-500">{product.total_sold} sold</p>
                                            </div>
                                            <span className="text-sm font-semibold text-green-600">
                                                ₱{Number(product.revenue).toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No sales data available.</p>
                            )}
                        </div>
                    </div>

                    {/* Category Sales Distribution */}
                    <div className="rounded-lg bg-white shadow">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">Sales by Category</h2>
                        </div>
                        <div className="p-6">
                            {categorySales.length > 0 ? (
                                <div className="space-y-4">
                                    {categorySales.map((category, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-900">{category.name}</span>
                                            <span className="text-sm font-semibold text-gray-900">
                                                ₱{Number(category.total).toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No category sales data available.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Order Status Distribution */}
                <div className="rounded-lg bg-white shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">Order Status Distribution</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {orderStatusDistribution.map((status) => (
                                <div key={status.status} className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">{status.count}</div>
                                    <div className="text-sm text-gray-500">{status.status}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Payment Method Distribution */}
                <div className="rounded-lg bg-white shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">Payment Methods</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
                            {paymentDistribution.map((method) => (
                                <div key={method.payment_method} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        {method.payment_method === 'COD' ? 'Cash on Delivery' : 'Bank Transfer'}
                                    </span>
                                    <span className="text-sm font-semibold text-gray-900">{method.count} orders</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Monthly Trends */}
                {monthlyTrends.length > 0 && (
                    <div className="rounded-lg bg-white shadow">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">Monthly Sales Trend (Last 12 Months)</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-3">
                                {monthlyTrends.map((trend) => (
                                    <div key={`${trend.year}-${trend.month}`} className="flex items-center">
                                        <div className="w-24 text-sm text-gray-600">
                                            {new Date(trend.year, trend.month - 1).toLocaleString('default', { month: 'short' })} {trend.year}
                                        </div>
                                        <div className="flex-1 ml-4">
                                            <div className="relative pt-1">
                                                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                                                    <div
                                                        style={{ width: `${Math.min((trend.total / stats.totalSales) * 100, 100)}%` }}
                                                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ml-4 text-sm font-semibold text-gray-900">
                                            ₱{Number(trend.total).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}