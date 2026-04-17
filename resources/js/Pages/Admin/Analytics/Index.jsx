import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { 
    DocumentArrowDownIcon, 
    ChartBarIcon, 
    CurrencyDollarIcon, 
    ShoppingCartIcon, 
    UsersIcon, 
    CubeIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

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

    const COLORS = {
        COD: '#10B981',
        BankTransfer: '#3B82F6',
        Pending: '#EAB308',
        Paid: '#3B82F6',
        Shipped: '#8B5CF6',
        Completed: '#10B981',
    };

    const pieColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

    // Prepare chart data
    const salesChartData = dailySales.map(sale => ({
        date: new Date(sale.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sales: sale.total,
        orders: sale.orders,
    }));

    const categoryChartData = categorySales.map(cat => ({
        name: cat.name,
        value: parseFloat(cat.total),
    }));

    const paymentChartData = paymentDistribution.map(payment => ({
        name: payment.payment_method === 'COD' ? 'Cash on Delivery' : 'Bank Transfer',
        value: payment.count,
    }));

    const statusChartData = orderStatusDistribution.map(status => ({
        name: status.status,
        value: status.count,
    }));

    const monthlyChartData = monthlyTrends.map(trend => ({
        month: trend.month,
        sales: parseFloat(trend.total),
        orders: trend.orders,
    }));

    const statCards = [
        { name: 'Total Sales', value: `₱${Number(stats.totalSales).toLocaleString()}`, icon: CurrencyDollarIcon, color: 'bg-green-500' },
        { name: 'Total Orders', value: stats.totalOrders.toLocaleString(), icon: ShoppingCartIcon, color: 'bg-blue-500' },
        { name: 'Avg Order Value', value: `₱${Number(stats.averageOrderValue).toLocaleString()}`, icon: ChartBarIcon, color: 'bg-purple-500' },
        { name: 'Total Customers', value: stats.totalCustomers.toLocaleString(), icon: UsersIcon, color: 'bg-indigo-500' },
        { name: 'New Customers', value: stats.newCustomers.toLocaleString(), icon: UsersIcon, color: 'bg-teal-500' },
        { name: 'Repeat Customers', value: stats.repeatCustomers.toLocaleString(), icon: UsersIcon, color: 'bg-orange-500' },
        { name: 'Low Stock', value: stats.lowStockProducts.toLocaleString(), icon: CubeIcon, color: 'bg-yellow-500' },
        { name: 'Out of Stock', value: stats.outOfStockProducts.toLocaleString(), icon: CubeIcon, color: 'bg-red-500' },
    ];

    return (
        <AdminLayout>
            <Head title="Analytics" />

            <div className="space-y-6">
                {/* Header */}
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Track sales, customer behavior, and business performance
                        </p>
                    </div>
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
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date From</label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pamasoul-500 focus:ring-pamasoul-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date To</label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pamasoul-500 focus:ring-pamasoul-500 sm:text-sm"
                            />
                        </div>
                        <div className="flex items-end space-x-2">
                            <button
                                onClick={applyFilters}
                                className="inline-flex items-center rounded-md bg-pamasoul-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pamasoul-500"
                            >
                                <ArrowPathIcon className="mr-2 h-4 w-4" />
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat) => (
                        <div key={stat.name} className="overflow-hidden rounded-lg bg-white shadow hover:shadow-md transition-shadow">
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
                                            <dd className="text-xl font-semibold text-gray-900">{stat.value}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sales Trend Chart */}
                {salesChartData.length > 0 && (
                    <div className="rounded-lg bg-white shadow p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Sales Trend</h2>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={salesChartData}>
                                    <defs>
                                        <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => `₱${value.toLocaleString()}`} />
                                    <Legend />
                                    <Area type="monotone" dataKey="sales" stroke="#3B82F6" fillOpacity={1} fill="url(#salesGradient)" name="Sales (₱)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Two Column Layout for Charts */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Category Sales Distribution */}
                    {categoryChartData.length > 0 && (
                        <div className="rounded-lg bg-white shadow p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Sales by Category</h2>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={categoryChartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => `₱${value.toLocaleString()}`} />
                                        <Bar dataKey="value" fill="#3B82F6" name="Sales (₱)" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {/* Top Selling Products */}
                    {topProducts.length > 0 && (
                        <div className="rounded-lg bg-white shadow p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Top Selling Products</h2>
                            <div className="space-y-4">
                                {topProducts.map((product, index) => (
                                    <div key={index} className="flex items-center justify-between border-b pb-2">
                                        <div className="flex-1">
                                            <div className="flex items-center">
                                                <span className="text-sm font-bold text-gray-400 w-6">#{index + 1}</span>
                                                <span className="text-sm font-medium text-gray-900">{product.name}</span>
                                            </div>
                                            <div className="ml-6 text-xs text-gray-500">{product.total_sold} sold</div>
                                        </div>
                                        <span className="text-sm font-semibold text-green-600">
                                            ₱{Number(product.revenue).toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Monthly Trends Chart */}
                {monthlyChartData.length > 0 && (
                    <div className="rounded-lg bg-white shadow p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Monthly Sales Trend (Last 12 Months)</h2>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => `₱${value.toLocaleString()}`} />
                                    <Legend />
                                    <Bar dataKey="sales" fill="#3B82F6" name="Sales (₱)" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Two Column for Distribution Charts */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Payment Method Distribution */}
                    {paymentChartData.length > 0 && (
                        <div className="rounded-lg bg-white shadow p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Methods</h2>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={paymentChartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {paymentChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {/* Order Status Distribution */}
                    {statusChartData.length > 0 && (
                        <div className="rounded-lg bg-white shadow p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Status Distribution</h2>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusChartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {statusChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>

                {/* Empty State */}
                {salesChartData.length === 0 && (
                    <div className="rounded-lg bg-white shadow p-12 text-center">
                        <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No data available</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Try adjusting your date range to see analytics data.
                        </p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}