import ApplicationLogo from "@/Components/ApplicationLogo";
import { useState, useRef, useEffect } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import {
    ShoppingBagIcon,
    ShoppingCartIcon,
    UserIcon,
    MagnifyingGlassIcon,
    Bars3Icon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import AdBanner from "@/Components/AdBanner";

export default function CustomerLayout({ children }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    const { url, props } = usePage();
    const user = props.auth.user;
    const cartCount = props.cartCount || 0;
    const shippingConfig = props.shippingConfig || {
        free_threshold: 5000,
        base_fee: 50,
    };
    const currentPage = url.split("/")[1] || "home"; // 'home', 'shop', 'product', etc.

    const freeThreshold = shippingConfig.free_threshold;
    const formattedThreshold = new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 0,
    }).format(freeThreshold);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setUserDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCategoryClick = (categoryId) => {
        router.get("/shop", { category: categoryId });
    };

    // Get current category from URL
    const getCurrentCategory = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get("category");
    };

    const isActive = (href) => {
        if (!href) return false;
        if (href === "/") return url === href;
        return url.startsWith(href);
    };

    // Shop is active only on /shop with NO category filter
    const isShopActive = () => {
        return (
            url === "/shop" ||
            (url.startsWith("/shop") && !getCurrentCategory())
        );
    };

    // Category button is active when its category ID matches URL param
    const isCategoryActive = (categoryId) => {
        return getCurrentCategory() == categoryId;
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            {/* Top Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                {/* Top bar with dynamic shipping message */}
                <div className="bg-pamasoul font-semibold text-gray-900 text-sm py-2">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center">
                            <p className="hidden sm:block">
                                🐟 Free shipping on orders over{" "}
                                {formattedThreshold}!
                            </p>
                            <p>🎣 Pamasoul - Premium Fishing Tackle</p>
                            <p className="hidden sm:block">
                                📞 Customer Support: (+63) 9389317261
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main header */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2">
                            <ApplicationLogo />
                            <span className="text-xl font-bold text-gray-900 hidden sm:block">
                                Pamasoul
                            </span>
                            <span className="text-xs text-pamasoul-600 font-bold hidden lg:block">
                                Fishing Tackle
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex space-x-8">
                            {/* Home Link */}
                            <Link
                                href="/"
                                className={`text-sm font-medium transition-colors py-1 ${
                                    isActive("/")
                                        ? "text-pamasoul border-b-2 border-blue-600"
                                        : "text-gray-700 hover:text-pamasoul border-b-2 border-transparent"
                                }`}
                            >
                                Home
                            </Link>

                            {/* Shop Link - only active when no category filter */}
                            <Link
                                href="/shop"
                                className={`text-sm font-medium transition-colors py-1 ${
                                    isShopActive()
                                        ? "text-pamasoul border-b-2 border-blue-600"
                                        : "text-gray-700 hover:text-pamasoul border-b-2 border-transparent"
                                }`}
                            >
                                Shop
                            </Link>

                            {/* Category Buttons */}
                            <button
                                onClick={() => handleCategoryClick(1)}
                                className={`text-sm font-medium transition-colors py-1 ${
                                    isCategoryActive(1)
                                        ? "text-pamasoul border-b-2 border-blue-600"
                                        : "text-gray-700 hover:text-pamasoul border-b-2 border-transparent"
                                }`}
                            >
                                Rods
                            </button>
                            <button
                                onClick={() => handleCategoryClick(2)}
                                className={`text-sm font-medium transition-colors py-1 ${
                                    isCategoryActive(2)
                                        ? "text-pamasoul border-b-2 border-blue-600"
                                        : "text-gray-700 hover:text-pamasoul border-b-2 border-transparent"
                                }`}
                            >
                                Lines
                            </button>
                            <button
                                onClick={() => handleCategoryClick(3)}
                                className={`text-sm font-medium transition-colors py-1 ${
                                    isCategoryActive(3)
                                        ? "text-pamasoul border-b-2 border-blue-600"
                                        : "text-gray-700 hover:text-pamasoul border-b-2 border-transparent"
                                }`}
                            >
                                Reels
                            </button>
                        </nav>

                        {/* Right icons */}
                        <div className="flex items-center space-x-4">
                            {/* Search button - only visible on landing page, but keep same width when hidden */}
                            <div className="w-5 h-5">
                                {url === "/landing" && (
                                    <button
                                        onClick={() =>
                                            setSearchOpen(!searchOpen)
                                        }
                                        className="text-gray-600 hover:text-blue-600"
                                    >
                                        <MagnifyingGlassIcon className="h-5 w-5" />
                                    </button>
                                )}
                            </div>

                            <Link
                                href="/cart"
                                className="relative text-gray-600 hover:text-blue-600"
                            >
                                <ShoppingCartIcon className="h-5 w-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* User Dropdown */}
                            {user ? (
                                <div className="relative">
                                    <button
                                        ref={buttonRef}
                                        onClick={() =>
                                            setUserDropdownOpen(
                                                !userDropdownOpen,
                                            )
                                        }
                                        className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
                                    >
                                        <UserIcon className="h-5 w-5" />
                                        <span className="text-sm hidden sm:inline text-gray-700">
                                            {user.name}
                                        </span>
                                    </button>
                                    {userDropdownOpen && (
                                        <div
                                            ref={dropdownRef}
                                            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
                                        >
                                            <Link
                                                href="/my-orders"
                                                onClick={() =>
                                                    setUserDropdownOpen(false)
                                                }
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                My Orders
                                            </Link>
                                            <Link
                                                href="/profile"
                                                onClick={() =>
                                                    setUserDropdownOpen(false)
                                                }
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Profile
                                            </Link>
                                            {user.role === "admin" && (
                                                <Link
                                                    href="/admin/dashboard"
                                                    onClick={() =>
                                                        setUserDropdownOpen(
                                                            false,
                                                        )
                                                    }
                                                    className="block px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 border-t border-gray-100"
                                                >
                                                    Admin Panel
                                                </Link>
                                            )}
                                            <Link
                                                href="/logout"
                                                method="post"
                                                as="button"
                                                onClick={() =>
                                                    setUserDropdownOpen(false)
                                                }
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 border-t border-gray-100"
                                            >
                                                Logout
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="text-sm text-gray-600 hover:text-blue-600"
                                >
                                    Login
                                </Link>
                            )}

                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="md:hidden text-gray-600 hover:text-blue-600"
                            >
                                <Bars3Icon className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search bar */}
                {searchOpen && (
                    <div className="border-t border-gray-200 py-4 px-4 bg-white">
                        <div className="max-w-7xl mx-auto">
                            <form
                                action="/shop"
                                method="GET"
                                className="relative"
                            >
                                <input
                                    type="text"
                                    name="search"
                                    placeholder="Search for fishing rods, reels, lines..."
                                    className="w-full rounded-lg border-gray-300 pr-12 focus:border-blue-500 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                                />
                                {/* Preserve current category if any */}
                                {getCurrentCategory() && (
                                    <input
                                        type="hidden"
                                        name="category"
                                        value={getCurrentCategory()}
                                    />
                                )}
                                <button
                                    type="submit"
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </header>

            {/* Mobile menu sidebar */}
            {mobileMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 z-50 bg-gray-900/50"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <div className="fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg">
                        <div className="flex justify-between items-center p-4 border-b">
                            <span className="font-bold text-gray-900">
                                Menu
                            </span>
                            <button onClick={() => setMobileMenuOpen(false)}>
                                <XMarkIcon className="h-6 w-6 text-gray-600" />
                            </button>
                        </div>
                        <nav className="p-4 space-y-3">
                            <Link
                                href="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block py-2 text-base font-medium ${
                                    isActive("/")
                                        ? "text-blue-600"
                                        : "text-gray-700"
                                }`}
                            >
                                Home
                            </Link>
                            <Link
                                href="/shop"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block py-2 text-base font-medium ${
                                    isShopActive()
                                        ? "text-blue-600"
                                        : "text-gray-700"
                                }`}
                            >
                                Shop
                            </Link>
                            <button
                                onClick={() => {
                                    handleCategoryClick(1);
                                    setMobileMenuOpen(false);
                                }}
                                className={`block w-full text-left py-2 text-base font-medium ${
                                    isCategoryActive(1)
                                        ? "text-blue-600"
                                        : "text-gray-700"
                                }`}
                            >
                                Rods
                            </button>
                            <button
                                onClick={() => {
                                    handleCategoryClick(2);
                                    setMobileMenuOpen(false);
                                }}
                                className={`block w-full text-left py-2 text-base font-medium ${
                                    isCategoryActive(2)
                                        ? "text-blue-600"
                                        : "text-gray-700"
                                }`}
                            >
                                Lines
                            </button>
                            <button
                                onClick={() => {
                                    handleCategoryClick(3);
                                    setMobileMenuOpen(false);
                                }}
                                className={`block w-full text-left py-2 text-base font-medium ${
                                    isCategoryActive(3)
                                        ? "text-blue-600"
                                        : "text-gray-700"
                                }`}
                            >
                                Reels
                            </button>
                            <div className="border-t pt-3 mt-3">
                                {user ? (
                                    <>
                                        <Link
                                            href="/my-orders"
                                            className="block py-2 text-gray-700"
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                        >
                                            My Orders
                                        </Link>
                                        <Link
                                            href="/profile"
                                            className="block py-2 text-gray-700"
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                        >
                                            Profile
                                        </Link>
                                        {user.role === "admin" && (
                                            <Link
                                                href="/admin/dashboard"
                                                className="block py-2 text-blue-600"
                                                onClick={() =>
                                                    setMobileMenuOpen(false)
                                                }
                                            >
                                                Admin Panel
                                            </Link>
                                        )}
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            className="block w-full text-left py-2 text-red-600"
                                        >
                                            Logout
                                        </Link>
                                    </>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="block py-2 text-blue-600"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Login / Register
                                    </Link>
                                )}
                            </div>
                        </nav>
                    </div>
                </>
            )}

            {/* Main Content */}
            <main className="relative">
                {/* Left Side Ad - Configurable positioning */}
                <div
                    className={`hidden xl:block absolute left-0 w-48 space-y-4 ${
                        currentPage === "home" || currentPage === "landing"
                            ? "top-[56vh]"
                            : currentPage === "other"
                              ? "top-32"
                              : "top-50" // This covers shop, product, cart, checkout, my-orders
                    }`}
                >
                    <AdBanner
                        position="left"
                        page={currentPage}
                        className="rounded-none shadow-none"
                        adHeight="h-auto"
                    />
                </div>

                {/* Right Side Ad - Configurable positioning */}
                <div
                    className={`hidden xl:block absolute right-0 w-48 space-y-4 ${
                        currentPage === "home" || currentPage === "landing"
                            ? "top-[56vh]"
                            : currentPage === "other"
                              ? "top-32"
                              : "top-50"
                    }`}
                >
                    <AdBanner
                        position="right"
                        page={currentPage}
                        className="rounded-none shadow-none"
                        adHeight="h-auto"
                    />
                </div>

                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <ApplicationLogo
                                    variant="light"
                                    className="h-8 w-auto"
                                />
                                <span className="text-xl font-bold">
                                    Pamasoul
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Premium fishing tackle for the passionate
                                angler. Quality gear for every fishing
                                adventure.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4 text-white">
                                Quick Links
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>
                                    <Link
                                        href="/shop"
                                        className="hover:text-white"
                                    >
                                        Shop All
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handleCategoryClick(1)}
                                        className="hover:text-white"
                                    >
                                        Fishing Rods
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handleCategoryClick(2)}
                                        className="hover:text-white"
                                    >
                                        Fishing Lines
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handleCategoryClick(3)}
                                        className="hover:text-white"
                                    >
                                        Reels
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4 text-white">
                                Customer Service
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>
                                    <Link
                                        href="/my-orders"
                                        className="hover:text-white"
                                    >
                                        My Orders
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/cart"
                                        className="hover:text-white"
                                    >
                                        Shopping Cart
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-white">
                                        Shipping Info
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-white">
                                        Returns Policy
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4 text-white">
                                Contact Us
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>📞 (+63) 9389317261</li>
                                <li>✉️ Support@pamasoul.com</li>
                                <li>📍 Tubigon, Bohol, Philippines</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
                        <p>
                            &copy; {new Date().getFullYear()} Pamasoul Fishing
                            Tackle. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
