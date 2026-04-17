import React from "react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import { Head, Link, router } from "@inertiajs/react";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { getProductImageUrl } from "@/helpers/imageHelper";

export default function ShopIndex({ products, categories, filters }) {
    // Create refs for form elements
    const searchRef = React.useRef(null);
    const categoryRef = React.useRef(null);
    const sortRef = React.useRef(null);
    const minPriceRef = React.useRef(null);
    const maxPriceRef = React.useRef(null);
    const [showMobileFilters, setShowMobileFilters] = React.useState(false);

    const productsData = products?.data || [];
    const hasProducts = productsData.length > 0;
    const categoriesList = categories || [];

    // Get current category from URL
    const getCurrentCategory = () => {
        const params = new URLSearchParams(window.location.search);
        const categoryId = params.get("category");
        if (categoryId) {
            return categoriesList.find((c) => c.id == categoryId);
        }
        return null;
    };

    const currentCategory = getCurrentCategory();

    // Dynamic header content based on category
    const getHeaderContent = () => {
        if (!currentCategory) {
            return {
                title: "Shop All Products",
                description:
                    "Discover our premium collection of fishing tackle",
                icon: "🎣",
            };
        }

        switch (currentCategory.id) {
            case 1:
                return {
                    title: "Fishing Rods",
                    description:
                        "Experience the perfect balance of power and sensitivity. Our rods are crafted for the passionate angler who demands performance. Pull like a king with every cast!",
                    icon: "🎣",
                };
            case 2:
                return {
                    title: "Fishing Lines",
                    description:
                        "Strength meets precision. Our premium fishing lines offer superior knot strength, low memory, and incredible durability. Never let the big one get away!",
                    icon: "🎣",
                };
            case 3:
                return {
                    title: "Fishing Reels",
                    description:
                        "Smooth, powerful, and reliable. Our reels deliver exceptional drag systems and buttery-smooth retrieves. Dominate the waters with confidence!",
                    icon: "🎣",
                };
            default:
                return {
                    title: currentCategory.name,
                    description: `Explore our premium ${currentCategory.name.toLowerCase()} collection. Quality gear for the serious angler.`,
                    icon: "🎣",
                };
        }
    };

    const headerContent = getHeaderContent();

    // 🖼️ BACKGROUND IMAGES - FILL IN YOUR IMGUR/IMGBB LINKS HERE
    const categoryBackgrounds = {
        1: "", // Fishing Rods background image URL
        2: "", // Fishing Lines background image URL
        3: "", // Fishing Reels background image URL
        default: "https://dummyimage.com/1290x500/bd11bd/fff", // Shop All / Default background image URL
    };

    // 🔍 DYNAMIC SEARCH PLACEHOLDERS PER CATEGORY
    const getSearchPlaceholder = () => {
        if (!currentCategory) {
            return "Search for fishing rods, reels, lines...";
        }

        switch (currentCategory.id) {
            case 1:
                return "Search for rods... e.g., spinning rod, casting rod, surf rod";
            case 2:
                return "Search for fishing lines... e.g., braided line, monofilament, fluorocarbon";
            case 3:
                return "Search for reels... e.g., baitcasting, spinning reel, conventional reel";
            default:
                return `Search for ${currentCategory.name.toLowerCase()}...`;
        }
    };

    const searchPlaceholder = getSearchPlaceholder();

    // Get hero background image based on current category
    const getHeroBackground = () => {
        if (!currentCategory) {
            return categoryBackgrounds.default;
        }
        return (
            categoryBackgrounds[currentCategory.id] ||
            categoryBackgrounds.default
        );
    };

    const heroBackground = getHeroBackground();

    // Set initial values from filters
    React.useEffect(() => {
        if (searchRef.current && filters?.search)
            searchRef.current.value = filters.search;
        if (categoryRef.current && filters?.category)
            categoryRef.current.value = filters.category;
        if (sortRef.current && filters?.sort)
            sortRef.current.value = filters.sort;
        if (minPriceRef.current && filters?.min_price)
            minPriceRef.current.value = filters.min_price;
        if (maxPriceRef.current && filters?.max_price)
            maxPriceRef.current.value = filters.max_price;
    }, [filters]);

    const applyFilters = () => {
        const params = new URLSearchParams();

        const search = searchRef.current?.value;
        const category = categoryRef.current?.value;
        const sort = sortRef.current?.value;
        const minPrice = minPriceRef.current?.value;
        const maxPrice = maxPriceRef.current?.value;

        if (search) params.append("search", search);
        if (category) params.append("category", category);
        if (sort && sort !== "latest") params.append("sort", sort);
        if (minPrice) params.append("min_price", minPrice);
        if (maxPrice) params.append("max_price", maxPrice);

        const url = `/shop${params.toString() ? "?" + params.toString() : ""}`;
        router.get(url, {}, { preserveScroll: true });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        applyFilters();
    };

    const clearAllFilters = () => {
        if (searchRef.current) searchRef.current.value = "";
        if (categoryRef.current) categoryRef.current.value = "";
        if (sortRef.current) sortRef.current.value = "latest";
        if (minPriceRef.current) minPriceRef.current.value = "";
        if (maxPriceRef.current) maxPriceRef.current.value = "";
        router.get("/shop", {}, { preserveScroll: true });
    };

    const handleAddToCart = (productId) => {
        router.post(
            "/cart/add",
            {
                product_id: productId,
                quantity: 1,
            },
            { preserveScroll: true },
        );
    };

    const hasActiveFilters = () => {
        return (
            searchRef.current?.value ||
            categoryRef.current?.value ||
            minPriceRef.current?.value ||
            maxPriceRef.current?.value ||
            (sortRef.current?.value && sortRef.current?.value !== "latest")
        );
    };

    return (
        <CustomerLayout>
            <Head title={`${headerContent.title} - Pamasoul`} />

            <div className="bg-gray-50 min-h-screen">
                {/* Full Width Background Section - touches navbar, no radius */}
                <div
                    className="w-full"
                    style={{
                        backgroundImage: heroBackground
                            ? `url(${heroBackground})`
                            : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    {/* Dark Overlay for text readability */}
                    {heroBackground && <div className="w-full bg-black/40" />}

                    {/* Content Container - keeps text aligned with products */}
                    <div className={`${heroBackground ? "bg-black/40" : ""}`}>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            {/* Dynamic Header */}
                            <div className="mb-6">
                                <div className="flex items-center space-x-3 mb-2">
                                    <span className="text-3xl">
                                        {headerContent.icon}
                                    </span>
                                    <h1
                                        className={`text-3xl font-bold ${heroBackground ? "text-white" : "text-gray-900"}`}
                                    >
                                        {headerContent.title}
                                    </h1>
                                </div>
                                <p
                                    className={`mt-2 max-w-2xl ${heroBackground ? "text-white/90" : "text-gray-600"}`}
                                >
                                    {headerContent.description}
                                </p>
                                {currentCategory && (
                                    <div className="mt-3">
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${heroBackground ? "bg-white/20 text-white backdrop-blur-sm" : "bg-blue-100 text-blue-800"}`}
                                        >
                                            {currentCategory.name} Collection
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Search Bar with Dynamic Placeholder */}
                            <div className="mb-0">
                                <form
                                    onSubmit={handleSearchSubmit}
                                    className="relative"
                                >
                                    <input
                                        ref={searchRef}
                                        type="text"
                                        defaultValue={filters?.search || ""}
                                        placeholder={searchPlaceholder}
                                        className="w-full rounded-lg border-gray-300 py-3 pl-4 pr-12 focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600"
                                    >
                                        <MagnifyingGlassIcon className="h-5 w-5" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Mobile Filter Toggle */}
                    <div className="lg:hidden mb-4">
                        <button
                            onClick={() =>
                                setShowMobileFilters(!showMobileFilters)
                            }
                            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700"
                        >
                            <FunnelIcon className="h-5 w-5" />
                            <span>Filters & Sort</span>
                            {hasActiveFilters() && (
                                <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                                    Active
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Desktop Filters */}
                    <div className="hidden lg:flex gap-4 mb-6 flex-wrap">
                        <select
                            ref={categoryRef}
                            defaultValue={filters?.category || ""}
                            onChange={applyFilters}
                            className="px-4 py-2 border rounded-lg min-w-[160px]"
                        >
                            <option value="">All Categories</option>
                            {categoriesList.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>

                        <select
                            ref={sortRef}
                            defaultValue={filters?.sort || "latest"}
                            onChange={applyFilters}
                            className="px-4 py-2 border rounded-lg min-w-[180px]"
                        >
                            <option value="latest">Latest</option>
                            <option value="price_low">
                                Price: Low to High
                            </option>
                            <option value="price_high">
                                Price: High to Low
                            </option>
                            <option value="name_asc">Name: A to Z</option>
                            <option value="name_desc">Name: Z to A</option>
                        </select>

                        <div className="flex gap-2 items-center">
                            <input
                                ref={minPriceRef}
                                type="number"
                                placeholder="Min Price"
                                defaultValue={filters?.min_price || ""}
                                className="w-28 px-3 py-2 border rounded-lg"
                            />
                            <span>-</span>
                            <input
                                ref={maxPriceRef}
                                type="number"
                                placeholder="Max Price"
                                defaultValue={filters?.max_price || ""}
                                className="w-28 px-3 py-2 border rounded-lg"
                            />
                            <button
                                onClick={applyFilters}
                                className="px-4 py-2 bg-pamasoul-600 text-white rounded-lg hover:bg-pamasoul-800"
                            >
                                Apply Price
                            </button>
                        </div>

                        {hasActiveFilters() && (
                            <button
                                onClick={clearAllFilters}
                                className="px-4 py-2 text-red-600 hover:text-red-800"
                            >
                                Clear All
                            </button>
                        )}
                    </div>

                    {/* Mobile Filters */}
                    {showMobileFilters && (
                        <div className="lg:hidden mb-6 p-4 bg-white rounded-lg shadow space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Category
                                </label>
                                <select
                                    ref={categoryRef}
                                    defaultValue={filters?.category || ""}
                                    onChange={applyFilters}
                                    className="w-full px-4 py-2 border rounded-lg"
                                >
                                    <option value="">All Categories</option>
                                    {categoriesList.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Sort By
                                </label>
                                <select
                                    ref={sortRef}
                                    defaultValue={filters?.sort || "latest"}
                                    onChange={applyFilters}
                                    className="w-full px-4 py-2 border rounded-lg"
                                >
                                    <option value="latest">Latest</option>
                                    <option value="price_low">
                                        Price: Low to High
                                    </option>
                                    <option value="price_high">
                                        Price: High to Low
                                    </option>
                                    <option value="name_asc">
                                        Name: A to Z
                                    </option>
                                    <option value="name_desc">
                                        Name: Z to A
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Price Range
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        ref={minPriceRef}
                                        type="number"
                                        placeholder="Min"
                                        defaultValue={filters?.min_price || ""}
                                        className="flex-1 px-3 py-2 border rounded-lg"
                                    />
                                    <span className="self-center">-</span>
                                    <input
                                        ref={maxPriceRef}
                                        type="number"
                                        placeholder="Max"
                                        defaultValue={filters?.max_price || ""}
                                        className="flex-1 px-3 py-2 border rounded-lg"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={applyFilters}
                                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Apply Filters
                            </button>
                        </div>
                    )}

                    {/* Results Count */}
                    {products && products.total !== undefined && (
                        <div className="mb-4 text-sm text-gray-600">
                            Showing {products.from || 0} to {products.to || 0}{" "}
                            of {products.total} products
                        </div>
                    )}

                    {/* Products Grid - Clickable Cards */}
                    {hasProducts && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {productsData.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/product/${product.id}`}
                                >
                                    <div
                                        key={product.id}
                                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
                                    >
                                        {/* Clickable Image */}
                                        <Link href={`/product/${product.id}`}>
                                            <div className="h-48 overflow-hidden bg-gray-100">
                                                <img
                                                    src={getProductImageUrl(
                                                        product,
                                                        "medium",
                                                    )}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src =
                                                            "https://picsum.photos/id/20/400/300";
                                                    }}
                                                />
                                            </div>
                                        </Link>

                                        {/* Product Info */}
                                        <div className="p-4">
                                            {/* Clickable Title */}
                                            <Link
                                                href={`/product/${product.id}`}
                                            >
                                                <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1">
                                                    {product.name}
                                                </h3>
                                            </Link>

                                            <p className="text-sm text-gray-500 mb-2">
                                                {product.category?.name}
                                            </p>

                                            <div className="flex items-center justify-between mb-3">
                                                <p className="text-lg font-bold text-blue-600">
                                                    ₱
                                                    {Number(
                                                        product.price,
                                                    ).toLocaleString()}
                                                </p>
                                                <span
                                                    className={`text-xs px-2 py-1 rounded ${
                                                        product.stock > 5
                                                            ? "bg-green-100 text-green-700"
                                                            : product.stock > 0
                                                              ? "bg-yellow-100 text-yellow-700"
                                                              : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {product.stock_status}
                                                </span>
                                            </div>

                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleAddToCart(product.id);
                                                }}
                                                disabled={product.stock === 0}
                                                className={`mt-2 w-full py-2 rounded-lg transition-colors ${
                                                    product.stock > 0
                                                        ? "bg-pamasoul-600 text-white hover:bg-pamasoul-800"
                                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                }`}
                                            >
                                                {product.stock > 0
                                                    ? "Add to Cart"
                                                    : "Out of Stock"}
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* No Products */}
                    {!hasProducts && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">
                                No products found in this category.
                            </p>
                            <button
                                onClick={clearAllFilters}
                                className="mt-4 text-blue-600 hover:text-blue-800"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}

                    {/* Pagination */}
                    {hasProducts && products?.links && (
                        <div className="mt-8 flex justify-center">
                            <div className="flex space-x-2">
                                {products.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || "#"}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium ${
                                            link.active
                                                ? "bg-blue-600 text-white"
                                                : "bg-white text-gray-700 hover:bg-gray-100"
                                        } ${!link.url && "opacity-50 cursor-default"}`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
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
