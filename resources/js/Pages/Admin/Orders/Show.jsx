import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function OrdersShow({ order }) {
    const statusColors = {
        Pending: 'bg-yellow-100 text-yellow-800',
        Paid: 'bg-blue-100 text-blue-800',
        Shipped: 'bg-purple-100 text-purple-800',
        Completed: 'bg-green-100 text-green-800',
    };

    const handleStatusUpdate = (newStatus) => {
        router.patch(`/admin/orders/${order.id}/status`, { status: newStatus });
    };

    return (
        <AdminLayout>
            <Head title={`Order #${order.id}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/admin/orders"
                            className="inline-flex items-center text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeftIcon className="h-5 w-5 mr-1" />
                            Back to Orders
                        </Link>
                        <h1 className="text-2xl font-semibold text-gray-900">Order #{order.id}</h1>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(e.target.value)}
                            className={`rounded-md border-0 px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 ${statusColors[order.status]}`}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </div>

                {/* Order Info */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Customer Info */}
                    <div className="rounded-lg bg-white shadow p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h2>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Name:</span> {order.user?.name}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Email:</span> {order.user?.email}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Member Since:</span> {new Date(order.user?.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="rounded-lg bg-white shadow p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h2>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Address:</span> {order.shipping_address}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Payment Method:</span> {order.payment_method === 'COD' ? 'Cash on Delivery' : 'Bank Transfer'}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Order Date:</span> {new Date(order.created_at).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="rounded-lg bg-white shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">Order Items</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {order.items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 text-sm text-gray-900">{item.product?.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{item.quantity}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">₱{Number(item.price_snapshot).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">₱{Number(item.quantity * item.price_snapshot).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-50">
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-right font-medium text-gray-900">
                                        Total:
                                    </td>
                                    <td className="px-6 py-4 text-lg font-bold text-gray-900">
                                        ₱{Number(order.total).toLocaleString()}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}