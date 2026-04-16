import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeftIcon, EnvelopeIcon, CalendarIcon, ShoppingCartIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

export default function UsersShow({ user, orders }) {
    const statusColors = {
        Pending: 'bg-yellow-100 text-yellow-800',
        Paid: 'bg-blue-100 text-blue-800',
        Shipped: 'bg-purple-100 text-purple-800',
        Completed: 'bg-green-100 text-green-800',
    };

    const totalSpent = orders.reduce((sum, order) => {
        if (order.status === 'Completed') {
            return sum + parseFloat(order.total);
        }
        return sum;
    }, 0);

    return (
        <AdminLayout>
            <Head title={`User: ${user.name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/admin/users"
                            className="inline-flex items-center text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeftIcon className="h-5 w-5 mr-1" />
                            Back to Users
                        </Link>
                        <h1 className="text-2xl font-semibold text-gray-900">User Details</h1>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <select
                            value={user.role}
                            onChange={(e) => {
                                router.patch(`/admin/users/${user.id}/role`, { role: e.target.value });
                            }}
                            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </div>

                {/* User Info Cards */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg bg-white shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-lg font-medium text-blue-700">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Name</p>
                                <p className="text-lg font-semibold text-gray-900">{user.name}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white shadow p-6">
                        <div className="flex items-center">
                            <EnvelopeIcon className="h-8 w-8 text-gray-400" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Email</p>
                                <p className="text-sm text-gray-900">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white shadow p-6">
                        <div className="flex items-center">
                            <ShoppingCartIcon className="h-8 w-8 text-gray-400" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white shadow p-6">
                        <div className="flex items-center">
                            <CurrencyDollarIcon className="h-8 w-8 text-gray-400" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Spent</p>
                                <p className="text-2xl font-bold text-green-600">₱{totalSpent.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Orders */}
                <div className="rounded-lg bg-white shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">Order History</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900">#{order.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">₱{Number(order.total).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{order.payment_method}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusColors[order.status]}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                View Order
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}