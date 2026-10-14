import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
export default function QuantitySelector({
    quantity,
    onIncrease,
    onDecrease,
    maxStock = 99,
    minStock = 1,
    disabled = false,
}) {
    return (
        <div className="inline-flex items-center rounded-xl border border-gray-200 bg-white overflow-hidden">
            <button
                type="button"
                onClick={onDecrease}
                disabled={disabled || quantity <= minStock}
                aria-label="Decrease quantity"
                className="h-11 w-11 flex items-center justify-center text-pamasoul-700 hover:bg-pamasoul-50 disabled:opacity-30"
            >
                <MinusIcon className="h-4 w-4" />
            </button>
            <span
                key={quantity}
                aria-live="polite"
                className="quantity-value w-10 text-center font-semibold text-gray-900"
            >
                {quantity}
            </span>
            <button
                type="button"
                onClick={onIncrease}
                disabled={disabled || quantity >= Math.min(maxStock, 99)}
                aria-label="Increase quantity"
                className="h-11 w-11 flex items-center justify-center text-pamasoul-700 hover:bg-pamasoul-50 disabled:opacity-30"
            >
                <PlusIcon className="h-4 w-4" />
            </button>
        </div>
    );
}
