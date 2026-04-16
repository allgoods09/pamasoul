export default function CategoryFilter({ categories, selectedCategory, onCategoryChange }) {
    return (
        <div className="flex flex-wrap gap-2">
            <button
                onClick={() => onCategoryChange('')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !selectedCategory
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
                All
            </button>
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => onCategoryChange(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory == category.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    {category.name}
                    {category.products_count !== undefined && (
                        <span className="ml-1 text-xs opacity-75">
                            ({category.products_count})
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
}