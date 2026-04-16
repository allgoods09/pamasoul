import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link } from '@inertiajs/react';
import { EyeIcon } from '@heroicons/react/24/outline';
import { getProductImageUrl } from '@/helpers/imageHelper';


export default function OrdersIndex({ orders }) {
    const statusColors = {
        Pending: 'bg-yellow-100 text-yellow-800',
        Paid: 'bg-blue-100 text-blue-800',
        Shipped: 'bg-purple-100 text-purple-800',
        Completed: 'bg-green-100 text-green-800',
    };

    return (
        <CustomerLayout>
            <Head title="My Orders - Pamasoul" />

            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

                    {orders.data.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-8 text-center">
                            <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                            <Link
                                href="/shop"
                                className="inline-flex px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.data.map((order) => (
                                <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
                                    <div className="p-4 bg-gray-50 border-b flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                        <div>
                                            <span className="text-sm text-gray-500">Order #{order.id}</span>
                                            <span className="mx-2">•</span>
                                            <span className="text-sm text-gray-500">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[order.status]}`}>
                                                {order.status}
                                            </span>
                                            <Link
                                                href={`/my-orders/${order.id}`}
                                                className="text-pamasoul-600 hover:text-pamasoul-800"
                                            >
                                                <EyeIcon className="h-5 w-5" />
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="space-y-2">
                                            {order.items.slice(0, 3).map((item) => (
                                                <div key={item.id} className="flex justify-between text-sm">
                                                    <span>{item.product.name} x{item.quantity}</span>
                                                    <span>₱{(item.quantity * item.price_snapshot).toLocaleString()}</span>
                                                </div>
                                            ))}
                                            {order.items.length > 3 && (
                                                <p className="text-sm text-gray-500">
                                                    +{order.items.length - 3} more items
                                                </p>
                                            )}
                                        </div>
                                        <div className="border-t mt-4 pt-4 flex justify-between">
                                            <span className="font-semibold">Total</span>
                                            <span className="font-bold text-pamasoul-600">
                                                ₱{Number(order.total).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {orders.links && orders.data.length > 0 && (
                        <div className="mt-6 flex justify-center">
                            <div className="flex space-x-2">
                                {orders.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-3 py-2 rounded-lg ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-100'
                                        } ${!link.url && 'opacity-50 cursor-default'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
}