import { Link } from "@inertiajs/react";
import { ShoppingCartIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import ProductImage from "./ProductImage";
import Tilt from "./Motion/Tilt";
import useCartAction from "@/hooks/useCartAction";
import { formatPeso } from "@/helpers/imageHelper";
export default function ProductCard({ product, showAddButton = true }) {
    const { adding, add } = useCartAction();
    const [added, setAdded] = useState(false);
    const timer = useRef();
    useEffect(() => () => clearTimeout(timer.current), []);
    const unavailable = product.stock <= 0 || product.is_active === false;
    const onAdd = () =>
        add(product, 1, () => {
            setAdded(true);
            clearTimeout(timer.current);
            timer.current = setTimeout(() => setAdded(false), 1800);
        });
    return (
        <Tilt className="h-full">
            <article className="product-card h-full flex flex-col overflow-hidden bg-white border border-gray-100 rounded-2xl group">
                <Link
                    href={`/product/${product.slug}`}
                    className="relative block bg-pamasoul-50/50 overflow-hidden aspect-[4/3] p-4 sm:p-6"
                    aria-label={`View ${product.name}`}
                >
                    <ProductImage
                        product={product}
                        className="product-image w-full h-full object-contain mix-blend-multiply"
                    />
                    <span
                        className={`absolute top-3 left-3 text-[10px] sm:text-xs font-medium rounded-full px-2.5 py-1 ${unavailable ? "bg-gray-100 text-gray-500" : product.stock <= 5 ? "bg-amber-50 text-amber-800" : "bg-white/90 text-pamasoul-700"}`}
                    >
                        {unavailable
                            ? "Unavailable"
                            : product.stock <= 5
                              ? `Only ${product.stock} left`
                              : "In stock"}
                    </span>
                </Link>
                <div className="p-3 sm:p-5 flex flex-col flex-1">
                    <p className="text-[10px] uppercase tracking-wider text-pamasoul-600 mb-2">
                        {product.category?.name || "Fishing tackle"}
                    </p>
                    <Link
                        href={`/product/${product.slug}`}
                        className="font-semibold text-sm sm:text-base text-gray-900 hover:text-pamasoul-700 leading-relaxed line-clamp-2 mb-3"
                    >
                        {product.name}
                    </Link>
                    <p className="text-base sm:text-lg font-bold text-pamasoul-800 mt-auto mb-4">
                        {formatPeso(product.price)}
                    </p>
                    {showAddButton && (
                        <button
                            onClick={onAdd}
                            disabled={unavailable || adding}
                            className={`w-full min-h-[44px] rounded-xl px-2 text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 ${added ? "bg-green-50 text-green-700" : "bg-pamasoul-50 hover:bg-pamasoul-600 text-pamasoul-800 hover:text-white"} disabled:opacity-50`}
                            aria-label={`Add ${product.name} to cart`}
                        >
                            {added ? (
                                <CheckIcon className="w-4 h-4 shrink-0" />
                            ) : (
                                <ShoppingCartIcon className="w-4 h-4 shrink-0" />
                            )}
                            <span>
                                {unavailable
                                    ? "Unavailable"
                                    : adding
                                      ? "Adding…"
                                      : added
                                        ? "Added!"
                                        : "Add to cart"}
                            </span>
                        </button>
                    )}
                </div>
            </article>
        </Tilt>
    );
}
