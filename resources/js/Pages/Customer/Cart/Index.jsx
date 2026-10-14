import CustomerLayout from "@/Layouts/CustomerLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import {
    ShoppingCartIcon,
    TrashIcon,
    ArrowRightIcon,
    TruckIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import toast from "react-hot-toast";
import ProductImage from "@/Components/ProductImage";
import QuantitySelector from "@/Components/QuantitySelector";
import { formatPeso } from "@/helpers/imageHelper";
export default function CartIndex({
    cartItems = [],
    selectedItems = [],
    subtotal,
    shippingFee,
    total,
    shippingConfig,
    pricesChanged,
}) {
    const [items, setItems] = useState(cartItems);
    const [summary, setSummary] = useState({
        selectedItems,
        subtotal,
        shippingFee,
        total,
    });
    const [busy, setBusy] = useState(false);
    const requestLock = useRef(false);
    useEffect(() => {
        setItems(cartItems);
        setSummary({ selectedItems, subtotal, shippingFee, total });
    }, [cartItems, selectedItems, subtotal, shippingFee, total]);
    const available = (item) =>
        item.product.is_active !== false && item.product.stock >= item.quantity;
    const selectable = items.filter(available).map((i) => i.id);
    const request = async (method, url, payload) => {
        if (requestLock.current) return;
        requestLock.current = true;
        setBusy(true);
        try {
            const { data } = await axios({
                method,
                url,
                data: payload,
                headers: { Accept: "application/json" },
            });
            if (
                !data ||
                typeof data !== "object" ||
                !Array.isArray(data.selectedItems)
            ) {
                throw new Error("Unexpected cart response");
            }
            setSummary(data);
            if (data.cartItems) setItems(data.cartItems);
            router.reload({ only: ["cartCount"], preserveScroll: true });
            return true;
        } catch (error) {
            const messages = error.response?.data?.errors;
            toast.error(
                messages
                    ? Object.values(messages).flat()[0]
                    : "Could not update your cart. Refresh and try again.",
            );
            return false;
        } finally {
            requestLock.current = false;
            setBusy(false);
        }
    };
    const select = async (ids) => {
        if (requestLock.current) return;
        const previous = summary;
        setSummary((current) => ({ ...current, selectedItems: ids }));
        const success = await request("post", "/cart/update-selection", {
            selected_items: ids,
        });
        if (!success) setSummary(previous);
    };
    const remove = (id) => {
        if (requestLock.current) return;
        requestLock.current = true;
        setBusy(true);
        router.delete(`/cart/${id}`, {
            preserveScroll: true,
            onError: () => toast.error("Could not remove this item."),
            onFinish: () => {
                requestLock.current = false;
                setBusy(false);
            },
        });
    };
    const selected = summary.selectedItems || [];
    const threshold = Number(shippingConfig?.free_threshold ?? 5000);
    return (
        <CustomerLayout>
            <Head title="Your cart" />
            <div className="store-container py-10 sm:py-14">
                <p className="kicker mb-3">Ready for the water</p>
                <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-pamasoul-dark">
                        Your tackle box.
                    </h1>
                    <Link
                        href="/shop"
                        className="text-sm font-medium text-pamasoul-700"
                    >
                        Continue shopping →
                    </Link>
                </div>
                {pricesChanged && (
                    <p
                        role="status"
                        className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 mb-6"
                    >
                        Product prices have been updated. Please review the
                        current totals before checkout.
                    </p>
                )}
                {!items.length ? (
                    <div className="commerce-panel text-center px-6 py-20">
                        <ShoppingCartIcon className="h-14 w-14 mx-auto text-pamasoul-300" />
                        <h2 className="text-2xl font-semibold text-pamasoul-dark mt-6">
                            Good adventures start with good gear.
                        </h2>
                        <p className="text-sm text-gray-500 mt-3">
                            Your cart is empty. Find something for your next
                            trip.
                        </p>
                        <Link href="/shop" className="button-primary mt-7">
                            Explore the collection{" "}
                            <ArrowRightIcon className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-[1fr_350px] gap-7 items-start">
                        <section
                            className="commerce-panel overflow-hidden"
                            aria-label="Cart items"
                            aria-busy={busy}
                        >
                            <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <label className="flex gap-3 items-center text-sm">
                                    <input
                                        type="checkbox"
                                        disabled={busy || !selectable.length}
                                        checked={
                                            selectable.length > 0 &&
                                            selectable.every((id) =>
                                                selected.includes(id),
                                            )
                                        }
                                        onChange={(e) =>
                                            select(
                                                e.target.checked
                                                    ? selectable
                                                    : [],
                                            )
                                        }
                                        className="rounded text-pamasoul-600 focus:ring-pamasoul-500"
                                    />
                                    Select available items
                                </label>
                                <span className="text-xs text-gray-500">
                                    {items.length} products
                                </span>
                            </div>
                            {items.map((item) => (
                                <article
                                    key={item.id}
                                    className="flex gap-3 sm:gap-5 p-4 sm:p-6 border-b border-gray-100 last:border-0"
                                >
                                    <input
                                        aria-label={`Select ${item.product.name}`}
                                        type="checkbox"
                                        disabled={busy || !available(item)}
                                        checked={selected.includes(item.id)}
                                        onChange={(e) =>
                                            select(
                                                e.target.checked
                                                    ? [...selected, item.id]
                                                    : selected.filter(
                                                          (id) =>
                                                              id !== item.id,
                                                      ),
                                            )
                                        }
                                        className="mt-8 rounded text-pamasoul-600 focus:ring-pamasoul-500"
                                    />
                                    <Link
                                        href={`/product/${item.product.slug}`}
                                        className="w-20 h-24 sm:w-28 sm:h-28 bg-pamasoul-50 rounded-xl shrink-0 p-2"
                                    >
                                        <ProductImage
                                            product={item.product}
                                            className="h-full w-full object-contain mix-blend-multiply"
                                        />
                                    </Link>
                                    <div className="min-w-0 flex-1">
                                        <Link
                                            href={`/product/${item.product.slug}`}
                                            className="text-sm font-semibold text-gray-900 hover:text-pamasoul-700 break-words"
                                        >
                                            {item.product.name}
                                        </Link>
                                        <p className="text-xs text-gray-500 mt-2">
                                            {formatPeso(item.price_snapshot)}{" "}
                                            each
                                        </p>
                                        {!available(item) && (
                                            <p className="text-xs text-red-600 mt-2">
                                                {item.product.is_active ===
                                                    false ||
                                                item.product.stock === 0
                                                    ? "Currently unavailable. Remove to continue."
                                                    : `Only ${item.product.stock} available. Reduce the quantity.`}
                                            </p>
                                        )}
                                        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
                                            <QuantitySelector
                                                quantity={item.quantity}
                                                maxStock={item.product.stock}
                                                disabled={
                                                    busy ||
                                                    item.product.is_active ===
                                                        false ||
                                                    item.product.stock === 0
                                                }
                                                onDecrease={() =>
                                                    request(
                                                        "patch",
                                                        `/cart/${item.id}`,
                                                        {
                                                            quantity: Math.min(
                                                                item.quantity -
                                                                    1,
                                                                item.product
                                                                    .stock,
                                                            ),
                                                        },
                                                    )
                                                }
                                                onIncrease={() =>
                                                    request(
                                                        "patch",
                                                        `/cart/${item.id}`,
                                                        {
                                                            quantity:
                                                                item.quantity +
                                                                1,
                                                        },
                                                    )
                                                }
                                            />
                                            <span className="text-sm font-semibold text-pamasoul-800">
                                                {formatPeso(
                                                    item.quantity *
                                                        item.price_snapshot,
                                                )}
                                            </span>
                                            <button
                                                onClick={() => remove(item.id)}
                                                disabled={busy}
                                                aria-label={`Remove ${item.product.name}`}
                                                className="p-3 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </section>
                        <aside className="commerce-panel p-6 lg:sticky lg:top-28">
                            <h2 className="font-semibold text-lg text-pamasoul-dark mb-5">
                                Order summary
                            </h2>
                            <div
                                className="text-sm space-y-4"
                                aria-live="polite"
                            >
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Subtotal ({selected.length} selected)
                                    </span>
                                    <span>
                                        {busy
                                            ? "Updating…"
                                            : formatPeso(summary.subtotal)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Shipping
                                    </span>
                                    <span>
                                        {selected.length === 0
                                            ? "—"
                                            : Number(summary.shippingFee) === 0
                                              ? "Free"
                                              : formatPeso(summary.shippingFee)}
                                    </span>
                                </div>
                                <div className="flex justify-between border-t border-gray-100 pt-5 font-bold text-lg text-pamasoul-800">
                                    <span>Total</span>
                                    <span>
                                        {busy
                                            ? "Updating…"
                                            : formatPeso(summary.total)}
                                    </span>
                                </div>
                            </div>
                            {threshold > 0 &&
                                selected.length > 0 &&
                                Number(summary.subtotal) < threshold && (
                                    <p className="mt-5 bg-pamasoul-50 rounded-xl p-3 text-xs leading-5 text-pamasoul-700 flex gap-2">
                                        <TruckIcon className="w-5 h-5 shrink-0" />
                                        Add{" "}
                                        {formatPeso(
                                            threshold -
                                                Number(summary.subtotal),
                                        )}{" "}
                                        for free shipping.
                                    </p>
                                )}
                            <button
                                onClick={() => router.visit("/checkout")}
                                disabled={busy || !selected.length}
                                className="button-primary w-full mt-6"
                            >
                                {busy ? "Updating…" : "Continue to checkout"}
                                <ArrowRightIcon className="w-4 h-4" />
                            </button>
                            <p className="text-xs leading-5 text-gray-500 mt-4">
                                Only selected, available products will be
                                included in your order.
                            </p>
                        </aside>
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}
