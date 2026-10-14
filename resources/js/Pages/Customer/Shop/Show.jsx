import CustomerLayout from "@/Layouts/CustomerLayout";
import { Head, Link } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import {
    ArrowLeftIcon,
    ShoppingCartIcon,
    CheckIcon,
    ArrowsPointingOutIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import ProductCard from "@/Components/ProductCard";
import ProductImage from "@/Components/ProductImage";
import QuantitySelector from "@/Components/QuantitySelector";
import Reveal from "@/Components/Motion/Reveal";
import usePointerMotion from "@/hooks/usePointerMotion";
import useCartAction from "@/hooks/useCartAction";
import { formatPeso } from "@/helpers/imageHelper";
export default function ProductShow({ product, relatedProducts = [] }) {
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const [zoom, setZoom] = useState(false);
    const timer = useRef();
    const pointerRef = usePointerMotion();
    const { adding, add } = useCartAction();
    useEffect(() => {
        setQuantity(1);
        setAdded(false);
    }, [product.id]);
    useEffect(() => () => clearTimeout(timer.current), []);
    const unavailable = product.is_active === false || product.stock <= 0;
    const addProduct = () =>
        add(product, quantity, () => {
            setAdded(true);
            clearTimeout(timer.current);
            timer.current = setTimeout(() => setAdded(false), 2000);
        });
    return (
        <CustomerLayout>
            <Head title={product.name} />
            <div className="store-container py-8 sm:py-12">
                <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-sm text-pamasoul-700 mb-7"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Back to the collection
                </Link>
                <div className="grid md:grid-cols-2 gap-8 lg:gap-14 items-start">
                    <div
                        ref={pointerRef}
                        className="product-view relative rounded-3xl bg-pamasoul-50/70 border border-pamasoul-100 p-8 sm:p-12 overflow-hidden aspect-square"
                    >
                        <ProductImage
                            product={product}
                            loading="eager"
                            className="product-detail-image w-full h-full object-contain mix-blend-multiply"
                        />
                        <button
                            onClick={() => setZoom(true)}
                            className="absolute bottom-4 right-4 rounded-full p-3 bg-white shadow-sm hover:shadow-lg text-pamasoul-700"
                            aria-label="Open larger product image"
                        >
                            <ArrowsPointingOutIcon className="w-5 h-5" />
                        </button>
                        <span className="absolute top-5 left-5 text-xs font-medium rounded-full bg-white px-3 py-2 text-pamasoul-700">
                            {product.category?.name}
                        </span>
                    </div>
                    <div className="pt-2">
                        <p className="kicker mb-3">The PamaSoul collection</p>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-pamasoul-dark tracking-tight">
                            {product.name}
                        </h1>
                        <p className="text-2xl sm:text-3xl font-bold text-pamasoul-700 mt-5">
                            {formatPeso(product.price)}
                        </p>
                        <p
                            className={`text-sm mt-4 flex gap-2 items-center ${unavailable ? "text-gray-500" : product.stock <= 5 ? "text-amber-700" : "text-green-700"}`}
                        >
                            <span className="h-2 w-2 rounded-full bg-current" />
                            {unavailable
                                ? "Currently unavailable"
                                : product.stock <= 5
                                  ? `Only ${product.stock} left in stock`
                                  : `In stock · ${product.stock} available`}
                        </p>
                        <p className="text-sm text-gray-600 leading-7 mt-7">
                            {product.description ||
                                "Product information will be added soon. Contact us if you need help choosing your gear."}
                        </p>
                        {!unavailable && (
                            <div className="mt-7">
                                <p className="text-xs font-medium text-gray-500 mb-3">
                                    Quantity
                                </p>
                                <QuantitySelector
                                    quantity={quantity}
                                    maxStock={product.stock}
                                    disabled={adding}
                                    onDecrease={() => setQuantity((q) => q - 1)}
                                    onIncrease={() => setQuantity((q) => q + 1)}
                                />
                            </div>
                        )}
                        <button
                            onClick={addProduct}
                            disabled={adding || unavailable}
                            className={`button-primary w-full mt-6 ${added ? "bg-green-600 hover:bg-green-600" : ""}`}
                        >
                            {added ? (
                                <CheckIcon className="w-5 h-5" />
                            ) : (
                                <ShoppingCartIcon className="w-5 h-5" />
                            )}
                            {unavailable
                                ? "Unavailable"
                                : adding
                                  ? "Adding to your cart…"
                                  : added
                                    ? "Added to your cart"
                                    : "Add to cart"}
                        </button>
                        <p className="text-xs text-gray-500 mt-4">
                            Shipping is calculated at checkout.{" "}
                            <Link
                                href="/policies"
                                className="text-pamasoul-700 underline underline-offset-2"
                            >
                                View store policies
                            </Link>
                        </p>
                        <div className="mt-8 border-t border-pamasoul-100 pt-6">
                            <h2 className="text-sm font-semibold text-pamasoul-dark mb-4">
                                Details & specifications
                            </h2>
                            <dl className="text-sm space-y-3">
                                {[
                                    ["Category", product.category?.name],
                                    ...Object.entries(
                                        product.specifications || {},
                                    ),
                                ].map(([label, value]) => (
                                    <div
                                        key={label}
                                        className="flex justify-between gap-5 border-b border-gray-100 pb-3"
                                    >
                                        <dt className="text-gray-500">
                                            {label}
                                        </dt>
                                        <dd className="font-medium text-right text-gray-800">
                                            {value}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                            {!Object.keys(product.specifications || {})
                                .length && (
                                <p className="text-xs text-gray-500 mt-4">
                                    Need a specific length, line rating or gear
                                    ratio?{" "}
                                    <Link
                                        href="/support"
                                        className="text-pamasoul-700 underline"
                                    >
                                        Ask our team
                                    </Link>{" "}
                                    before ordering.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                {!!relatedProducts.length && (
                    <section className="mt-16">
                        <Reveal>
                            <p className="kicker mb-3">
                                Round out your tackle box
                            </p>
                            <h2 className="text-2xl sm:text-3xl font-bold text-pamasoul-dark mb-7">
                                You may also like.
                            </h2>
                        </Reveal>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                            {relatedProducts.map((related, i) => (
                                <Reveal key={related.id} delay={i * 60}>
                                    <ProductCard product={related} />
                                </Reveal>
                            ))}
                        </div>
                    </section>
                )}
            </div>
            <Dialog
                open={zoom}
                onClose={setZoom}
                className="fixed inset-0 z-50"
            >
                <div
                    className="fixed inset-0 bg-pamasoul-dark/70 backdrop-blur-sm"
                    aria-hidden="true"
                />
                <div className="fixed inset-0 flex items-center justify-center p-5">
                    <DialogPanel
                        transition
                        className="relative bg-white rounded-3xl p-8 sm:p-12 max-w-3xl w-full transition data-[closed]:scale-95 data-[closed]:opacity-0"
                    >
                        <DialogTitle className="sr-only">
                            {product.name} product image
                        </DialogTitle>
                        <button
                            onClick={() => setZoom(false)}
                            aria-label="Close image"
                            className="absolute top-3 right-3 p-3 rounded-full hover:bg-pamasoul-50"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                        <ProductImage
                            product={product}
                            className="w-full h-[65vh] object-contain"
                        />
                    </DialogPanel>
                </div>
            </Dialog>
        </CustomerLayout>
    );
}
