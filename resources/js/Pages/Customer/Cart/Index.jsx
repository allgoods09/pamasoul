import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { TrashIcon, PlusIcon, MinusIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { getProductImageUrl } from '@/helpers/imageHelper';

export default function CartIndex({ cartItems, selectedItems: initialSelectedItems, subtotal: initialSubtotal, shippingFee: initialShippingFee, total: initialTotal, shippingConfig }) {
    const [items, setItems] = useState(cartItems || []);
    const [selectedItems, setSelectedItems] = useState(initialSelectedItems || []);
    const [cartSubtotal, setCartSubtotal] = useState(initialSubtotal || 0);
    const [cartShippingFee, setCartShippingFee] = useState(initialShippingFee || 0);
    const [cartTotal, setCartTotal] = useState(initialTotal || 0);
    const [updating, setUpdating] = useState(false);

    // Use shippingConfig from backend
    const freeThreshold = shippingConfig?.free_threshold || 5000;
    const baseFee = shippingConfig?.base_fee || 50;

    // Update selection and recalculate
    const updateSelection = async (newSelectedItems) => {
        setUpdating(true);
        setSelectedItems(newSelectedItems);
        try {
            const response = await fetch('/cart/update-selection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({ selected_items: newSelectedItems }),
            });
            
            const data = await response.json();
            setCartSubtotal(data.subtotal);
            setCartShippingFee(data.shippingFee);
            setCartTotal(data.total);
        } catch (error) {
            console.error('Error updating selection:', error);
        } finally {
            setUpdating(false);
        }
    };

    const toggleSelectItem = (itemId) => {
        let newSelected;
        if (selectedItems.includes(itemId)) {
            newSelected = selectedItems.filter(id => id !== itemId);
        } else {
            newSelected = [...selectedItems, itemId];
        }
        updateSelection(newSelected);
    };

    const toggleSelectAll = () => {
        const allSelected = selectedItems.length === items.length;
        if (allSelected) {
            updateSelection([]);
        } else {
            updateSelection(items.map(item => item.id));
        }
    };

    const updateQuantity = async (cartItemId, quantity) => {
        if (quantity < 1) return;
        
        try {
            const response = await fetch(`/cart/${cartItemId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({ quantity }),
            });
            
            const data = await response.json();
            
            if (data.success) {
                setItems(prev => prev.map(item => 
                    item.id === cartItemId ? { ...item, quantity } : item
                ));
                
                setCartSubtotal(data.subtotal);
                setCartShippingFee(data.shippingFee);
                setCartTotal(data.total);
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const removeItem = async (cartItemId) => {
        if (!confirm('Remove this item from cart?')) return;
        
        try {
            await fetch(`/cart/${cartItemId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
            });
            
            const newItems = items.filter(item => item.id !== cartItemId);
            setItems(newItems);
            setSelectedItems(prev => prev.filter(id => id !== cartItemId));
            
            if (newItems.length === 0) {
                setCartSubtotal(0);
                setCartShippingFee(0);
                setCartTotal(0);
            }
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            alert('Please select at least one item to checkout.');
            return;
        }
        router.visit('/checkout');
    };

    const allSelected = items.length > 0 && selectedItems.length === items.length;
    const hasSelectedItems = selectedItems.length > 0;

    // Get shipping message using dynamic threshold
    const getShippingMessage = () => {
        if (cartSubtotal >= freeThreshold) {
            return { text: "Free Shipping Applied! 🎉", isFree: true };
        }
        const remaining = freeThreshold - cartSubtotal;
        return { text: `Add ₱${remaining.toLocaleString()} more for FREE shipping`, isFree: false };
    };

    const shippingMessage = getShippingMessage();
    const progressPercent = Math.min((cartSubtotal / freeThreshold) * 100, 100);
    const isFreeShipping = cartSubtotal >= freeThreshold;

    if (items.length === 0) {
        return (
            <CustomerLayout>
                <Head title="Cart - Pamasoul" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
                        <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
                        <Link
                            href="/shop"
                            className="inline-flex items-center justify-center px-6 py-3 bg-pamasoul-600 text-white font-semibold rounded-lg hover:bg-pamasoul-800"
                        >
                            Continue Shopping
                            <ArrowRightIcon className="ml-2 h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </CustomerLayout>
        );
    }

    return (
        <CustomerLayout>
            <Head title="Cart - Pamasoul" />

            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="p-4 bg-gray-50 border-b flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={allSelected}
                                        onChange={toggleSelectAll}
                                        disabled={updating}
                                        className="h-4 w-4 text-pamasoul-600 rounded border-gray-300 focus:ring-pamasoul"
                                    />
                                    <label className="ml-3 text-sm font-medium text-gray-700">
                                        Select All ({items.length} items)
                                    </label>
                                </div>

                                <div className="divide-y divide-gray-200">
                                    {items.map((item) => {
                                        const isSelected = selectedItems.includes(item.id);
                                        return (
                                            <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
                                                <div className="flex items-start">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => toggleSelectItem(item.id)}
                                                        disabled={updating}
                                                        className="h-4 w-4 text-pamasoul-600 rounded border-gray-300 focus:ring-pamasoul mt-1"
                                                    />
                                                </div>

                                                <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={getProductImageUrl(item.product)}
                                                        alt={item.product.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src = 'https://picsum.photos/id/20/400/300';
                                                        }}
                                                    />
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                                        <div>
                                                            <Link
                                                                href={`/product/${item.product.id}`}
                                                                className="text-lg font-semibold text-gray-900 hover:text-pamasoul-800"
                                                            >
                                                                {item.product.name}
                                                            </Link>
                                                            <p className="text-sm text-gray-500">{item.product.category?.name}</p>
                                                            <p className="text-lg font-bold text-pamasoul-600 mt-1">
                                                                ₱{Number(item.price_snapshot).toLocaleString()}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="text-red-500 hover:text-red-700 mt-2 sm:mt-0"
                                                        >
                                                            <TrashIcon className="h-5 w-5" />
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-4">
                                                        <div className="flex items-center space-x-2">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                className="w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
                                                            >
                                                                <MinusIcon className="h-4 w-4 mx-auto" />
                                                            </button>
                                                            <span className="w-12 text-center font-semibold">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                className="w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
                                                            >
                                                                <PlusIcon className="h-4 w-4 mx-auto" />
                                                            </button>
                                                        </div>
                                                        <p className="font-semibold text-gray-900">
                                                            ₱{(item.quantity * item.price_snapshot).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="mt-4">
                                <Link href="/shop" className="text-pamasoul-600 hover:text-pamasoul-800">
                                    ← Continue Shopping
                                </Link>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                                
                                <div className="space-y-3 border-b pb-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Subtotal ({selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'})
                                        </span>
                                        <span className="font-semibold">₱{cartSubtotal.toLocaleString()}</span>
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
                                                <span className="font-semibold">₱{cartShippingFee.toLocaleString()}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {!isFreeShipping && (
                                    <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                                        <p className="text-xs text-blue-700">
                                            🚚 {shippingMessage.text}
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
                                        <p className="text-xs text-green-700">
                                            🎉 {shippingMessage.text}
                                        </p>
                                    </div>
                                )}

                                <div className="flex justify-between mt-4 pb-4 border-b">
                                    <span className="text-lg font-bold text-gray-900">Total</span>
                                    <span className="text-xl font-bold text-pamasoul-600">
                                        ₱{cartTotal.toLocaleString()}
                                    </span>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={!hasSelectedItems}
                                    className={`w-full flex items-center justify-center space-x-2 mt-6 px-6 py-3 font-semibold rounded-lg transition-colors ${
                                        hasSelectedItems
                                            ? 'bg-pamasoul-600 text-white hover:bg-pamasoul-800'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    <span>Proceed to Checkout</span>
                                    <ArrowRightIcon className="h-5 w-5" />
                                </button>

                                <p className="text-xs text-gray-500 text-center mt-4">
                                    Only selected items will be included in checkout
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}