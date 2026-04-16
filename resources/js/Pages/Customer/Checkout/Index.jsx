import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

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
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/cart"
                                className="inline-flex items-center text-gray-600 hover:text-pamasoul-800 transition-colors"
                            >
                                <ArrowLeftIcon className="h-5 w-5 mr-1" />
                                Back to Cart
                            </Link>
                            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Information</h2>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Shipping Address *
                                    </label>
                                    <textarea
                                        name="shipping_address"
                                        value={form.shipping_address}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="Street, Barangay, City, Province"
                                        className="w-full rounded-lg border-gray-300 focus:border-pamasoul focus:ring-pamasoul"
                                        required
                                    />
                                    {errors.shipping_address && (
                                        <p className="mt-1 text-sm text-red-600">{errors.shipping_address}</p>
                                    )}
                                </div>

                                <h2 className="text-xl font-bold text-gray-900 mb-4 mt-6">Payment Method</h2>
                                
                                <div className="space-y-3">
                                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="COD"
                                            checked={form.payment_method === 'COD'}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-pamasoul-600 focus:ring-pamasoul"
                                        />
                                        <div className="ml-3">
                                            <span className="font-medium text-gray-900">Cash on Delivery (COD)</span>
                                            <p className="text-sm text-gray-500">Pay when you receive your order</p>
                                        </div>
                                    </label>

                                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="BankTransfer"
                                            checked={form.payment_method === 'BankTransfer'}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-pamasoul-600 focus:ring-pamasoul"
                                        />
                                        <div className="ml-3">
                                            <span className="font-medium text-gray-900">Bank Transfer</span>
                                            <p className="text-sm text-gray-500">Pay via bank transfer (simulated)</p>
                                        </div>
                                    </label>
                                </div>

                                <div className="flex gap-4 mt-6">
                                    <Link
                                        href="/cart"
                                        className="flex-1 text-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Back to Cart
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 px-6 py-3 bg-pamasoul-600 text-white font-semibold rounded-lg hover:bg-pamasoul-800 transition-colors disabled:opacity-50"
                                    >
                                        {submitting ? 'Placing Order...' : 'Place Order'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                                
                                <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
                                    {cartItems.map((item) => (
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

                                <div className="space-y-3 border-t pt-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-semibold">₱{subtotal.toLocaleString()}</span>
                                    </div>
                                    
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping Fee</span>
                                        <div className="text-right">
                                            {isFreeShipping ? (
                                                <>
                                                    <span className="text-gray-400 line-through text-sm mr-2">₱{baseFee}</span>
                                                    <span className="text-green-600 font-semibold">FREE</span>
                                                </>
                                            ) : (
                                                <span className="font-semibold">₱{shippingFee.toLocaleString()}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {!isFreeShipping && (
                                    <div className="mt-3 p-2 bg-blue-50 rounded-lg">
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
                                    <div className="mt-3 p-2 bg-green-50 rounded-lg">
                                        <p className="text-xs text-green-700 text-center">
                                            🎉 Free Shipping Applied! You saved ₱{baseFee}
                                        </p>
                                    </div>
                                )}

                                <div className="flex justify-between mt-4 pt-4 border-t">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <span className="text-xl font-bold text-pamasoul-600">
                                        ₱{finalTotal.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}