import CustomerLayout from "@/Layouts/CustomerLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
    TrashIcon,
    PlusIcon,
    MinusIcon,
    ArrowRightIcon,
    ShoppingBagIcon,
    TruckIcon,
    CurrencyDollarIcon,
    ShieldCheckIcon,
    HeartIcon,
    BoltIcon,
} from "@heroicons/react/24/outline";
import { getProductImageUrl } from "@/helpers/imageHelper";
import toast, { Toaster } from "react-hot-toast";

export default function CartIndex({
    cartItems,
    selectedItems: initialSelectedItems,
    subtotal: initialSubtotal,
    shippingFee: initialShippingFee,
    total: initialTotal,
    shippingConfig,
}) {
    const [items, setItems] = useState(cartItems || []);
    const [selectedItems, setSelectedItems] = useState(
        initialSelectedItems || [],
    );
    const [cartSubtotal, setCartSubtotal] = useState(initialSubtotal || 0);
    const [cartShippingFee, setCartShippingFee] = useState(
        initialShippingFee || 0,
    );
    const [cartTotal, setCartTotal] = useState(initialTotal || 0);
    const [updating, setUpdating] = useState(false);

    // Use shippingConfig from backend
    const freeThreshold = shippingConfig?.free_threshold || 5000;
    const baseFee = shippingConfig?.base_fee || 50;

    // Effect to automatically uncheck out-of-stock items
    useEffect(() => {
        const outOfStockItemIds = items
            .filter((item) => item.product.stock === 0)
            .map((item) => item.id);

        if (outOfStockItemIds.length > 0) {
            const newSelectedItems = selectedItems.filter(
                (id) => !outOfStockItemIds.includes(id),
            );

            if (newSelectedItems.length !== selectedItems.length) {
                updateSelection(newSelectedItems);
            }
        }
    }, [items]);

    const updateSelection = async (newSelectedItems) => {
        setUpdating(true);
        setSelectedItems(newSelectedItems);

        if (newSelectedItems.length === 0) {
            setCartSubtotal(0);
            setCartShippingFee(0);
            setCartTotal(0);
            setUpdating(false);
            return;
        }

        try {
            const response = await fetch("/cart/update-selection", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector(
                        'meta[name="csrf-token"]',
                    ).content,
                },
                body: JSON.stringify({ selected_items: newSelectedItems }),
            });

            const data = await response.json();
            setCartSubtotal(data.subtotal);
            setCartShippingFee(data.shippingFee);
            setCartTotal(data.total);
        } catch (error) {
            console.error("Error updating selection:", error);
        } finally {
            setUpdating(false);
        }
    };

    const toggleSelectItem = (itemId) => {
        let newSelected;
        if (selectedItems.includes(itemId)) {
            newSelected = selectedItems.filter((id) => id !== itemId);
        } else {
            newSelected = [...selectedItems, itemId];
        }
        updateSelection(newSelected);
    };

    const toggleSelectAll = () => {
        const selectableItems = items.filter((item) => item.product.stock > 0);
        const allSelected =
            selectedItems.length === selectableItems.length &&
            selectableItems.length > 0;

        if (allSelected) {
            updateSelection([]);
        } else {
            updateSelection(selectableItems.map((item) => item.id));
        }
    };

    const updateQuantity = async (cartItemId, quantity) => {
        if (quantity < 1) return;

        const item = items.find((i) => i.id === cartItemId);
        if (item && quantity > item.product.stock) {
            toast.error(`Only ${item.product.stock} items available in stock.`);
            return;
        }

        try {
            const response = await fetch(`/cart/${cartItemId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector(
                        'meta[name="csrf-token"]',
                    ).content,
                },
                body: JSON.stringify({ quantity }),
            });

            const data = await response.json();

            if (data.success) {
                setItems((prev) =>
                    prev.map((item) =>
                        item.id === cartItemId ? { ...item, quantity } : item,
                    ),
                );

                if (selectedItems.length > 0) {
                    setCartSubtotal(data.subtotal);
                    setCartShippingFee(data.shippingFee);
                    setCartTotal(data.total);
                }
                toast.success("Quantity updated");
            }
        } catch (error) {
            console.error("Error updating quantity:", error);
            toast.error("Failed to update quantity");
        }
    };

    const removeItem = async (cartItemId) => {
        if (!confirm("Remove this item from cart?")) return;

        try {
            await fetch(`/cart/${cartItemId}`, {
                method: "DELETE",
                headers: {
                    "X-CSRF-TOKEN": document.querySelector(
                        'meta[name="csrf-token"]',
                    ).content,
                },
            });

            const newItems = items.filter((item) => item.id !== cartItemId);
            setItems(newItems);

            const newSelectedItems = selectedItems.filter(
                (id) => id !== cartItemId,
            );
            setSelectedItems(newSelectedItems);

            if (newItems.length === 0 || newSelectedItems.length === 0) {
                setCartSubtotal(0);
                setCartShippingFee(0);
                setCartTotal(0);
            } else {
                updateSelection(newSelectedItems);
            }
            toast.success("Item removed from cart");
        } catch (error) {
            console.error("Error removing item:", error);
            toast.error("Failed to remove item");
        }
    };

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            toast.error("Please select at least one item to checkout.");
            return;
        }
        router.visit("/checkout");
    };

    const selectableItemsCount = items.filter(
        (item) => item.product.stock > 0,
    ).length;
    const allSelected =
        selectableItemsCount > 0 &&
        selectedItems.length === selectableItemsCount;
    const hasSelectedItems = selectedItems.length > 0;

    const getShippingMessage = () => {
        if (!hasSelectedItems) {
            return { text: "Select items to see shipping", isFree: false };
        }
        if (cartSubtotal >= freeThreshold) {
            return { text: "Free Shipping Applied! 🎉", isFree: true };
        }
        const remaining = freeThreshold - cartSubtotal;
        return {
            text: `Add ₱${remaining.toLocaleString()} more for FREE shipping`,
            isFree: false,
        };
    };

    const shippingMessage = getShippingMessage();
    const progressPercent = hasSelectedItems
        ? Math.min((cartSubtotal / freeThreshold) * 100, 100)
        : 0;
    const isFreeShipping = hasSelectedItems && cartSubtotal >= freeThreshold;

    const displaySubtotal = hasSelectedItems ? cartSubtotal : 0;
    const displayShippingFee = hasSelectedItems ? cartShippingFee : 0;
    const displayTotal = hasSelectedItems ? cartTotal : 0;
    const selectedCount = selectedItems.length;

    if (items.length === 0) {
        return (
            <CustomerLayout>
                <Head title="Cart - Pamasoul" />
                <Toaster position="top-right" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md mx-auto">
                        <ShoppingBagIcon className="mx-auto h-20 w-20 text-gray-300 mb-4" />
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Your Cart is Empty
                        </h1>
                        <p className="text-gray-500 mb-8">
                            Looks like you haven't added any items to your cart
                            yet.
                        </p>
                        <Link
                            href="/shop"
                            className="inline-flex items-center justify-center px-6 py-3 bg-pamasoul-600 text-white font-semibold rounded-lg hover:bg-pamasoul-700 transition-colors"
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
            <Toaster position="top-right" />

            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Shopping Cart
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Review and manage your items before checkout
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={allSelected}
                                            onChange={toggleSelectAll}
                                            disabled={
                                                updating ||
                                                selectableItemsCount === 0
                                            }
                                            className="h-4 w-4 text-pamasoul-600 rounded border-gray-300 focus:ring-pamasoul-500"
                                        />
                                        <label className="ml-3 text-sm font-medium text-gray-700">
                                            Select All ({selectableItemsCount}{" "}
                                            available items)
                                        </label>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        Price
                                    </span>
                                </div>

                                <div className="divide-y divide-gray-200">
                                    {items.map((item) => {
                                        const isSelected =
                                            selectedItems.includes(item.id);
                                        const currentStock = item.product.stock;
                                        const isLowStock =
                                            currentStock > 0 &&
                                            currentStock <= 5;
                                        const isOutOfStock = currentStock === 0;

                                        return (
                                            <div
                                                key={item.id}
                                                className={`relative p-4 sm:p-6 flex flex-col sm:flex-row gap-4 transition-all ${
                                                    isOutOfStock
                                                        ? "bg-gray-50 opacity-60"
                                                        : ""
                                                }`}
                                            >
                                                {isOutOfStock && (
                                                    <div className="absolute inset-0 bg-gray-100 bg-opacity-50 pointer-events-none rounded-xl" />
                                                )}

                                                <div className="flex items-start relative z-10">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() =>
                                                            toggleSelectItem(
                                                                item.id,
                                                            )
                                                        }
                                                        disabled={
                                                            updating ||
                                                            isOutOfStock
                                                        }
                                                        className="h-4 w-4 text-pamasoul-600 rounded border-gray-300 focus:ring-pamasoul-500 mt-1"
                                                    />
                                                </div>

                                                <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative z-10">
                                                    <img
                                                        src={getProductImageUrl(
                                                            item.product,
                                                        )}
                                                        alt={item.product.name}
                                                        className={`w-full h-full object-cover ${
                                                            isOutOfStock
                                                                ? "grayscale"
                                                                : ""
                                                        }`}
                                                        onError={(e) => {
                                                            e.target.src =
                                                                "https://picsum.photos/id/20/400/300";
                                                        }}
                                                    />
                                                    {isOutOfStock && (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                                            <span className="text-white text-xs font-bold bg-red-600 px-2 py-1 rounded">
                                                                OUT OF STOCK
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1 relative z-10">
                                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                                        <div className="flex-1">
                                                            <Link
                                                                href={`/product/${item.product.slug}`}
                                                                className={`text-base font-semibold ${
                                                                    isOutOfStock
                                                                        ? "text-gray-500 line-through"
                                                                        : "text-gray-900 hover:text-pamasoul-600"
                                                                }`}
                                                            >
                                                                {
                                                                    item.product
                                                                        .name
                                                                }
                                                            </Link>
                                                            <p className="text-sm text-gray-500">
                                                                {
                                                                    item.product
                                                                        .category
                                                                        ?.name
                                                                }
                                                            </p>

                                                            {/* Stock Status */}
                                                            <div className="mt-2">
                                                                {currentStock >
                                                                    5 && (
                                                                    <p className="text-xs text-green-600 flex items-center">
                                                                        <BoltIcon className="h-3 w-3 mr-1" />
                                                                        In stock
                                                                        - ready
                                                                        to ship!
                                                                    </p>
                                                                )}
                                                                {isLowStock && (
                                                                    <p className="text-xs text-yellow-600 flex items-center">
                                                                        <span className="mr-1">
                                                                            ⚠️
                                                                        </span>
                                                                        Only{" "}
                                                                        {
                                                                            currentStock
                                                                        }{" "}
                                                                        left -
                                                                        order
                                                                        soon!
                                                                    </p>
                                                                )}
                                                                {isOutOfStock && (
                                                                    <p className="text-xs text-red-600">
                                                                        ✗ Out of
                                                                        stock -
                                                                        please
                                                                        remove
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p
                                                                className={`text-lg font-bold ${
                                                                    isOutOfStock
                                                                        ? "text-gray-400 line-through"
                                                                        : "text-pamasoul-600"
                                                                }`}
                                                            >
                                                                ₱
                                                                {Number(
                                                                    item.price_snapshot,
                                                                ).toLocaleString()}
                                                            </p>
                                                            <button
                                                                onClick={() =>
                                                                    removeItem(
                                                                        item.id,
                                                                    )
                                                                }
                                                                className="text-red-500 hover:text-red-700 mt-1 text-sm"
                                                            >
                                                                <TrashIcon className="h-4 w-4 inline mr-1" />
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-4">
                                                        <div className="flex items-center space-x-2">
                                                            <button
                                                                onClick={() =>
                                                                    updateQuantity(
                                                                        item.id,
                                                                        item.quantity -
                                                                            1,
                                                                    )
                                                                }
                                                                disabled={
                                                                    isOutOfStock
                                                                }
                                                                className={`w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors ${
                                                                    isOutOfStock
                                                                        ? "opacity-50 cursor-not-allowed"
                                                                        : ""
                                                                }`}
                                                            >
                                                                <MinusIcon className="h-4 w-4 mx-auto" />
                                                            </button>
                                                            <span className="w-12 text-center font-semibold">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() =>
                                                                    updateQuantity(
                                                                        item.id,
                                                                        item.quantity +
                                                                            1,
                                                                    )
                                                                }
                                                                disabled={
                                                                    isOutOfStock ||
                                                                    item.quantity >=
                                                                        currentStock
                                                                }
                                                                className={`w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors ${
                                                                    isOutOfStock ||
                                                                    item.quantity >=
                                                                        currentStock
                                                                        ? "opacity-50 cursor-not-allowed"
                                                                        : ""
                                                                }`}
                                                            >
                                                                <PlusIcon className="h-4 w-4 mx-auto" />
                                                            </button>
                                                            {!isOutOfStock && (
                                                                <span className="text-xs text-gray-500 ml-2">
                                                                    {
                                                                        currentStock
                                                                    }{" "}
                                                                    available
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p
                                                            className={`font-semibold text-lg ${
                                                                isOutOfStock
                                                                    ? "text-gray-400"
                                                                    : "text-gray-900"
                                                            }`}
                                                        >
                                                            ₱
                                                            {(
                                                                item.quantity *
                                                                item.price_snapshot
                                                            ).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="mt-6">
                                <Link
                                    href="/shop"
                                    className="inline-flex items-center text-pamasoul-600 hover:text-pamasoul-700 font-medium"
                                >
                                    ← Continue Shopping
                                </Link>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">
                                    Order Summary
                                </h2>

                                <div className="space-y-3 pb-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Subtotal ({selectedCount}{" "}
                                            {selectedCount === 1
                                                ? "item"
                                                : "items"}
                                            )
                                        </span>
                                        <span className="font-semibold">
                                            {hasSelectedItems
                                                ? `₱${displaySubtotal.toLocaleString()}`
                                                : "₱0"}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Shipping Fee
                                        </span>
                                        <div className="text-right">
                                            {!hasSelectedItems ? (
                                                <span className="text-gray-400">
                                                    ₱0
                                                </span>
                                            ) : isFreeShipping ? (
                                                <>
                                                    <span className="text-gray-400 line-through text-sm mr-2">
                                                        ₱
                                                        {baseFee.toLocaleString()}
                                                    </span>
                                                    <span className="text-green-600 font-semibold">
                                                        FREE
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="font-semibold">
                                                    ₱
                                                    {displayShippingFee.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {hasSelectedItems && !isFreeShipping && (
                                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                        <p className="text-xs text-blue-700">
                                            🚚 {shippingMessage.text}
                                        </p>
                                        <div className="mt-2 h-1.5 bg-blue-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-pamasoul-600 rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${progressPercent}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {hasSelectedItems && isFreeShipping && (
                                    <div className="mt-3 p-3 bg-green-50 rounded-lg">
                                        <p className="text-xs text-green-700 text-center">
                                            🎉 {shippingMessage.text}
                                        </p>
                                    </div>
                                )}

                                {!hasSelectedItems && (
                                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-500 text-center">
                                            Select items to see shipping and
                                            total
                                        </p>
                                    </div>
                                )}

                                <div className="flex justify-between mt-4 pt-4 border-t">
                                    <span className="text-base font-bold text-gray-900">
                                        Total
                                    </span>
                                    <span className="text-xl font-bold text-pamasoul-600">
                                        ₱{displayTotal.toLocaleString()}
                                    </span>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={!hasSelectedItems}
                                    className={`w-full flex items-center justify-center space-x-2 mt-6 px-6 py-3 font-semibold rounded-lg transition-colors ${
                                        hasSelectedItems
                                            ? "bg-pamasoul-600 text-white hover:bg-pamasoul-700"
                                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    }`}
                                >
                                    <span>Proceed to Checkout</span>
                                    <ArrowRightIcon className="h-5 w-5" />
                                </button>

                                {/* Trust Badges */}
                                <div className="mt-6 pt-4 border-t text-center">
                                    <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                                        <div className="flex items-center space-x-1">
                                            <ShieldCheckIcon className="h-4 w-4 text-green-600" />
                                            <span>Secure Checkout</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <TruckIcon className="h-4 w-4 text-pamasoul-600" />
                                            <span>Fast Shipping</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-xs text-gray-400 text-center mt-4">
                                    Only selected items will be included in
                                    checkout
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
