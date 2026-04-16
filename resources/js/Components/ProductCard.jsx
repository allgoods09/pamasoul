import { Link } from '@inertiajs/react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function ProductCard({ product, onAddToCart, showAddButton = true }) {
    // Generate image URL directly in component
    const getImageUrl = () => {
        if (product.image && product.image !== '') {
            return product.image;
        }
        // Use product ID for unique placeholder
        const imageId = 100 + (product.id % 100);
        return `https://picsum.photos/id/${imageId}/400/300`;
    };

    const imageUrl = getImageUrl();
    
    // Debug log to verify
    console.log('Product ID:', product.id, 'Image URL:', imageUrl, 'Original image:', product.image);

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
            <Link href={`/product/${product.id}`}>
                <div className="h-48 overflow-hidden bg-gray-100">
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                            e.target.src = 'https://picsum.photos/id/20/400/300';
                        }}
                    />
                </div>
            </Link>
            <div className="p-4">
                <Link href={`/product/${product.id}`}>
                    <h3 className="font-semibold text-gray-900 mb-1 hover:text-blue-600 transition-colors line-clamp-1">
                        {product.name}
                    </h3>
                </Link>
                <p className="text-sm text-gray-500 mb-2">{product.category?.name}</p>
                
                <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-pamasoul-600">
                        ₱{Number(product.price).toLocaleString()}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                        product.stock > 5 ? 'bg-green-100 text-green-700' :
                        product.stock > 0 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                    }`}>
                        {product.stock_status}
                    </span>
                </div>

                {showAddButton && (
                    <button
                        onClick={() => onAddToCart(product)}
                        disabled={product.stock === 0}
                        className={`w-full flex items-center justify-center space-x-2 py-2 rounded-lg transition-colors ${
                            product.stock > 0
                                ? 'bg-pamasoul-600 hover:bg-pamasoul-800 text-white'
                                : 'bg-gray-300 cursor-not-allowed text-gray-500'
                        }`}
                    >
                        <ShoppingCartIcon className="h-4 w-4" />
                        <span>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
                    </button>
                )}
            </div>
        </div>
    );
}