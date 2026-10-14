import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import {
    MagnifyingGlassIcon,
    AdjustmentsHorizontalIcon,
    ArrowRightIcon,
} from "@heroicons/react/24/outline";
import CustomerLayout from "@/Layouts/CustomerLayout";
import ProductCard from "@/Components/ProductCard";
import Reveal from "@/Components/Motion/Reveal";
export default function ShopIndex({
    products,
    categories = [],
    filters = {},
    errors = {},
}) {
    const [form, setForm] = useState({
        search: "",
        category: "",
        sort: "latest",
        min_price: "",
        max_price: "",
        ...filters,
    });
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(false);
    useEffect(
        () =>
            setForm({
                search: "",
                category: "",
                sort: "latest",
                min_price: "",
                max_price: "",
                ...filters,
            }),
        [filters],
    );
    const change = (key, value, apply = false) => {
        const next = { ...form, [key]: value };
        setForm(next);
        if (apply) visit(next);
    };
    const visit = (next) =>
        router.get(
            "/shop",
            Object.fromEntries(
                Object.entries(next).filter(([, v]) => v !== ""),
            ),
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                onStart: () => setLoading(true),
                onFinish: () => setLoading(false),
            },
        );
    const category = categories.find((c) => c.slug === form.category);
    const clear = () => visit({ sort: "latest" });
    return (
        <CustomerLayout>
            <Head title={category?.name || "Shop all tackle"} />
            <section className="bg-pamasoul-50 border-b border-pamasoul-100">
                <div className="store-container py-12 sm:py-16">
                    <p className="kicker mb-3">The PamaSoul collection</p>
                    <h1 className="text-3xl sm:text-5xl font-bold text-pamasoul-dark tracking-tight">
                        {category?.name || "Find your next great catch."}
                    </h1>
                    <p className="text-sm text-pamasoul-700 mt-4">
                        Thoughtful tackle. Real adventure. Explore rods, reels
                        and lines.
                    </p>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            visit(form);
                        }}
                        role="search"
                        className="flex gap-2 mt-7 max-w-xl"
                    >
                        <input
                            aria-label="Search products"
                            value={form.search}
                            onChange={(e) => change("search", e.target.value)}
                            placeholder="Search your next piece of gear…"
                            maxLength={150}
                            className="rounded-xl border-pamasoul-200 focus:ring-pamasoul-500 focus:border-pamasoul-500 w-full min-w-0 text-sm"
                        />
                        <button
                            aria-label="Search"
                            className="button-primary px-5"
                        >
                            <MagnifyingGlassIcon className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </section>
            <div className="store-container py-8 sm:py-10">
                <div className="flex gap-2 flex-wrap mb-6">
                    {[
                        ["", "All tackle"],
                        ...categories.map((c) => [c.slug, c.name]),
                    ].map(([slug, label]) => (
                        <button
                            key={slug}
                            onClick={() => change("category", slug, true)}
                            className={`rounded-full min-h-[44px] px-5 py-2 text-xs font-semibold border ${form.category === slug ? "bg-pamasoul-600 text-white border-pamasoul-600" : "border-gray-200 bg-white text-gray-600 hover:border-pamasoul-300"}`}
                            aria-pressed={form.category === slug}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <div className="flex flex-wrap gap-3 items-center justify-between mb-5">
                    <p
                        className="text-xs sm:text-sm text-gray-500"
                        aria-live="polite"
                    >
                        {loading
                            ? "Finding your gear…"
                            : `Showing ${products.from || 0}–${products.to || 0} of ${products.total} products`}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setExpanded(!expanded)}
                            aria-expanded={expanded}
                            aria-controls="price-filters"
                            className="button-secondary px-3 py-2 text-xs"
                        >
                            <AdjustmentsHorizontalIcon className="w-4 h-4" />
                            Price filters
                        </button>
                        <select
                            aria-label="Sort products"
                            value={form.sort}
                            onChange={(e) =>
                                change("sort", e.target.value, true)
                            }
                            className="rounded-xl text-xs border-gray-200 focus:ring-pamasoul-500"
                        >
                            <option value="latest">Newest arrivals</option>
                            <option value="price_low">
                                Price: low to high
                            </option>
                            <option value="price_high">
                                Price: high to low
                            </option>
                            <option value="name_asc">Name: A–Z</option>
                            <option value="name_desc">Name: Z–A</option>
                        </select>
                    </div>
                </div>
                {expanded && (
                    <form
                        id="price-filters"
                        onSubmit={(e) => {
                            e.preventDefault();
                            visit(form);
                        }}
                        className="commerce-panel p-5 mb-6 flex flex-wrap gap-4 items-end page-content"
                    >
                        <div>
                            <label
                                htmlFor="min-price"
                                className="block text-xs text-gray-600 mb-2"
                            >
                                Minimum price (₱)
                            </label>
                            <input
                                id="min-price"
                                type="number"
                                min="0"
                                max="999999.99"
                                step=".01"
                                value={form.min_price}
                                onChange={(e) =>
                                    change("min_price", e.target.value)
                                }
                                className="rounded-xl border-gray-200 w-36"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="max-price"
                                className="block text-xs text-gray-600 mb-2"
                            >
                                Maximum price (₱)
                            </label>
                            <input
                                id="max-price"
                                type="number"
                                min="0"
                                max="999999.99"
                                step=".01"
                                value={form.max_price}
                                onChange={(e) =>
                                    change("max_price", e.target.value)
                                }
                                className="rounded-xl border-gray-200 w-36"
                            />
                        </div>
                        <button disabled={loading} className="button-primary">
                            Apply price
                        </button>
                    </form>
                )}
                {Object.values(errors).map((message, i) => (
                    <p key={i} role="alert" className="form-error mb-4">
                        {message}
                    </p>
                ))}
                {(form.search ||
                    form.category ||
                    form.min_price !== "" ||
                    form.max_price !== "") && (
                    <button
                        onClick={clear}
                        className="text-xs font-semibold text-pamasoul-700 underline underline-offset-4 mb-6"
                    >
                        Clear filters
                    </button>
                )}
                <div
                    aria-busy={loading}
                    className={
                        loading
                            ? "opacity-60 transition-opacity"
                            : "transition-opacity"
                    }
                >
                    {products.data.length ? (
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                            {products.data.map((product, i) => (
                                <Reveal
                                    key={`${products.current_page}-${product.id}`}
                                    delay={(i % 4) * 40}
                                >
                                    <ProductCard product={product} />
                                </Reveal>
                            ))}
                        </div>
                    ) : (
                        <div className="commerce-panel text-center py-16 px-6">
                            <MagnifyingGlassIcon className="h-12 w-12 mx-auto text-pamasoul-300" />
                            <h2 className="mt-5 text-xl font-semibold text-pamasoul-dark">
                                No gear matches just yet.
                            </h2>
                            <p className="text-sm text-gray-500 mt-3">
                                Try a different search or widen your price
                                range.
                            </p>
                            <button
                                onClick={clear}
                                className="button-primary mt-6"
                            >
                                Explore all tackle{" "}
                                <ArrowRightIcon className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
                {products.last_page > 1 && (
                    <nav
                        aria-label="Product pagination"
                        className="flex flex-wrap justify-center gap-2 mt-10"
                    >
                        {products.links.map((link, i) =>
                            link.url ? (
                                <Link
                                    key={i}
                                    href={link.url}
                                    preserveScroll
                                    className={`min-w-[44px] min-h-[44px] flex items-center justify-center px-3 rounded-xl border text-xs ${link.active ? "bg-pamasoul-600 text-white border-pamasoul-600" : "bg-white border-gray-200 text-gray-600"}`}
                                    aria-current={
                                        link.active ? "page" : undefined
                                    }
                                >
                                    {link.label
                                        .replace("&laquo;", "‹")
                                        .replace("&raquo;", "›")}
                                </Link>
                            ) : (
                                <span
                                    key={i}
                                    aria-disabled="true"
                                    className="min-h-[44px] flex items-center px-3 text-xs text-gray-400"
                                >
                                    {link.label
                                        .replace("&laquo;", "‹")
                                        .replace("&raquo;", "›")}
                                </span>
                            ),
                        )}
                    </nav>
                )}
            </div>
        </CustomerLayout>
    );
}
