import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link } from '@inertiajs/react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { getProductImageUrl } from '@/helpers/imageHelper';


export default function OrderConfirmation({ order }) {
    return (
        <CustomerLayout>
            <Head title="Order Confirmation - Pamasoul" />

            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="bg-green-50 p-6 text-center border-b border-green-100">
                            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                            <p className="text-gray-600">
                                Thank you for your purchase. Your order has been received.
                            </p>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <p className="text-sm text-gray-500">Order Number</p>
                                    <p className="font-semibold text-gray-900">#{order.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Order Date</p>
                                    <p className="font-semibold text-gray-900">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Payment Method</p>
                                    <p className="font-semibold text-gray-900">
                                        {order.payment_method === 'COD' ? 'Cash on Delivery' : 'Bank Transfer'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Order Status</p>
                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t pt-6 mb-6">
                                <h2 className="font-semibold text-gray-900 mb-3">Order Summary</h2>
                                <div className="space-y-2">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span>
                                                {item.product.name} x{item.quantity}
                                            </span>
                                            <span className="font-semibold">
                                                ₱{(item.quantity * item.price_snapshot).toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t pt-6 mb-6">
                                <h2 className="font-semibold text-gray-900 mb-2">Shipping Address</h2>
                                <p className="text-gray-600">{order.shipping_address}</p>
                            </div>

                            <div className="border-t pt-6 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-lg font-bold text-gray-900">Total Paid</span>
                                    <span className="text-xl font-bold text-pamasoul-600">
                                        ₱{Number(order.total).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between space-x-4">
                                <Link
                                    href="/shop"
                                    className="flex-1 text-center px-6 py-3 bg-pamasoul-600 text-white font-semibold rounded-lg hover:bg-pamasoul-800"
                                >
                                    Continue Shopping
                                </Link>
                                <Link
                                    href="/my-orders"
                                    className="flex-1 text-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
                                >
                                    View My Orders
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}