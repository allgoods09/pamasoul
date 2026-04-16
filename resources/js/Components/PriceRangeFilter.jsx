import { useState } from 'react';

export default function PriceRangeFilter({ minPrice, maxPrice, onApply }) {
    const [min, setMin] = useState(minPrice || '');
    const [max, setMax] = useState(maxPrice || '');

    const handleApply = () => {
        onApply({ min_price: min, max_price: max });
    };

    const handleClear = () => {
        setMin('');
        setMax('');
        onApply({ min_price: '', max_price: '' });
    };

    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                <input
                    type="number"
                    placeholder="Min ₱"
                    value={min}
                    onChange={(e) => setMin(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <span className="self-center text-gray-500">-</span>
                <input
                    type="number"
                    placeholder="Max ₱"
                    value={max}
                    onChange={(e) => setMax(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>
            <div className="flex gap-2">
                <button
                    onClick={handleApply}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Apply
                </button>
                <button
                    onClick={handleClear}
                    className="px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                    Clear
                </button>
            </div>
        </div>
    );
}