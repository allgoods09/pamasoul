import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    ArrowLeftIcon, 
    TruckIcon, 
    CurrencyDollarIcon, 
    CalendarIcon,
    MapPinIcon,
    CreditCardIcon,
    ShoppingBagIcon,  // Changed from PackageIcon
    CheckCircleIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import { getProductImageUrl } from '@/helpers/imageHelper';

export default function OrdersShow({ order }) {
    const statusColors = {
        Pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: ClockIcon, label: 'Order Confirmed' },
        Paid: { bg: 'bg-blue-100', text: 'text-blue-800', icon: CurrencyDollarIcon, label: 'Payment Received' },
        Shipped: { bg: 'bg-purple-100', text: 'text-purple-800', icon: TruckIcon, label: 'On The Way' },
        Completed: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircleIcon, label: 'Delivered' },
    };

    const status = statusColors[order.status] || statusColors.Pending;
    const StatusIcon = status.icon;

    // Calculate timeline steps - simplified
    const getStepStatus = (stepName) => {
        const statusOrder = ['Pending', 'Paid', 'Shipped', 'Completed'];
        const currentIndex = statusOrder.indexOf(order.status);
        const stepIndex = statusOrder.indexOf(stepName);
        
        return stepIndex <= currentIndex;
    };

    const steps = [
        { status: 'Pending', label: 'Order Placed', icon: ShoppingBagIcon },
        { status: 'Paid', label: 'Payment Confirmed', icon: CurrencyDollarIcon },
        { status: 'Shipped', label: 'Order Shipped', icon: TruckIcon },
        { status: 'Completed', label: 'Order Delivered', icon: CheckCircleIcon },
    ];

    return (
        <CustomerLayout>
            <Head title={`Order #${order.id} - Pamasoul`} />

            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Back Button */}
                    <Link
                        href="/my-orders"
                        className="inline-flex items-center text-gray-600 hover:text-pamasoul-600 mb-6 transition-colors"
                    >
                        <ArrowLeftIcon className="h-5 w-5 mr-2" />
                        Back to My Orders
                    </Link>

                    {/* Order Header */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                        <div className="p-6 bg-gradient-to-r from-pamasoul-50 to-white border-b">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Placed on {new Date(order.created_at).toLocaleDateString('en-US', { 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${status.bg} ${status.text} self-start`}>
                                    <StatusIcon className="h-5 w-5" />
                                    <span className="font-semibold">{order.status}</span>
                                </div>
                            </div>
                        </div>

                        {/* Order Timeline */}
                        <div className="p-6 border-b">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Status</h2>
                            <div className="relative">
                                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
                                <div className="space-y-6 relative">
                                    {steps.map((step, index) => {
                                        const StepIcon = step.icon;
                                        const isCompleted = getStepStatus(step.status);
                                        const isCurrent = step.status === order.status;
                                        
                                        return (
                                            <div key={step.status} className="flex items-start space-x-4">
                                                <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                                                    isCompleted 
                                                        ? 'bg-pamasoul-600 text-white shadow-lg' 
                                                        : 'bg-gray-200 text-gray-400'
                                                } ${isCurrent ? 'ring-4 ring-pamasoul-200' : ''}`}>
                                                    <StepIcon className="h-6 w-6" />
                                                </div>
                                                <div className="flex-1 pt-1">
                                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                                        <div>
                                                            <p className={`font-semibold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                                                                {step.label}
                                                            </p>
                                                            {isCompleted && (
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    {new Date(order.created_at).toLocaleDateString()}
                                                                </p>
                                                            )}
                                                        </div>
                                                        {isCurrent && (
                                                            <span className="text-xs text-pamasoul-600 font-medium bg-pamasoul-50 px-2 py-1 rounded-full">
                                                                Current
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
                        {/* Shipping Info */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center space-x-2 mb-4">
                                <MapPinIcon className="h-5 w-5 text-pamasoul-600" />
                                <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
                            </div>
                            <div className="space-y-2">
                                <p className="text-gray-700">{order.shipping_address}</p>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <TruckIcon className="h-4 w-4" />
                                    <span>{order.shipping_fee > 0 ? `₱${order.shipping_fee.toLocaleString()} shipping fee` : 'Free Shipping'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center space-x-2 mb-4">
                                <CreditCardIcon className="h-5 w-5 text-pamasoul-600" />
                                <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
                            </div>
                            <div className="space-y-2">
                                <p className="text-gray-700 font-medium">
                                    {order.payment_method === 'COD' ? 'Cash on Delivery' : 'Bank Transfer'}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {order.payment_method === 'COD' 
                                        ? 'Pay when you receive your order' 
                                        : 'Bank transfer payment pending confirmation'}
                                </p>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center space-x-2 mb-4">
                                <CurrencyDollarIcon className="h-5 w-5 text-pamasoul-600" />
                                <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="text-gray-900">₱{(order.total - (order.shipping_fee || 0)).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping Fee</span>
                                    <span className="text-gray-900">{order.shipping_fee > 0 ? `₱${order.shipping_fee.toLocaleString()}` : 'Free'}</span>
                                </div>
                                <div className="border-t pt-3 mt-3">
                                    <div className="flex justify-between">
                                        <span className="font-bold text-gray-900">Total</span>
                                        <span className="text-xl font-bold text-pamasoul-600">₱{Number(order.total).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-4 bg-gray-50 border-b">
                            <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {order.items.map((item) => (
                                <div key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className="h-20 w-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
                                            className="text-lg font-semibold text-gray-900 hover:text-pamasoul-600 transition-colors"
                                        >
                                            {item.product.name}
                                        </Link>
                                        <p className="text-sm text-gray-500 mt-1">{item.product.category?.name}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center space-x-4">
                                                <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                                                <span className="text-sm text-gray-600">₱{Number(item.price_snapshot).toLocaleString()} each</span>
                                            </div>
                                            <span className="text-lg font-semibold text-pamasoul-600">
                                                ₱{(item.quantity * item.price_snapshot).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Need Help Section */}
                    <div className="mt-6 bg-pamasoul-50 rounded-lg p-6 text-center">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Need help with your order?</h3>
                        <p className="text-gray-600 mb-4">Contact our customer support team for assistance</p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center px-4 py-2 bg-pamasoul-600 text-white rounded-lg hover:bg-pamasoul-700 transition-colors"
                        >
                            Contact Support
                        </Link>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}