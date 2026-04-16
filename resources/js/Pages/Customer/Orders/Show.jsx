import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getProductImageUrl } from '@/helpers/imageHelper';


export default function OrderShow({ order }) {
    const statusColors = {
        Pending: 'bg-yellow-100 text-yellow-800',
        Paid: 'bg-blue-100 text-blue-800',
        Shipped: 'bg-purple-100 text-purple-800',
        Completed: 'bg-green-100 text-green-800',
    };

    return (
        <CustomerLayout>
            <Head title={`Order #${order.id} - Pamasoul`} />

            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Link href="/my-orders" className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6">
                        <ArrowLeftIcon className="h-4 w-4 mr-1" />
                        Back to My Orders
                    </Link>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="p-6 border-b bg-gray-50">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
                                    <p className="text-gray-500 mt-1">
                                        Placed on {new Date(order.created_at).toLocaleString()}
                                    </p>
                                </div>
                                <div className="mt-4 sm:mt-0">
                                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${statusColors[order.status]}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h2 className="font-semibold text-gray-900 mb-2">Shipping Address</h2>
                                    <p className="text-gray-600">{order.shipping_address}</p>
                                </div>
                                <div>
                                    <h2 className="font-semibold text-gray-900 mb-2">Payment Method</h2>
                                    <p className="text-gray-600">
                                        {order.payment_method === 'COD' ? 'Cash on Delivery' : 'Bank Transfer'}
                                    </p>
                                </div>
                            </div>

                            <h2 className="font-semibold text-gray-900 mb-4">Order Items</h2>
                            <div className="border rounded-lg overflow-hidden mb-6">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {order.items.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-6 py-4 text-sm text-gray-900">{item.product.name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600 text-center">{item.quantity}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600 text-right">
                                                    ₱{Number(item.price_snapshot).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                                                    ₱{(item.quantity * item.price_snapshot).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-gray-50">
                                        <tr>
                                            <td colSpan="3" className="px-6 py-4 text-right font-semibold text-gray-900">
                                                Total:
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-pamasoul-600">
                                                ₱{Number(order.total).toLocaleString()}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            <div className="flex justify-between">
                                <Link
                                    href="/shop"
                                    className="px-6 py-2 bg-pamasoul-600 text-white font-semibold rounded-lg hover:bg-pamasoul-800"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}