import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    EyeIcon, 
    TruckIcon, 
    CurrencyDollarIcon, 
    CalendarIcon,
    ShoppingBagIcon,
    ChevronRightIcon 
} from '@heroicons/react/24/outline';
import { getProductImageUrl } from '@/helpers/imageHelper';

export default function OrdersIndex({ orders }) {
    const statusColors = {
        Pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '⏳' },
        Paid: { bg: 'bg-blue-100', text: 'text-blue-800', icon: '💰' },
        Shipped: { bg: 'bg-purple-100', text: 'text-purple-800', icon: '🚚' },
        Completed: { bg: 'bg-green-100', text: 'text-green-800', icon: '✅' },
    };

    // Calculate order stats
    const totalOrders = orders.data.length;
    const totalSpent = orders.data.reduce((sum, order) => sum + parseFloat(order.total), 0);
    const pendingOrders = orders.data.filter(o => o.status === 'Pending').length;

    return (
        <CustomerLayout>
            <Head title="My Orders - Pamasoul" />

            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header with Stats */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
                        <p className="text-gray-600">Track and manage your fishing gear orders</p>
                    </div>

                    {/* Stats Cards */}
                    {orders.data.length > 0 && (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
                            <div className="bg-white rounded-lg shadow p-4">
                                <div className="flex items-center">
                                    <div className="rounded-full bg-pamasoul-100 p-3">
                                        <ShoppingBagIcon className="h-6 w-6 text-pamasoul-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm text-gray-500">Total Orders</p>
                                        <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-4">
                                <div className="flex items-center">
                                    <div className="rounded-full bg-green-100 p-3">
                                        <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm text-gray-500">Total Spent</p>
                                        <p className="text-2xl font-bold text-green-600">₱{totalSpent.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-4">
                                <div className="flex items-center">
                                    <div className="rounded-full bg-yellow-100 p-3">
                                        <span className="text-xl">⏳</span>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm text-gray-500">Pending Orders</p>
                                        <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {orders.data.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-12 text-center">
                            <ShoppingBagIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
                            <p className="text-gray-500 mb-6">You haven't placed any orders yet. Start exploring our premium fishing gear!</p>
                            <Link
                                href="/shop"
                                className="inline-flex items-center px-6 py-3 bg-pamasoul-600 text-white font-semibold rounded-lg hover:bg-pamasoul-700 transition-colors"
                            >
                                Start Shopping
                                <ChevronRightIcon className="ml-2 h-5 w-5" />
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.data.map((order) => {
                                const status = statusColors[order.status] || statusColors.Pending;
                                const itemCount = order.items?.length || 0;
                                const firstItems = order.items?.slice(0, 2) || [];
                                
                                return (
                                    <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                        {/* Order Header */}
                                        <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-b">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex items-center space-x-2">
                                                        <ShoppingBagIcon className="h-5 w-5 text-gray-400" />
                                                        <span className="font-semibold text-gray-900">Order #{order.id}</span>
                                                    </div>
                                                    <div className="h-4 w-px bg-gray-300 hidden sm:block" />
                                                    <div className="flex items-center space-x-2">
                                                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                                                        <span className="text-sm text-gray-600">
                                                            {new Date(order.created_at).toLocaleDateString('en-US', { 
                                                                year: 'numeric', 
                                                                month: 'long', 
                                                                day: 'numeric' 
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <span className={`inline-flex items-center space-x-1 px-3 py-1 text-xs font-semibold rounded-full ${status.bg} ${status.text}`}>
                                                        <span>{status.icon}</span>
                                                        <span>{order.status}</span>
                                                    </span>
                                                    <Link
                                                        href={`/my-orders/${order.id}`}                                                        
                                                        className="inline-flex items-center text-pamasoul-600 hover:text-pamasoul-800 font-medium"
                                                    >
                                                        View Details
                                                        <EyeIcon className="ml-1 h-4 w-4" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Body */}
                                        <div className="p-4">
                                            {/* Items Preview */}
                                            <div className="space-y-3">
                                                {firstItems.map((item) => (
                                                    <div key={item.id} className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3 flex-1">
                                                            <div className="h-12 w-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
                                                                <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                                                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-semibold text-gray-900">
                                                                ₱{(item.quantity * item.price_snapshot).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                                
                                                {itemCount > 2 && (
                                                    <p className="text-sm text-gray-500 text-center pt-2">
                                                        + {itemCount - 2} more item(s)
                                                    </p>
                                                )}
                                            </div>

                                            {/* Order Footer */}
                                            <div className="border-t mt-4 pt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                                <div className="flex items-center space-x-4 text-sm">
                                                    <div className="flex items-center space-x-1">
                                                        <TruckIcon className="h-4 w-4 text-gray-400" />
                                                        <span className="text-gray-600">
                                                            {order.shipping_fee > 0 ? `₱${order.shipping_fee.toLocaleString()} shipping` : 'Free Shipping'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
                                                        <span className="text-gray-600">
                                                            {order.payment_method === 'COD' ? 'Cash on Delivery' : 'Bank Transfer'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-500">Order Total</p>
                                                    <p className="text-xl font-bold text-pamasoul-600">
                                                        ₱{Number(order.total).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {orders.links && orders.data.length > 0 && (
                        <div className="mt-8 flex justify-center">
                            <div className="flex space-x-2">
                                {orders.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            link.active
                                                ? 'bg-pamasoul-600 text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
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