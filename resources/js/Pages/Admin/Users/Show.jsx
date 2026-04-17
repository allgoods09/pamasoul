import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { 
    ArrowLeftIcon, 
    EnvelopeIcon, 
    CalendarIcon, 
    ShoppingCartIcon, 
    CurrencyDollarIcon,
    UserCircleIcon,
    ShieldCheckIcon,
    MapPinIcon,
    PhoneIcon
} from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';

export default function UsersShow({ user, orders }) {
    const [updating, setUpdating] = useState(false);

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

    const handleRoleChange = (newRole) => {
        if (updating) return;
        setUpdating(true);
        
        router.patch(`/admin/users/${user.id}/role`, { role: newRole }, {
            onSuccess: () => {
                toast.success(`User role updated to ${newRole}`);
                setUpdating(false);
            },
            onError: () => {
                toast.error('Failed to update role');
                setUpdating(false);
            }
        });
    };

    return (
        <AdminLayout>
            <Head title={`User: ${user.name}`} />
            <Toaster position="top-right" />

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
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">User Details</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Member since {new Date(user.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                        <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
                        <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(e.target.value)}
                            disabled={updating}
                            className={`rounded-md border-gray-300 shadow-sm focus:border-pamasoul-500 focus:ring-pamasoul-500 sm:text-sm ${
                                user.role === 'admin' ? 'bg-purple-50 text-purple-700 font-medium' : ''
                            }`}
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
                                <div className="h-12 w-12 rounded-full bg-pamasoul-100 flex items-center justify-center">
                                    <span className="text-lg font-semibold text-pamasoul-700">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Name</p>
                                <p className="text-base font-semibold text-gray-900">{user.name}</p>
                                <p className="text-xs text-gray-500">ID: #{user.id}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white shadow p-6">
                        <div className="flex items-center">
                            <div className="rounded-full bg-blue-100 p-2">
                                <EnvelopeIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Email</p>
                                <p className="text-sm text-gray-900">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white shadow p-6">
                        <div className="flex items-center">
                            <div className="rounded-full bg-green-100 p-2">
                                <ShoppingCartIcon className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white shadow p-6">
                        <div className="flex items-center">
                            <div className="rounded-full bg-yellow-100 p-2">
                                <CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Spent</p>
                                <p className="text-2xl font-bold text-pamasoul-600">₱{totalSpent.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="rounded-lg bg-white shadow p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Account Information</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <p className="text-sm text-gray-500">Role</p>
                            <p className={`mt-1 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                            }`}>
                                {user.role === 'admin' ? 'Administrator' : 'Customer'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Account Created</p>
                            <p className="mt-1 text-sm text-gray-900">{new Date(user.created_at).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Last Updated</p>
                            <p className="mt-1 text-sm text-gray-900">{new Date(user.updated_at).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email Verified</p>
                            <p className="mt-1 text-sm text-green-600">
                                {user.email_verified_at ? 'Verified' : 'Not verified'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* User Orders */}
                <div className="rounded-lg bg-white shadow overflow-hidden">
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                            ₱{Number(order.total).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {order.payment_method === 'COD' ? 'Cash on Delivery' : 'Bank Transfer'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusColors[order.status]}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {order.items_count || order.items?.length || 0} items
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="text-pamasoul-600 hover:text-pamasoul-800 font-medium"
                                            >
                                                View Order →
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {orders.length === 0 && (
                        <div className="text-center py-12">
                            <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                This customer hasn't placed any orders.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}