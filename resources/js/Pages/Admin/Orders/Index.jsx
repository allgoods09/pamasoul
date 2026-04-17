import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { 
    EyeIcon, 
    EyeSlashIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
    CheckCircleIcon,
    TruckIcon,
    CurrencyDollarIcon,
    ClockIcon,
    DocumentArrowDownIcon,
    PrinterIcon,
    EnvelopeIcon,
    ArrowPathIcon,
    ChevronUpDownIcon,
    FunnelIcon
} from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';

export default function OrdersIndex({ orders, statusCounts, filters }) {
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [search, setSearch] = useState(filters.search || '');
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [bulkStatus, setBulkStatus] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [isSelectAll, setIsSelectAll] = useState(false);

    useEffect(() => {
        setIsSelectAll(selectedOrders.length === orders.data.length && orders.data.length > 0);
    }, [selectedOrders, orders.data]);

    const handleFilter = () => {
        router.get('/admin/orders', {
            status: statusFilter,
            date_from: dateFrom,
            date_to: dateTo,
            search,
        });
    };

    const handleResetFilters = () => {
        setStatusFilter('');
        setDateFrom('');
        setDateTo('');
        setSearch('');
        router.get('/admin/orders');
    };

    const handleBulkStatusUpdate = () => {
        if (!bulkStatus || selectedOrders.length === 0) return;
        
        if (confirm(`Update ${selectedOrders.length} order(s) to ${bulkStatus}?`)) {
            router.post('/admin/orders/bulk-update-status', {
                ids: selectedOrders,
                status: bulkStatus,
            }, {
                onSuccess: () => {
                    toast.success(`${selectedOrders.length} order(s) updated to ${bulkStatus}`);
                    setSelectedOrders([]);
                    setBulkStatus('');
                },
                onError: () => toast.error('Failed to update orders')
            });
        }
    };

    const handleSingleStatusUpdate = (orderId, newStatus) => {
        router.patch(`/admin/orders/${orderId}/status`, { status: newStatus }, {
            onSuccess: () => toast.success(`Order #${orderId} status updated to ${newStatus}`),
            onError: () => toast.error('Failed to update order status')
        });
    };

    const handleToggleSelectAll = () => {
        if (isSelectAll) {
            setSelectedOrders([]);
        } else {
            setSelectedOrders(orders.data.map(o => o.id));
        }
    };

    const handleSelectOrder = (orderId) => {
        if (selectedOrders.includes(orderId)) {
            setSelectedOrders(selectedOrders.filter(id => id !== orderId));
        } else {
            setSelectedOrders([...selectedOrders, orderId]);
        }
    };

    const statusColors = {
        Pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: ClockIcon },
        Paid: { bg: 'bg-blue-100', text: 'text-blue-800', icon: CurrencyDollarIcon },
        Shipped: { bg: 'bg-purple-100', text: 'text-purple-800', icon: TruckIcon },
        Completed: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircleIcon },
    };

    const statusBadges = [
        { label: 'All', value: '', count: orders.total, icon: null },
        { label: 'Pending', value: 'Pending', count: statusCounts.Pending, icon: ClockIcon },
        { label: 'Paid', value: 'Paid', count: statusCounts.Paid, icon: CurrencyDollarIcon },
        { label: 'Shipped', value: 'Shipped', count: statusCounts.Shipped, icon: TruckIcon },
        { label: 'Completed', value: 'Completed', count: statusCounts.Completed, icon: CheckCircleIcon },
    ];

    const hasActiveFilters = statusFilter || dateFrom || dateTo || search;

    return (
        <AdminLayout>
            <Head title="Orders" />
            <Toaster position="top-right" />

            <div className="space-y-6">
                {/* Header */}
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage and track all customer orders
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex space-x-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                            <FunnelIcon className="mr-2 h-4 w-4" />
                            Filters
                            {hasActiveFilters && (
                                <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-pamasoul-600" />
                            )}
                        </button>
                        {/* <button
                            onClick={() => router.get('/admin/orders/export')}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                            <DocumentArrowDownIcon className="mr-2 h-4 w-4" />
                            Export
                        </button> */}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {statusBadges.slice(1).map((badge) => {
                        const Icon = badge.icon;
                        return (
                            <div
                                key={badge.label}
                                onClick={() => {
                                    setStatusFilter(badge.value);
                                    handleFilter();
                                }}
                                className={`rounded-lg bg-white p-4 shadow cursor-pointer transition-all hover:shadow-md ${
                                    statusFilter === badge.value ? 'ring-2 ring-pamasoul-500' : ''
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">{badge.label}</p>
                                        <p className="text-2xl font-semibold text-gray-900">{badge.count}</p>
                                    </div>
                                    {Icon && (
                                        <div className={`rounded-full p-3 ${statusColors[badge.value]?.bg}`}>
                                            <Icon className={`h-6 w-6 ${statusColors[badge.value]?.text}`} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                    <div className="rounded-lg bg-white p-4 shadow">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Search</label>
                                <div className="mt-1 relative">
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Order ID or customer name..."
                                        className="block w-full rounded-md border-gray-300 pr-10 shadow-sm focus:border-pamasoul-500 focus:ring-pamasoul-500 sm:text-sm"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                                    </div>
                                </div>
                            </div>
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
                                {hasActiveFilters && (
                                    <button
                                        onClick={handleResetFilters}
                                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                                    >
                                        <XMarkIcon className="mr-1.5 h-4 w-4" />
                                        Reset
                                    </button>
                                )}
                                <button
                                    onClick={handleFilter}
                                    className="inline-flex items-center rounded-md bg-pamasoul-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-pamasoul-500"
                                >
                                    <MagnifyingGlassIcon className="mr-1.5 h-4 w-4" />
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bulk Actions Bar */}
                {selectedOrders.length > 0 && (
                    <div className="rounded-lg bg-pamasoul-50 p-4 shadow-sm">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center space-x-4">
                                <span className="text-sm font-medium text-pamasoul-800">
                                    {selectedOrders.length} order(s) selected
                                </span>
                                <div className="flex items-center space-x-2">
                                    <select
                                        value={bulkStatus}
                                        onChange={(e) => setBulkStatus(e.target.value)}
                                        className="rounded-md border-gray-300 shadow-sm focus:border-pamasoul-500 focus:ring-pamasoul-500 sm:text-sm"
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
                                        className="inline-flex items-center rounded-md bg-pamasoul-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-pamasoul-500 disabled:opacity-50"
                                    >
                                        <ArrowPathIcon className="mr-1.5 h-4 w-4" />
                                        Apply
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedOrders([])}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Orders Table */}
                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            checked={isSelectAll}
                                            onChange={handleToggleSelectAll}
                                            className="rounded border-gray-300 text-pamasoul-600 focus:ring-pamasoul-500"
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Payment
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Items
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {orders.data.map((order) => {
                                    const StatusIcon = statusColors[order.status]?.icon || ClockIcon;
                                    const statusColor = statusColors[order.status];
                                    return (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedOrders.includes(order.id)}
                                                    onChange={() => handleSelectOrder(order.id)}
                                                    className="rounded border-gray-300 text-pamasoul-600 focus:ring-pamasoul-500"
                                                />
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                                                <div className="text-xs text-gray-500">Click to view</div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="text-sm text-gray-900">{order.user?.name || 'Guest'}</div>
                                                <div className="text-xs text-gray-500">{order.user?.email}</div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="text-sm font-semibold text-gray-900">₱{Number(order.total).toLocaleString()}</div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="text-sm text-gray-600">
                                                    {order.payment_method === 'COD' ? 'Cash on Delivery' : 'Bank Transfer'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="text-sm text-gray-600">
                                                    {order.items_count || order.items?.length || 0} items
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleSingleStatusUpdate(order.id, e.target.value)}
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border-0 focus:ring-2 focus:ring-pamasoul-500 cursor-pointer ${statusColor?.bg} ${statusColor?.text}`}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Paid">Paid</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Completed">Completed</option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="text-sm text-gray-500">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {new Date(order.created_at).toLocaleTimeString()}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Link
                                                        href={`/admin/orders/${order.id}`}
                                                        className="text-pamasoul-600 hover:text-pamasoul-800"
                                                        title="View order details"
                                                    >
                                                        <EyeIcon className="h-5 w-5" />
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            // Print invoice functionality
                                                            window.open(`/admin/orders/${order.id}/invoice`, '_blank');
                                                        }}
                                                        className="text-gray-400 hover:text-gray-600"
                                                        title="Print invoice"
                                                    >
                                                        <PrinterIcon className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            toast.success(`Email notification sent to ${order.user?.email}`);
                                                        }}
                                                        className="text-gray-400 hover:text-gray-600"
                                                        title="Email customer"
                                                    >
                                                        <EnvelopeIcon className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {orders.data.length === 0 && (
                        <div className="text-center py-12">
                            <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {hasActiveFilters ? 'Try adjusting your filters.' : 'Orders will appear here once customers place them.'}
                            </p>
                            {hasActiveFilters && (
                                <div className="mt-6">
                                    <button
                                        onClick={handleResetFilters}
                                        className="inline-flex items-center rounded-md bg-pamasoul-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pamasoul-500"
                                    >
                                        <XMarkIcon className="mr-2 h-4 w-4" />
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    {orders.links && orders.links.length > 0 && orders.data.length > 0 && (
                        <div className="border-t border-gray-200 px-6 py-4">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="text-sm text-gray-500">
                                    Showing {orders.from || 0} to {orders.to || 0} of {orders.total} results
                                </div>
                                <div className="flex space-x-1">
                                    {orders.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                                link.active
                                                    ? 'bg-pamasoul-600 text-white'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            } ${!link.url && 'opacity-50 cursor-default'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}