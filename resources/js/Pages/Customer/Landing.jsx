import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link } from '@inertiajs/react';
import { ShoppingCartIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { getProductImageUrl } from '@/helpers/imageHelper';


export default function Landing({ featuredProducts, categories }) {

    const getCategoryImage = (category) => {
        // Find a product in this category
        const sampleProduct = featuredProducts.find(p => p.category_id === category.id);
        
        // If found, return its image URL
        if (sampleProduct && sampleProduct.image) {
            return sampleProduct.image;
        }
        
        // Fallback gradients based on category
        const fallbacks = {
            1: 'from-blue-600 to-blue-800',  // Rods
            2: 'from-green-600 to-green-800', // Lines
            3: 'from-purple-600 to-purple-800', // Reels
        };
        
        return fallbacks[category.id] || 'from-blue-600 to-blue-800';
    };

    return (
        <CustomerLayout>
            <Head title="Pamasoul - Premium Fishing Tackle" />

            {/* Hero Section */}
            <section className="relative text-white">
                {/* Background Image with CSS fallback */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url('../images/herobanner.jpg')`,
                        backgroundColor: '#1e3a8a', // Fallback blue color
                    }}
                >
                    {/* Gradient overlay for better text readability */}
                    <div className="absolute inset-0 bg-black/20"></div>
                </div>
                
                {/* Content */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Premium Fishing Tackle for the Passionate Angler
                        </h1>
                        <p className="text-lg md:text-xl mb-8 text-blue-100">
                            Quality rods, reels, and lines for every fishing adventure. 
                            Gear up with Pamasoul and catch the big one!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/shop"
                                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-400 text-light hover:text-black font-semibold rounded-lg transition-colors"
                            >
                                Shop Now
                                <ArrowRightIcon className="ml-2 h-5 w-5" />
                            </Link>
                            <Link
                                href="#featured"
                                className="inline-flex items-center justify-center px-6 py-3 border border-white hover:bg-white/10 font-semibold rounded-lg transition-colors"
                            >
                                View Collections
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Highlights */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
                        Shop by Category
                    </h2>
                    <p className="text-gray-600 text-center mb-12">
                        Find exactly what you need for your next fishing trip
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {categories.map((category) => {
                            // Find a sample product image for this category
                            const sampleProduct = featuredProducts.find(p => p.category_id === category.id);
                            const hasImage = sampleProduct && sampleProduct.image;
                            const gradientClass = {
                                1: 'from-blue-600 to-blue-800',
                                2: 'from-green-600 to-green-800', 
                                3: 'from-purple-600 to-purple-800',
                            }[category.id] || 'from-blue-600 to-blue-800';
                            
                            return (
                                <Link
                                    key={category.id}
                                    href={`/shop?category=${category.id}`}
                                    className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow h-64"
                                >
                                    {/* Background Image if available */}
                                    {hasImage ? (
                                        <>
                                            <div className="absolute inset-0">
                                                <img 
                                                    src={sampleProduct.image_url || sampleProduct.image}
                                                    alt={category.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className={`h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                                            <div className="text-center text-white p-6">
                                                <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                                                <p className="text-blue-100 mb-4">{category.products_count} Products</p>
                                                <span className="inline-block border border-white px-4 py-2 rounded-lg group-hover:bg-white group-hover:text-blue-600 transition-colors">
                                                    Shop Now
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Overlay Content (always show on top of image) */}
                                    {hasImage && (
                                        <div className="relative z-10 flex items-center justify-center h-full">
                                            <div className="text-center text-white p-6">
                                                <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                                                <p className="text-white/80 mb-4">{category.products_count} Products</p>
                                                <span className="inline-block border border-white px-4 py-2 rounded-lg group-hover:bg-pamasoul-400 group-hover:text-white transition-colors">
                                                    Shop Now
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section id="featured" className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
                        Featured Products
                    </h2>
                    <p className="text-gray-600 text-center mb-12">
                        Our most popular fishing gear, trusted by anglers worldwide
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map((product) => (
                            <Link
                                key={product.id}
                                href={`/product/${product.id}`}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
                            >
                                <div className="h-48 overflow-hidden bg-gray-100">
                                    <img
                                        src={getProductImageUrl(product)}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={(e) => {
                                            e.target.src = 'https://picsum.photos/id/20/400/300';
                                        }}
                                    />
                                </div>
                                                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-2">{product.category?.name}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold text-blue-600">
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
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            href="/shop"
                            className="inline-flex items-center justify-center px-6 py-3 bg-pamasoul-600 hover:bg-pamasoul-800 text-white font-semibold rounded-lg transition-colors"
                        >
                            View All Products
                            <ArrowRightIcon className="ml-2 h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="py-16 bg-gradient-to-r from-yellow-500 to-yellow-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Ready to Upgrade Your Gear?
                    </h2>
                    <p className="text-lg text-gray-800 mb-8">
                        Join thousands of satisfied anglers who trust Pamasoul for their fishing needs.
                    </p>
                    <Link
                        href="/shop"
                        className="inline-flex items-center justify-center px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors"
                    >
                        Start Shopping
                        <ShoppingCartIcon className="ml-2 h-5 w-5" />
                    </Link>
                </div>
            </section>
        </CustomerLayout>
    );
}