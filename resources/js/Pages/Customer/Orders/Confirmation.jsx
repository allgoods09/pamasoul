import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    CheckCircleIcon, 
    TruckIcon, 
    CurrencyDollarIcon, 
    CalendarIcon,
    MapPinIcon,
    CreditCardIcon,
    ShoppingBagIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';
import { getProductImageUrl } from '@/helpers/imageHelper';

export default function OrderConfirmation({ order }) {
    // Calculate subtotal from items
    const itemsSubtotal = order.items?.reduce((sum, item) => {
        return sum + (item.quantity * item.price_snapshot);
    }, 0) || 0;
    
    // Calculate shipping fee from the stored order total
    // (order.total already includes the correct shipping fee from checkout)
    const orderTotal = Number(order.total) || 0;
    const shippingFee = orderTotal - itemsSubtotal;
    const isFreeShipping = shippingFee === 0;

    return (
        <CustomerLayout>
            <Head title="Order Confirmation - Pamasoul" />

            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Success Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-4">
                            <CheckCircleIcon className="h-10 w-10 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                        <p className="text-gray-600">
                            Thank you for your purchase. We've received your order and will process it soon.
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        {/* Order Header */}
                        <div className="p-6 bg-gradient-to-r from-pamasoul-50 to-white border-b">
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Order Number</p>
                                    <p className="text-lg font-bold text-gray-900">#{order.id}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Order Date</p>
                                    <div className="flex items-center space-x-1">
                                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                                        <p className="text-sm font-semibold text-gray-900">
                                            {new Date(order.created_at).toLocaleDateString('en-US', { 
                                                year: 'numeric', 
                                                month: 'short', 
                                                day: 'numeric' 
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Payment Method</p>
                                    <div className="flex items-center space-x-1">
                                        <CreditCardIcon className="h-4 w-4 text-gray-400" />
                                        <p className="text-sm font-semibold text-gray-900">
                                            {order.payment_method === 'COD' ? 'Cash on Delivery' : 'Bank Transfer'}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Order Status</p>
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                                        <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 mr-1.5 animate-pulse" />
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Two Column Layout */}
                            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                                {/* Left Column - Order Items */}
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <ShoppingBagIcon className="h-5 w-5 mr-2 text-pamasoul-600" />
                                        Order Items
                                    </h2>
                                    <div className="space-y-4">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex items-center space-x-4 border-b border-gray-100 pb-4 last:border-0">
                                                <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img 
                                                        src={getProductImageUrl(item.product)}
                                                        alt={item.product.name}
                                                        className="h-full w-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src = 'https://picsum.photos/id/20/100/100';
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <Link 
                                                        href={`/product/${item.product.id}`}
                                                        className="text-sm font-semibold text-gray-900 hover:text-pamasoul-600 transition-colors"
                                                    >
                                                        {item.product.name}
                                                    </Link>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Qty: {item.quantity} × ₱{Number(item.price_snapshot).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-gray-900">
                                                        ₱{(item.quantity * item.price_snapshot).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Right Column - Order Summary & Shipping */}
                                <div className="space-y-6">
                                    {/* Order Summary */}
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                            <CurrencyDollarIcon className="h-5 w-5 mr-2 text-pamasoul-600" />
                                            Order Summary
                                        </h2>
                                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Subtotal</span>
                                                <span className="text-gray-900">₱{itemsSubtotal.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Shipping Fee</span>
                                                <span className="text-gray-900">
                                                    {shippingFee > 0 ? `₱${shippingFee.toLocaleString()}` : 'FREE'}
                                                </span>
                                            </div>
                                            <div className="border-t pt-3 mt-2">
                                                <div className="flex justify-between">
                                                    <span className="text-base font-bold text-gray-900">Total</span>
                                                    <span className="text-xl font-bold text-pamasoul-600">
                                                        ₱{orderTotal.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Shipping Address */}
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                            <MapPinIcon className="h-5 w-5 mr-2 text-pamasoul-600" />
                                            Shipping Address
                                        </h2>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-gray-700">{order.shipping_address}</p>
                                            <div className="flex items-center space-x-2 mt-3 text-sm text-gray-500">
                                                <TruckIcon className="h-4 w-4" />
                                                <span>{shippingFee > 0 ? 'Standard Shipping' : 'Free Shipping'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Delivery Estimate */}
                                    <div className="bg-pamasoul-50 rounded-lg p-4">
                                        <div className="flex items-center space-x-3">
                                            <TruckIcon className="h-6 w-6 text-pamasoul-600" />
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">Estimated Delivery</p>
                                                <p className="text-sm text-gray-600">
                                                    {(() => {
                                                        const deliveryDate = new Date(order.created_at);
                                                        deliveryDate.setDate(deliveryDate.getDate() + 5);
                                                        return deliveryDate.toLocaleDateString('en-US', { 
                                                            month: 'long', 
                                                            day: 'numeric' 
                                                        });
                                                    })()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="border-t mt-8 pt-6 flex flex-col sm:flex-row justify-between gap-4">
                                <Link
                                    href="/shop"
                                    className="inline-flex items-center justify-center px-6 py-3 bg-pamasoul-600 text-white font-semibold rounded-lg hover:bg-pamasoul-700 transition-colors"
                                >
                                    Continue Shopping
                                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                                </Link>
                                <Link
                                    href="/my-orders"
                                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    View My Orders
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* What's Next Section */}
                    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">What's Next?</h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div className="text-center">
                                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                                    <CheckCircleIcon className="h-6 w-6 text-blue-600" />
                                </div>
                                <p className="text-sm font-medium text-gray-900">Order Confirmed</p>
                                <p className="text-xs text-gray-500">We've received your order</p>
                            </div>
                            <div className="text-center">
                                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-2">
                                    <ShoppingBagIcon className="h-6 w-6 text-yellow-600" />
                                </div>
                                <p className="text-sm font-medium text-gray-900">Processing</p>
                                <p className="text-xs text-gray-500">Preparing your items</p>
                            </div>
                            <div className="text-center">
                                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                                    <TruckIcon className="h-6 w-6 text-green-600" />
                                </div>
                                <p className="text-sm font-medium text-gray-900">Shipped</p>
                                <p className="text-xs text-gray-500">On its way to you</p>
                            </div>
                        </div>
                    </div>

                    {/* Need Help */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            Have questions about your order?{" "}
                            <Link href="/contact" className="text-pamasoul-600 hover:text-pamasoul-700 font-medium">
                                Contact Support
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}