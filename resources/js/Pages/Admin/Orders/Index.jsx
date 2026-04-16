import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { EyeIcon } from '@heroicons/react/24/outline';

export default function OrdersIndex({ orders, statusCounts, filters }) {
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [search, setSearch] = useState(filters.search || '');
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [bulkStatus, setBulkStatus] = useState('');

    const handleFilter = () => {
        router.get('/admin/orders', {
            status: statusFilter,
            date_from: dateFrom,
            date_to: dateTo,
            search,
        });
    };

    const handleBulkStatusUpdate = () => {
        if (bulkStatus && selectedOrders.length > 0) {
            if (confirm(`Update ${selectedOrders.length} orders to ${bulkStatus}?`)) {
                router.post('/admin/orders/bulk-update-status', {
                    ids: selectedOrders,
                    status: bulkStatus,
                });
                setSelectedOrders([]);
                setBulkStatus('');
            }
        }
    };

    const statusColors = {
        Pending: 'bg-yellow-100 text-yellow-800',
        Paid: 'bg-blue-100 text-blue-800',
        Shipped: 'bg-purple-100 text-purple-800',
        Completed: 'bg-green-100 text-green-800',
    };

    const statusBadges = [
        { label: 'All', value: '', count: orders.total },
        { label: 'Pending', value: 'Pending', count: statusCounts.Pending },
        { label: 'Paid', value: 'Paid', count: statusCounts.Paid },
        { label: 'Shipped', value: 'Shipped', count: statusCounts.Shipped },
        { label: 'Completed', value: 'Completed', count: statusCounts.Completed },
    ];

    return (
        <AdminLayout>
            <Head title="Orders" />

            <div className="space-y-6">
                <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>

                {/* Status Filter Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        {statusBadges.map((badge) => (
                            <button
                                key={badge.label}
                                onClick={() => {
                                    setStatusFilter(badge.value);
                                    handleFilter();
                                }}
                                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                                    statusFilter === badge.value
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {badge.label}
                                <span className="ml-2 py-0.5 px-2 rounded-full bg-gray-100 text-gray-900 text-xs">
                                    {badge.count}
                                </span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Filters */}
                <div className="rounded-lg bg-white p-4 shadow">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Search</label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Order ID or Customer"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                        </div>
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
                                onClick={handleFilter}
                                className="w-full rounded-md bg-pamasoul-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pamasoul-500"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedOrders.length > 0 && (
                    <div className="rounded-lg bg-blue-50 p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-blue-700">
                                {selectedOrders.length} order(s) selected
                            </span>
                            <div className="flex space-x-3">
                                <select
                                    value={bulkStatus}
                                    onChange={(e) => setBulkStatus(e.target.value)}
                                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                >
                                    <option value="">Change status to...</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Completed">Completed</option>
                                </select>
                                <button
                                    onClick={handleBulkStatusUpdate}
                                    disabled={!bulkStatus}
                                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Orders Table */}
                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedOrders(orders.data.map(o => o.id));
                                            } else {
                                                setSelectedOrders([]);
                                            }
                                        }}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {orders.data.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedOrders.includes(order.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedOrders([...selectedOrders, order.id]);
                                                } else {
                                                    setSelectedOrders(selectedOrders.filter(id => id !== order.id));
                                                }
                                            }}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">#{order.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{order.user?.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">₱{Number(order.total).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{order.payment_method}</td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => {
                                                router.patch(`/admin/orders/${order.id}/status`, { status: e.target.value });
                                            }}
                                            className={`text-xs font-semibold rounded-full px-2 py-1 ${statusColors[order.status]}`}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Paid">Paid</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm">
                                        <Link
                                            href={`/admin/orders/${order.id}`}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            <EyeIcon className="h-5 w-5 inline" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="border-t border-gray-200 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                Showing {orders.from || 0} to {orders.to || 0} of {orders.total} results
                            </div>
                            <div className="flex space-x-2">
                                {orders.links?.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-3 py-1 rounded ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        } ${!link.url && 'opacity-50 cursor-default'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}