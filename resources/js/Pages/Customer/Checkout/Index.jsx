import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { 
    ArrowLeftIcon, 
    ShieldCheckIcon, 
    TruckIcon, 
    CreditCardIcon,
    BanknotesIcon,
    MapPinIcon,
    CheckCircleIcon,
    LockClosedIcon
} from '@heroicons/react/24/outline';
import { getProductImageUrl } from '@/helpers/imageHelper';

export default function CheckoutIndex({ cartItems, subtotal, shippingFee, shippingConfig }) {
    const [form, setForm] = useState({
        shipping_address: '',
        payment_method: 'COD',
    });
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    // Use shippingConfig from backend
    const numericSubtotal = Number(subtotal) || 0;
    const numericShippingFee = Number(shippingFee) || 0;
    const freeThreshold = shippingConfig?.free_threshold || 5000;
    const baseFee = shippingConfig?.base_fee || 50;
    
    const isFreeShipping = numericSubtotal >= freeThreshold;
    const finalTotal = isFreeShipping ? numericSubtotal : numericSubtotal + numericShippingFee;
    const remainingForFree = freeThreshold - numericSubtotal;
    const progressPercent = Math.min((numericSubtotal / freeThreshold) * 100, 100);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        router.post('/checkout', form, {
            onSuccess: () => {
                setSubmitting(false);
            },
            onError: (errors) => {
                setErrors(errors);
                setSubmitting(false);
            },
        });
    };

    return (
        <CustomerLayout>
            <Head title="Checkout - Pamasoul" />

            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/cart"
                                className="inline-flex items-center text-gray-600 hover:text-pamasoul-600 transition-colors"
                            >
                                <ArrowLeftIcon className="h-5 w-5 mr-1" />
                                Back to Cart
                            </Link>
                            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                        </div>
                        <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                            <LockClosedIcon className="h-4 w-4" />
                            <span>Secure Checkout</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Forms */}
                        <div className="lg:col-span-2">
                            {/* Progress Steps */}
                            <div className="mb-6 flex items-center justify-center space-x-4">
                                <div className="flex items-center">
                                    <div className="h-8 w-8 rounded-full bg-pamasoul-600 text-white flex items-center justify-center text-sm font-bold">1</div>
                                    <span className="ml-2 text-sm font-medium text-gray-900">Cart</span>
                                </div>
                                <div className="h-px w-12 bg-pamasoul-600" />
                                <div className="flex items-center">
                                    <div className="h-8 w-8 rounded-full bg-pamasoul-600 text-white flex items-center justify-center text-sm font-bold">2</div>
                                    <span className="ml-2 text-sm font-medium text-pamasoul-600">Checkout</span>
                                </div>
                                <div className="h-px w-12 bg-gray-300" />
                                <div className="flex items-center">
                                    <div className="h-8 w-8 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center text-sm font-bold">3</div>
                                    <span className="ml-2 text-sm text-gray-500">Confirmation</span>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md overflow-hidden">
                                {/* Shipping Information Section */}
                                <div className="p-6 border-b">
                                    <div className="flex items-center space-x-2 mb-4">
                                        <MapPinIcon className="h-5 w-5 text-pamasoul-600" />
                                        <h2 className="text-lg font-semibold text-gray-900">Shipping Information</h2>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Shipping Address *
                                        </label>
                                        <textarea
                                            name="shipping_address"
                                            value={form.shipping_address}
                                            onChange={handleChange}
                                            rows="3"
                                            placeholder="House/Unit #, Street, Barangay, City/Municipality, Province, ZIP Code"
                                            className={`w-full rounded-lg border-gray-300 focus:border-pamasoul-500 focus:ring-pamasoul-500 ${
                                                errors.shipping_address ? 'border-red-500' : ''
                                            }`}
                                            required
                                        />
                                        {errors.shipping_address && (
                                            <p className="mt-1 text-sm text-red-600">{errors.shipping_address}</p>
                                        )}
                                        <p className="mt-1 text-xs text-gray-500">
                                            Ensure accurate address for successful delivery
                                        </p>
                                    </div>
                                </div>

                                {/* Payment Method Section */}
                                <div className="p-6 border-b">
                                    <div className="flex items-center space-x-2 mb-4">
                                        <CreditCardIcon className="h-5 w-5 text-pamasoul-600" />
                                        <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <label className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${
                                            form.payment_method === 'COD' 
                                                ? 'border-pamasoul-600 bg-pamasoul-50' 
                                                : 'border-gray-200 hover:bg-gray-50'
                                        }`}>
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="COD"
                                                checked={form.payment_method === 'COD'}
                                                onChange={handleChange}
                                                className="h-4 w-4 text-pamasoul-600 focus:ring-pamasoul-500 mt-0.5"
                                            />
                                            <div className="ml-3 flex-1">
                                                <div className="flex items-center space-x-2">
                                                    <BanknotesIcon className="h-5 w-5 text-gray-500" />
                                                    <span className="font-medium text-gray-900">Cash on Delivery (COD)</span>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Pay in cash when your order arrives
                                                </p>
                                            </div>
                                        </label>

                                        <label className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${
                                            form.payment_method === 'BankTransfer' 
                                                ? 'border-pamasoul-600 bg-pamasoul-50' 
                                                : 'border-gray-200 hover:bg-gray-50'
                                        }`}>
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value="BankTransfer"
                                                checked={form.payment_method === 'BankTransfer'}
                                                onChange={handleChange}
                                                className="h-4 w-4 text-pamasoul-600 focus:ring-pamasoul-500 mt-0.5"
                                            />
                                            <div className="ml-3 flex-1">
                                                <div className="flex items-center space-x-2">
                                                    <CreditCardIcon className="h-5 w-5 text-gray-500" />
                                                    <span className="font-medium text-gray-900">Bank Transfer</span>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Pay via bank transfer (simulated for demo)
                                                </p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="p-6 bg-gray-50 flex flex-col sm:flex-row gap-4">
                                    <Link
                                        href="/cart"
                                        className="flex-1 text-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        ← Back to Cart
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 px-6 py-3 bg-pamasoul-600 text-white font-semibold rounded-lg hover:bg-pamasoul-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                    >
                                        {submitting ? (
                                            <>
                                                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                                Processing...
                                            </>
                                        ) : (
                                            'Place Order →'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <TruckIcon className="h-5 w-5 mr-2 text-pamasoul-600" />
                                    Order Summary
                                </h2>
                                
                                {/* Items List */}
                                <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex items-center space-x-3">
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
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-semibold text-gray-900">
                                                    ₱{(item.quantity * item.price_snapshot).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals */}
                                <div className="space-y-3 border-t pt-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-semibold">₱{numericSubtotal.toLocaleString()}</span>
                                    </div>
                                    
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping Fee</span>
                                        <div className="text-right">
                                            {isFreeShipping ? (
                                                <>
                                                    <span className="text-gray-400 line-through text-sm mr-2">₱{baseFee.toLocaleString()}</span>
                                                    <span className="text-green-600 font-semibold">FREE</span>
                                                </>
                                            ) : (
                                                <span className="font-semibold">₱{numericShippingFee.toLocaleString()}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Free Shipping Progress */}
                                {!isFreeShipping && remainingForFree > 0 && (
                                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                        <p className="text-xs text-blue-700">
                                            🚚 Add ₱{remainingForFree.toLocaleString()} more for FREE shipping
                                        </p>
                                        <div className="mt-2 h-1.5 bg-blue-200 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-pamasoul-600 rounded-full transition-all duration-300"
                                                style={{ width: `${progressPercent}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {isFreeShipping && (
                                    <div className="mt-3 p-3 bg-green-50 rounded-lg">
                                        <p className="text-xs text-green-700 text-center">
                                            🎉 Free Shipping Applied! You saved ₱{baseFee.toLocaleString()}
                                        </p>
                                    </div>
                                )}

                                {/* Total */}
                                <div className="flex justify-between mt-4 pt-4 border-t">
                                    <span className="text-base font-bold text-gray-900">Total</span>
                                    <span className="text-xl font-bold text-pamasoul-600">
                                        ₱{finalTotal.toLocaleString()}
                                    </span>
                                </div>

                                {/* Trust Badges */}
                                <div className="mt-6 pt-4 border-t text-center">
                                    <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                                        <div className="flex items-center space-x-1">
                                            <ShieldCheckIcon className="h-4 w-4 text-green-600" />
                                            <span>Secure Checkout</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <LockClosedIcon className="h-4 w-4 text-green-600" />
                                            <span>Privacy Protected</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}