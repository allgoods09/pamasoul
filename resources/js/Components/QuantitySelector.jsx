import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function QuantitySelector({ quantity, onIncrease, onDecrease, maxStock = 99, minStock = 1, size = 'md' }) {
    const sizeClasses = {
        sm: 'w-7 h-7 text-sm',
        md: 'w-8 h-8',
        lg: 'w-10 h-10 text-lg',
    };

    const buttonClass = sizeClasses[size] || sizeClasses.md;
    const textClass = size === 'sm' ? 'w-8' : size === 'lg' ? 'w-14' : 'w-12';

    return (
        <div className="flex items-center space-x-2">
            <button
                onClick={onDecrease}
                disabled={quantity <= minStock}
                className={`${buttonClass} rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
            >
                <MinusIcon className={`h-${size === 'sm' ? '3' : '4'} w-${size === 'sm' ? '3' : '4'} mx-auto`} />
            </button>
            
            <span className={`${textClass} text-center font-semibold text-gray-900`}>
                {quantity}
            </span>
            
            <button
                onClick={onIncrease}
                disabled={quantity >= maxStock}
                className={`${buttonClass} rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
            >
                <PlusIcon className={`h-${size === 'sm' ? '3' : '4'} w-${size === 'sm' ? '3' : '4'} mx-auto`} />
            </button>
        </div>
    );
}