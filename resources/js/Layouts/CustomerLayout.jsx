import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
} from "@headlessui/react";
import {
    Bars3Icon,
    XMarkIcon,
    ShoppingCartIcon,
    UserIcon,
    ChevronDownIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import MotionControl from "@/Components/Motion/MotionControl";
const categories = [
    ["Rods", "fishing-rods"],
    ["Reels", "reels"],
    ["Lines", "fishing-lines"],
];
export default function CustomerLayout({ children }) {
    const { auth, cartCount = 0, shippingConfig } = usePage().props;
    const { url } = usePage();
    const [search, setSearch] = useState("");
    const handleCategoryClick = (slug) =>
        router.get("/shop", { category: slug });
    const account = auth.user
        ? [
              ["/profile", "My profile"],
              ["/my-orders", "My orders"],
              ...(auth.user.role === "admin"
                  ? [["/admin/dashboard", "Administration"]]
                  : []),
          ]
        : [
              ["/login", "Sign in"],
              ["/register", "Create account"],
          ];
    const submitSearch = (e) => {
        e.preventDefault();
        router.get("/shop", { search: search.trim() });
    };
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] button-primary"
            >
                Skip to content
            </a>
            <div className="bg-pamasoul-dark text-white/90 text-center text-[10px] sm:text-xs py-2 px-4 tracking-wide">
                Fishing is in our soul{" "}
                <span className="mx-3 text-pamasoul-300">✦</span>
                {Number(shippingConfig?.free_threshold) > 0
                    ? `Free shipping from ₱${Number(shippingConfig.free_threshold).toLocaleString("en-PH")}`
                    : "Rods, reels & lines · Bohol, Philippines"}
            </div>
            <Disclosure
                as="header"
                className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-pamasoul-100 shadow-sm"
            >
                {({ open, close }) => (
                    <>
                        <div className="store-container flex h-[76px] items-center gap-1 sm:gap-3">
                            <Link
                                href="/"
                                className="flex items-center gap-2 mr-auto shrink-0"
                                aria-label="PamaSoul home"
                            >
                                <ApplicationLogo className="h-9 sm:h-11 w-auto" />
                                <span className="hidden min-[400px]:block text-lg sm:text-xl font-bold text-pamasoul-dark">
                                    PamaSoul
                                    <span className="text-pamasoul-400">.</span>
                                    <span className="block text-[8px] font-medium tracking-[.2em] uppercase text-pamasoul-600">
                                        Fishing tackle
                                    </span>
                                </span>
                            </Link>
                            <nav
                                aria-label="Main navigation"
                                className="hidden lg:flex gap-6 items-center text-sm font-medium mr-3"
                            >
                                <Link
                                    href="/shop"
                                    className={
                                        url === "/shop"
                                            ? "text-pamasoul-700"
                                            : "text-gray-600 hover:text-pamasoul-600"
                                    }
                                >
                                    Shop all
                                </Link>
                                {categories.map(([name, slug]) => (
                                    <Link
                                        key={slug}
                                        href={`/shop?category=${slug}`}
                                        className={
                                            url.includes(`category=${slug}`)
                                                ? "text-pamasoul-700"
                                                : "text-gray-600 hover:text-pamasoul-600"
                                        }
                                    >
                                        {name}
                                    </Link>
                                ))}
                                <Link
                                    href="/about"
                                    className="text-gray-600 hover:text-pamasoul-600"
                                >
                                    Our story
                                </Link>
                            </nav>
                            <MotionControl />
                            <Menu as="div" className="relative hidden sm:block">
                                <MenuButton
                                    aria-label="Account menu"
                                    className="flex gap-1 items-center min-h-[44px] p-3 rounded-xl text-gray-600 hover:bg-pamasoul-50"
                                >
                                    <UserIcon className="w-5 h-5" />
                                    <ChevronDownIcon className="w-3 h-3" />
                                </MenuButton>
                                <MenuItems
                                    transition
                                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-pamasoul-100 shadow-xl p-2 origin-top-right transition data-[closed]:opacity-0 data-[closed]:scale-95"
                                >
                                    {auth.user && (
                                        <p className="px-3 py-3 text-xs text-gray-500 truncate">
                                            Signed in as {auth.user.name}
                                        </p>
                                    )}
                                    {account.map(([href, text]) => (
                                        <MenuItem key={href}>
                                            <Link
                                                href={href}
                                                className="block p-3 text-sm rounded-xl data-[focus]:bg-pamasoul-50"
                                            >
                                                {text}
                                            </Link>
                                        </MenuItem>
                                    ))}
                                    {auth.user && (
                                        <MenuItem>
                                            <Link
                                                href="/logout"
                                                method="post"
                                                as="button"
                                                className="w-full text-left p-3 text-sm rounded-xl data-[focus]:bg-pamasoul-50"
                                            >
                                                Sign out
                                            </Link>
                                        </MenuItem>
                                    )}
                                </MenuItems>
                            </Menu>
                            <Link
                                href="/cart"
                                aria-label={`Shopping cart, ${cartCount} items`}
                                className="relative p-3 min-h-[44px] rounded-xl text-pamasoul-800 hover:bg-pamasoul-50"
                            >
                                <ShoppingCartIcon className="w-5 h-5" />
                                {cartCount > 0 && (
                                    <span
                                        key={cartCount}
                                        className="quantity-value absolute top-0 right-0 rounded-full bg-pamasoul-600 text-white text-[10px] min-w-5 h-5 px-1 flex items-center justify-center"
                                    >
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                            <DisclosureButton
                                className="p-3 lg:hidden rounded-xl hover:bg-pamasoul-50"
                                aria-label={open ? "Close menu" : "Open menu"}
                            >
                                {open ? (
                                    <XMarkIcon className="w-5 h-5" />
                                ) : (
                                    <Bars3Icon className="w-5 h-5" />
                                )}
                            </DisclosureButton>
                        </div>
                        <DisclosurePanel
                            transition
                            className="border-t border-pamasoul-100 lg:hidden px-5 pb-5 transition data-[closed]:opacity-0"
                        >
                            <form
                                onSubmit={(e) => {
                                    submitSearch(e);
                                    close();
                                }}
                                className="flex gap-2 my-4"
                            >
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    aria-label="Search products"
                                    placeholder="Find your next rod, reel or line…"
                                    className="rounded-xl border-gray-200 min-w-0 w-full text-sm focus:border-pamasoul-500 focus:ring-pamasoul-500"
                                />
                                <button
                                    className="button-primary px-4"
                                    aria-label="Search"
                                >
                                    <MagnifyingGlassIcon className="w-5 h-5" />
                                </button>
                            </form>
                            <nav
                                aria-label="Mobile navigation"
                                className="grid grid-cols-2 gap-1"
                            >
                                {[
                                    ["/shop", "Shop all"],
                                    ...categories.map(([label, slug]) => [
                                        `/shop?category=${slug}`,
                                        label,
                                    ]),
                                    ["/about", "Our story"],
                                    ["/support", "Support"],
                                    ...account,
                                ].map(([href, text]) => (
                                    <Link
                                        onClick={() => close()}
                                        href={href}
                                        key={href}
                                        className="p-3 text-sm rounded-xl hover:bg-pamasoul-50"
                                    >
                                        {text}
                                    </Link>
                                ))}
                                {auth.user && (
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="p-3 text-sm text-left"
                                    >
                                        Sign out
                                    </Link>
                                )}
                            </nav>
                        </DisclosurePanel>
                    </>
                )}
            </Disclosure>
            <main
                id="main-content"
                tabIndex={-1}
                className="flex-1 outline-none page-content"
            >
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
                                        className="break-all min-w-0 hover:text-white transition-colors"
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
        </div>
    );
}
