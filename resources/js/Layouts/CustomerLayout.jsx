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
    ChevronDownIcon,
    UserCircleIcon,
    ClipboardDocumentListIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import AdBanner from "@/Components/AdBanner";

export default function CustomerLayout({ children }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    const { hideAds } = usePage().props;
    const { url, props } = usePage();
    const user = props.auth.user;
    const cartCount = props.cartCount || 0;
    const shippingConfig = props.shippingConfig || {
        free_threshold: 5000,
        base_fee: 50,
    };
    const currentPage = url.split("/")[1] || "home";

    // Get user initials (first letter of first name + first letter of last name)
    const getUserInitials = () => {
        if (!user?.name) return "?";
        const nameParts = user.name.trim().split(" ");
        if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
        return (
            nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
        ).toUpperCase();
    };

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

    // UPDATED: Use slug instead of ID
    const handleCategoryClick = (categorySlug) => {
        router.get("/shop", { category: categorySlug });
    };

    const getCurrentCategory = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get("category");
    };

    const isActive = (href) => {
        if (!href) return false;
        if (href === "/") return url === href;
        return url.startsWith(href);
    };

    const isShopActive = () => {
        return (
            url === "/shop" ||
            (url.startsWith("/shop") && !getCurrentCategory())
        );
    };

    // UPDATED: Compare slugs instead of IDs
    const isCategoryActive = (categorySlug) => {
        return getCurrentCategory() === categorySlug;
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

                        {/* Desktop Navigation - UPDATED with slugs */}
                        <nav className="hidden md:flex space-x-8">
                            <Link
                                href="/"
                                className={`text-sm font-medium transition-colors py-1 ${
                                    isActive("/")
                                        ? "text-pamasoul border-b-2 border-pamasoul-600"
                                        : "text-gray-700 hover:text-pamasoul border-b-2 border-transparent"
                                }`}
                            >
                                Home
                            </Link>
                            <Link
                                href="/shop"
                                className={`text-sm font-medium transition-colors py-1 ${
                                    isShopActive()
                                        ? "text-pamasoul border-b-2 border-pamasoul-600"
                                        : "text-gray-700 hover:text-pamasoul border-b-2 border-transparent"
                                }`}
                            >
                                Shop
                            </Link>
                            <button
                                onClick={() =>
                                    handleCategoryClick("fishing-rods")
                                }
                                className={`text-sm font-medium transition-colors py-1 ${
                                    isCategoryActive("fishing-rods")
                                        ? "text-pamasoul border-b-2 border-pamasoul-600"
                                        : "text-gray-700 hover:text-pamasoul border-b-2 border-transparent"
                                }`}
                            >
                                Rods
                            </button>
                            <button
                                onClick={() =>
                                    handleCategoryClick("fishing-lines")
                                }
                                className={`text-sm font-medium transition-colors py-1 ${
                                    isCategoryActive("fishing-lines")
                                        ? "text-pamasoul border-b-2 border-pamasoul-600"
                                        : "text-gray-700 hover:text-pamasoul border-b-2 border-transparent"
                                }`}
                            >
                                Lines
                            </button>
                            <button
                                onClick={() => handleCategoryClick("reels")}
                                className={`text-sm font-medium transition-colors py-1 ${
                                    isCategoryActive("reels")
                                        ? "text-pamasoul border-b-2 border-pamasoul-600"
                                        : "text-gray-700 hover:text-pamasoul border-b-2 border-transparent"
                                }`}
                            >
                                Reels
                            </button>
                        </nav>

                        {/* Right icons */}
                        <div className="flex items-center space-x-4">
                            {/* Search button */}
                            <div className="w-5 h-5">
                                {url === "/landing" && (
                                    <button
                                        onClick={() =>
                                            setSearchOpen(!searchOpen)
                                        }
                                        className="text-gray-600 hover:text-pamasoul-600"
                                    >
                                        <MagnifyingGlassIcon className="h-5 w-5" />
                                    </button>
                                )}
                            </div>

                            <Link
                                href="/cart"
                                className="relative text-gray-600 hover:text-pamasoul-600"
                            >
                                <ShoppingCartIcon className="h-5 w-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* User Dropdown Trigger */}
                            {user ? (
                                <div className="relative">
                                    <button
                                        ref={buttonRef}
                                        onClick={() =>
                                            setUserDropdownOpen(
                                                !userDropdownOpen,
                                            )
                                        }
                                        className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-pamasoul-500"
                                    >
                                        {/* Circle with initials */}
                                        <div className="h-7 w-7 rounded-full bg-pamasoul-600 flex items-center justify-center">
                                            <span className="text-xs font-semibold text-white">
                                                {getUserInitials()}
                                            </span>
                                        </div>
                                        {/* Dropdown icon */}
                                        <ChevronDownIcon
                                            className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${userDropdownOpen ? "rotate-180" : ""}`}
                                        />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {userDropdownOpen && (
                                        <div
                                            ref={dropdownRef}
                                            className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-fadeIn"
                                        >
                                            {/* Profile Section */}
                                            <Link
                                                href="/profile"
                                                onClick={() =>
                                                    setUserDropdownOpen(false)
                                                }
                                                className="block p-5 text-center hover:bg-gray-50 transition-colors border-b border-gray-100"
                                            >
                                                {/* Large circle with initials */}
                                                <div className="h-16 w-16 rounded-full bg-pamasoul-600 flex items-center justify-center mx-auto mb-3 shadow-md">
                                                    <span className="text-2xl font-bold text-white">
                                                        {getUserInitials()}
                                                    </span>
                                                </div>
                                                {/* User Name */}
                                                <p className="font-semibold text-gray-900">
                                                    {user.name}
                                                </p>
                                                {/* User Email */}
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {user.email}
                                                </p>
                                            </Link>

                                            {/* Menu Items */}
                                            <div className="py-2">
                                                <Link
                                                    href="/my-orders"
                                                    onClick={() =>
                                                        setUserDropdownOpen(
                                                            false,
                                                        )
                                                    }
                                                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                >
                                                    <ClipboardDocumentListIcon className="h-5 w-5 mr-3 text-gray-400" />
                                                    My Orders
                                                </Link>
                                                <Link
                                                    href="/profile"
                                                    onClick={() =>
                                                        setUserDropdownOpen(
                                                            false,
                                                        )
                                                    }
                                                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                >
                                                    <UserCircleIcon className="h-5 w-5 mr-3 text-gray-400" />
                                                    Profile Settings
                                                </Link>

                                                {user.role === "admin" && (
                                                    <Link
                                                        href="/admin/dashboard"
                                                        onClick={() =>
                                                            setUserDropdownOpen(
                                                                false,
                                                            )
                                                        }
                                                        className="flex items-center px-4 py-2.5 text-sm text-pamasoul-600 hover:bg-gray-50 transition-colors border-t border-gray-100 mt-1"
                                                    >
                                                        <ShieldCheckIcon className="h-5 w-5 mr-3" />
                                                        Admin Panel
                                                    </Link>
                                                )}

                                                <Link
                                                    href="/logout"
                                                    method="post"
                                                    as="button"
                                                    onClick={() =>
                                                        setUserDropdownOpen(
                                                            false,
                                                        )
                                                    }
                                                    className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100 mt-1"
                                                >
                                                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                                                    Logout
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Link
                                        href="/login"
                                        className="flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 hover:text-pamasoul-600"
                                    >
                                        <UserIcon className="h-4 w-4" />
                                        <span>Login</span>
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-pamasoul-600 hover:bg-pamasoul-700 transition-colors text-sm font-medium text-white shadow-sm"
                                    >
                                        <UserIcon className="h-4 w-4" />
                                        <span>Register</span>
                                    </Link>
                                </div>
                            )}

                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="md:hidden text-gray-600 hover:text-pamasoul-600"
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
                                    className="w-full rounded-lg border-gray-300 pr-12 focus:border-pamasoul-500 focus:ring-pamasoul-500 text-gray-900 placeholder-gray-400"
                                />
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

            {/* Mobile menu sidebar - UPDATED with slugs */}
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
                                        ? "text-pamasoul-600"
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
                                        ? "text-pamasoul-600"
                                        : "text-gray-700"
                                }`}
                            >
                                Shop
                            </Link>
                            <button
                                onClick={() => {
                                    handleCategoryClick("fishing-rods");
                                    setMobileMenuOpen(false);
                                }}
                                className={`block w-full text-left py-2 text-base font-medium ${
                                    isCategoryActive("fishing-rods")
                                        ? "text-pamasoul-600"
                                        : "text-gray-700"
                                }`}
                            >
                                Rods
                            </button>
                            <button
                                onClick={() => {
                                    handleCategoryClick("fishing-lines");
                                    setMobileMenuOpen(false);
                                }}
                                className={`block w-full text-left py-2 text-base font-medium ${
                                    isCategoryActive("fishing-lines")
                                        ? "text-pamasoul-600"
                                        : "text-gray-700"
                                }`}
                            >
                                Lines
                            </button>
                            <button
                                onClick={() => {
                                    handleCategoryClick("reels");
                                    setMobileMenuOpen(false);
                                }}
                                className={`block w-full text-left py-2 text-base font-medium ${
                                    isCategoryActive("reels")
                                        ? "text-pamasoul-600"
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
                                                className="block py-2 text-pamasoul-600"
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
                                        className="block py-2 text-pamasoul-600"
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
                {!hideAds && (
                    <div
                        className={`hidden xl:block absolute left-0 w-48 space-y-4 ${
                            currentPage === "home" || currentPage === "landing"
                                ? "top-[56vh]"
                                : currentPage === "other"
                                  ? "top-32"
                                  : "top-[280px]"
                        }`}
                    >
                        <AdBanner
                            position="left"
                            page={currentPage}
                            className="rounded-none shadow-none"
                            adHeight="h-auto"
                        />
                    </div>
                )}

                {/* Right Side Ad - Configurable positioning */}
                {!hideAds && (
                    <div
                        className={`hidden xl:block absolute right-0 w-48 space-y-4 ${
                            currentPage === "home" || currentPage === "landing"
                                ? "top-[56vh]"
                                : currentPage === "other"
                                  ? "top-32"
                                  : "top-[280px]"
                        }`}
                    >
                        <AdBanner
                            position="right"
                            page={currentPage}
                            className="rounded-none shadow-none"
                            adHeight="h-auto"
                        />
                    </div>
                )}

                {children}
            </main>

            {/* Footer */}
            <footer className="bg-pamasoul-dark text-white mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Brand Column */}
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

                        {/* Quick Links Column */}
                        <div>
                            <h3 className="font-semibold mb-4 text-white">
                                Quick Links
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>
                                    <Link
                                        href="/shop"
                                        className="hover:text-white transition-colors"
                                    >
                                        Shop All
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={() =>
                                            handleCategoryClick("fishing-rods")
                                        }
                                        className="hover:text-white transition-colors"
                                    >
                                        Fishing Rods
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() =>
                                            handleCategoryClick("fishing-lines")
                                        }
                                        className="hover:text-white transition-colors"
                                    >
                                        Fishing Lines
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() =>
                                            handleCategoryClick("reels")
                                        }
                                        className="hover:text-white transition-colors"
                                    >
                                        Reels
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Customer Service Column - UPDATED with new pages */}
                        <div>
                            <h3 className="font-semibold mb-4 text-white">
                                Customer Service
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>
                                    <Link
                                        href="/my-orders"
                                        className="hover:text-white transition-colors"
                                    >
                                        My Orders
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/cart"
                                        className="hover:text-white transition-colors"
                                    >
                                        Shopping Cart
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/support"
                                        className="hover:text-white transition-colors"
                                    >
                                        Customer Support
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/policies"
                                        className="hover:text-white transition-colors"
                                    >
                                        Store Policies
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/about"
                                        className="hover:text-white transition-colors"
                                    >
                                        About Us
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Column */}
                        <div>
                            <h3 className="font-semibold mb-4 text-white">
                                Contact Us
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li className="flex items-center space-x-2">
                                    <span>📞</span>
                                    <span>(+63) 9389317261</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <span>✉️</span>
                                    <a
                                        href="mailto:support@pamasoul.com"
                                        className="hover:text-white transition-colors"
                                    >
                                        support@pamasoul.com
                                    </a>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <span>📍</span>
                                    <span>Tubigon, Bohol, Philippines</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
                        <p>
                            &copy; {new Date().getFullYear()} Pamasoul Fishing
                            Tackle. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>

            {/* Add animation CSS */}
            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
            `}</style>
        </div>
    );
}
