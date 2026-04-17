import { Link } from "@inertiajs/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import QuantitySelector from "./QuantitySelector";

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
    const itemTotal = item.quantity * item.price_snapshot;

    return (
        <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6 border-b border-gray-200">
            {/* Product Image */}
            <Link
                href={`/product/${item.product.slug}`}
                className="w-full sm:w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"
            >
                <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
            </Link>

            {/* Product Info */}
            <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <div>
                        <Link href={`/product/${item.product.slug}`}>
                            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                                {item.product.name}
                            </h3>
                        </Link>
                        <p className="text-sm text-gray-500">
                            {item.product.category?.name}
                        </p>
                        <p className="text-lg font-bold text-blue-600 mt-1">
                            ₱{Number(item.price_snapshot).toLocaleString()}
                        </p>
                    </div>
                    <button
                        onClick={() => onRemove(item.id)}
                        className="text-red-500 hover:text-red-700 mt-2 sm:mt-0"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </div>

                {/* Quantity Controls and Total */}
                <div className="flex items-center justify-between mt-4">
                    <QuantitySelector
                        quantity={item.quantity}
                        onIncrease={() =>
                            onUpdateQuantity(item.id, item.quantity + 1)
                        }
                        onDecrease={() =>
                            onUpdateQuantity(item.id, item.quantity - 1)
                        }
                        maxStock={item.product.stock}
                    />
                    <p className="font-semibold text-gray-900">
                        ₱{itemTotal.toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
}
