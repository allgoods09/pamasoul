import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { ShoppingCartIcon, ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline';
import ProductCard from '@/Components/ProductCard';
import { getProductImageUrl } from '@/helpers/imageHelper';

export default function ProductShow({ product, relatedProducts }) {
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const [added, setAdded] = useState(false);

    const increaseQuantity = () => {
        if (quantity < product.stock && quantity < 99) {
            setQuantity(quantity + 1);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleAddToCart = () => {
        if (product.stock === 0) return;
        
        setAdding(true);
        router.post('/cart/add', {
            product_id: product.id,
            quantity: quantity,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setAdding(false);
                setAdded(true);
                setTimeout(() => setAdded(false), 2000);
            },
            onError: () => {
                setAdding(false);
            },
        });
    };

    return (
        <CustomerLayout>
            <Head title={`${product.name} - Pamasoul`} />

            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Back Link */}
                    <Link href="/shop" className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6">
                        <ArrowLeftIcon className="h-4 w-4 mr-1" />
                        Back to Shop
                    </Link>

                    {/* Product Details */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
                            {/* Product Image */}
                            <div className="bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                    src={getProductImageUrl(product)}
                                    alt={product.name}
                                    className="w-full h-96 object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://picsum.photos/id/20/400/300';
                                    }}
                                />
                            </div>

                            {/* Product Info */}
                            <div>
                                <div className="mb-4">
                                    <span className="text-sm text-pamasoul-700 font-medium">
                                        {product.category?.name}
                                    </span>
                                    <h1 className="text-3xl font-bold text-gray-900 mt-2">
                                        {product.name}
                                    </h1>
                                </div>

                                <div className="mb-4">
                                    <span className="text-3xl font-bold text-pamasoul-600">
                                        ₱{Number(product.price).toLocaleString()}
                                    </span>
                                </div>

                                <div className="mb-6">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className="text-sm font-medium text-gray-700">Availability:</span>
                                        <span className={`text-sm font-semibold ${
                                            product.stock > 5 ? 'text-green-600' :
                                            product.stock > 0 ? 'text-yellow-600' :
                                            'text-red-600'
                                        }`}>
                                            {product.stock_status}
                                        </span>
                                    </div>
                                    {product.stock > 5 && (
                                        <p className="text-sm text-green-600">
                                            ✓ In stock - ready to ship!
                                        </p>
                                    )}
                                    {product.stock > 0 && product.stock <= 5 && (
                                        <p className="text-sm text-yellow-600">
                                            ⚠️ Only {product.stock} left in stock - order soon!
                                        </p>
                                    )}
                                    {product.stock === 0 && (
                                        <p className="text-sm text-red-600">
                                            ✗ Out of stock - check back later
                                        </p>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {product.description || 'No description available for this product.'}
                                    </p>
                                </div>

                                {/* Quantity Selector */}
                                {product.stock > 0 && (
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Quantity
                                        </label>
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={decreaseQuantity}
                                                className="w-10 h-10 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
                                            >
                                                -
                                            </button>
                                            <span className="w-12 text-center text-lg font-semibold">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={increaseQuantity}
                                                className="w-10 h-10 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
                                            >
                                                +
                                            </button>
                                            <span className="text-sm text-gray-500">
                                                {product.stock} available
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Add to Cart Button */}
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0 || adding}
                                    className={`w-full flex items-center justify-center space-x-2 py-3 rounded-lg transition-colors ${
                                        product.stock > 0
                                            ? 'bg-pamasoul-600 hover:bg-pamasoul-800 text-white'
                                            : 'bg-gray-300 cursor-not-allowed text-gray-500'
                                    }`}
                                >
                                    {adding ? (
                                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : added ? (
                                        <CheckIcon className="h-5 w-5" />
                                    ) : (
                                        <ShoppingCartIcon className="h-5 w-5" />
                                    )}
                                    <span>
                                        {added ? 'Added to Cart!' : product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedProducts.map((relatedProduct) => (
                                    <ProductCard
                                        key={relatedProduct.id}
                                        product={relatedProduct}
                                        onAddToCart={() => {
                                            router.post('/cart/add', {
                                                product_id: relatedProduct.id,
                                                quantity: 1,
                                            });
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
}