import ApplicationLogo from "@/Components/ApplicationLogo";
import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    HomeIcon,
    ShoppingBagIcon,
    TagIcon,
    ShoppingCartIcon,
    UsersIcon,
    ChartBarIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
} from "@heroicons/react/24/outline";

const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: HomeIcon },
    { name: "Products", href: "/admin/products", icon: ShoppingBagIcon },
    { name: "Categories", href: "/admin/categories", icon: TagIcon },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCartIcon },
    { name: "Users", href: "/admin/users", icon: UsersIcon },
    { name: "Analytics", href: "/admin/analytics", icon: ChartBarIcon },
];

export default function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { url } = usePage();
    const user = usePage().props.auth.user;

    const isActive = (href) => {
        // Remove query parameters from URL (everything after ?)
        const currentPath = url.split("?")[0];
        // Check exact match or if current path starts with href (for nested routes)
        return (
            currentPath === href ||
            (href !== "/" && currentPath.startsWith(href + "/"))
        );
    };

    // Consistent active link styling
    const getLinkClass = (active) => {
        return active
            ? "bg-pamasoul-600 text-white shadow-sm"
            : "text-gray-700 hover:bg-pamasoul-50 hover:text-pamasoul-600";
    };

    const getIconClass = (active) => {
        return active
            ? "text-white"
            : "text-gray-400 group-hover:text-pamasoul-600";
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-gray-900/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Static sidebar for desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
                    {/* Sidebar header */}
                    <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
                        <Link
                            href="/admin/dashboard"
                            className="flex items-center space-x-2"
                        >
                            <ApplicationLogo className="h-8 w-8" />
                            <span className="text-xl font-bold text-pamasoul-600">
                                Pamasoul
                            </span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 px-3 py-4">
                        {navigation.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${getLinkClass(active)}`}
                                >
                                    <item.icon
                                        className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${getIconClass(active)}`}
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Sidebar footer - User info */}
                    <div className="border-t border-gray-200 p-4">
                        <div className="flex items-center space-x-3">
                            <div className="h-9 w-9 rounded-full bg-pamasoul-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-semibold text-pamasoul-700">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {user?.role === "admin"
                                        ? "Administrator"
                                        : "Customer"}
                                </p>
                            </div>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors"
                                title="Logout"
                            >
                                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile sidebar - Same styling as desktop */}
            <div
                className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:hidden ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex h-full flex-col">
                    {/* Sidebar header */}
                    <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
                        <Link
                            href="/admin/dashboard"
                            className="flex items-center space-x-2"
                        >
                            <ApplicationLogo className="h-8 w-8" />
                            <span className="text-xl font-bold text-pamasoul-600">
                                Pamasoul
                            </span>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 px-3 py-4">
                        {navigation.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${getLinkClass(active)}`}
                                >
                                    <item.icon
                                        className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${getIconClass(active)}`}
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Sidebar footer */}
                    <div className="border-t border-gray-200 p-4">
                        <div className="flex items-center space-x-3">
                            <div className="h-9 w-9 rounded-full bg-pamasoul-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-semibold text-pamasoul-700">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {user?.role === "admin"
                                        ? "Administrator"
                                        : "Customer"}
                                </p>
                            </div>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors"
                            >
                                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content area */}
            <div className="lg:pl-64">
                {/* Top header */}
                <header className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
                    <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 transition-colors lg:hidden"
                        >
                            <Bars3Icon className="h-6 w-6" />
                        </button>

                        <div className="flex items-center space-x-4 ml-auto lg:ml-0">
                            <span className="text-sm text-gray-500 hidden sm:block">
                                Welcome back,{" "}
                                <span className="font-medium text-gray-700">
                                    {user?.name}
                                </span>
                            </span>
                            <div className="h-6 w-px bg-gray-200 hidden sm:block" />
                            <Link
                                href="/"
                                className="text-sm text-gray-500 hover:text-pamasoul-600 transition-colors"
                            >
                                View Store →
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
