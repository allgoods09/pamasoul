import CustomerLayout from "@/Layouts/CustomerLayout";
import { Head, Link } from "@inertiajs/react";
import {
    ArrowRightIcon,
    ArrowDownIcon,
    TruckIcon,
    ShieldCheckIcon,
    ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import ProductCard from "@/Components/ProductCard";
import ProductImage from "@/Components/ProductImage";
import Reveal from "@/Components/Motion/Reveal";
import usePointerMotion from "@/hooks/usePointerMotion";
import { useMotion } from "@/Components/Motion/MotionProvider";
import { useEffect, useRef } from "react";
const collectionArt = {
    "fishing-rods": "/images/rodbanner.jpg",
    reels: "/images/reelbanner.jpg",
    "fishing-lines": "/images/linebanner.jpg",
};
const collectionCopy = {
    "fishing-rods": "Feel every bite. Make every cast count.",
    reels: "Smooth retrieves. Serious pulling power.",
    "fishing-lines": "Your strongest connection to the water.",
};
export default function Landing({ featuredProducts = [], categories = [] }) {
    const pointerRef = usePointerMotion();
    const photoRef = useRef(null);
    const { mode, reduced } = useMotion();
    const reel = featuredProducts.find((p) => p.category?.slug === "reels");
    useEffect(() => {
        if (mode !== "bold" || reduced) {
            photoRef.current?.style.removeProperty("translate");
            return;
        }
        let frame = 0;
        const update = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                if (!pointerRef.current || !photoRef.current) return;
                const rect = pointerRef.current.getBoundingClientRect();
                if (rect.bottom > 0 && rect.top < window.innerHeight)
                    photoRef.current.style.translate = `0 ${Math.min(100, Math.max(0, -rect.top * 0.16))}px`;
            });
        };
        window.addEventListener("scroll", update, { passive: true });
        update();
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", update);
        };
    }, [mode, reduced, pointerRef]);
    return (
        <CustomerLayout>
            <Head title="PamaSoul · Fishing is in our soul" />
            <section
                ref={pointerRef}
                className="hero-scene relative overflow-hidden text-white"
            >
                <div
                    ref={photoRef}
                    className="hero-photo absolute inset-0"
                    aria-hidden="true"
                >
                    <img
                        src="/images/herobanner.jpg"
                        alt=""
                        fetchPriority="high"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="hero-spotlight" aria-hidden="true" />
                <div className="store-container relative grid lg:grid-cols-[1.15fr_1fr] gap-12 items-center pt-16 pb-24 lg:py-24 min-h-[620px]">
                    <div className="relative z-10 max-w-2xl">
                        <Reveal>
                            <p className="text-xs uppercase tracking-[.25em] text-pamasoul-200 mb-6 flex items-center gap-3">
                                <span className="w-8 h-px bg-pamasoul-300" />
                                For the love of the water
                            </p>
                        </Reveal>
                        <Reveal delay={80}>
                            <h1 className="text-[clamp(2.7rem,5.8vw,5.5rem)] leading-[1.08] font-bold tracking-[-.055em]">
                                Every cast.
                                <br />A little more
                                <br />
                                <span className="text-pamasoul-300">soul.</span>
                            </h1>
                        </Reveal>
                        <Reveal delay={160}>
                            <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-md mt-7">
                                The quiet before the bite. The thrill of the
                                pull. Find rods, reels and lines made for the
                                moments that bring you back.
                            </p>
                            <div className="flex flex-wrap gap-3 mt-9">
                                <Link
                                    href="/shop"
                                    className="button-primary bg-pamasoul-300 text-pamasoul-dark hover:bg-pamasoul-100"
                                >
                                    Shop now{" "}
                                    <ArrowRightIcon className="w-5 h-5" />
                                </Link>
                                <a
                                    href="#collections"
                                    className="inline-flex gap-2 items-center justify-center rounded-xl border border-white/30 px-6 py-3 text-sm font-medium hover:bg-white/10"
                                >
                                    Explore collections{" "}
                                    <ArrowDownIcon className="w-4 h-4" />
                                </a>
                            </div>
                        </Reveal>
                        <Reveal delay={240}>
                            <p className="mt-10 text-[11px] tracking-wider text-white/60">
                                BOHOL ROOTS. A PASSION WITHOUT BORDERS.
                            </p>
                        </Reveal>
                    </div>
                    <div
                        className="hero-object relative hidden lg:block h-[410px]"
                        aria-hidden="true"
                    >
                        <div className="hero-orbit inset-1 story-orb" />
                        <div className="hero-orbit inset-9" />
                        <div className="hero-orbit inset-16 border-dashed" />
                        {reel ? (
                            <div className="hero-reel absolute inset-16 bg-white rounded-full p-10 shadow-2xl">
                                <ProductImage
                                    loading="eager"
                                    product={reel}
                                    alt=""
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        ) : (
                            <div className="absolute inset-16 rounded-full bg-pamasoul-300/10 border border-pamasoul-200/30 flex items-center justify-center">
                                <svg
                                    viewBox="0 0 200 200"
                                    className="w-44 h-44 fill-none stroke-pamasoul-200"
                                    strokeWidth="2"
                                >
                                    <path d="M45 148L148 42M104 87l40 40c27 26 25 49-3 49-27 0-36-21-19-31" />
                                    <path
                                        d="M38 159l19-23"
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </div>
                        )}
                        <div className="floating-tag absolute -left-2 top-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
                            <span className="block text-[9px] uppercase tracking-widest text-pamasoul-200">
                                Find your flow
                            </span>
                            <span className="block text-sm font-medium mt-1">
                                Precision in every pull
                            </span>
                        </div>
                        <div className="floating-tag absolute right-0 bottom-7 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 max-w-[230px]">
                            <span className="text-[9px] uppercase tracking-widest text-pamasoul-200">
                                {reel
                                    ? "From the reel collection"
                                    : "PamaSoul essentials"}
                            </span>
                            <span className="block text-sm font-medium mt-1 line-clamp-2">
                                {reel?.name || "Rods. Reels. Lines."}
                            </span>
                        </div>
                    </div>
                </div>
                <svg
                    viewBox="0 0 1440 60"
                    preserveAspectRatio="none"
                    className="absolute bottom-[-1px] left-0 w-full h-8 sm:h-12 fill-gray-50"
                    aria-hidden="true"
                >
                    <path d="M0 20c200 60 370-30 600 0s420 50 840-10v50H0z" />
                </svg>
            </section>
            <div
                className="marquee overflow-hidden border-b border-pamasoul-100 py-5 bg-gray-50"
                aria-label="Rods, reels, lines. Fishing is in our soul."
            >
                <div
                    className="marquee-track text-sm font-medium uppercase tracking-[.2em] text-pamasoul-700"
                    aria-hidden="true"
                >
                    {[0, 1].map((i) => (
                        <div key={i}>
                            {[
                                "Rods",
                                "✦",
                                "Reels",
                                "✦",
                                "Lines",
                                "✦",
                                "Fishing is in our soul",
                                "✦",
                                "From first cast to last light",
                                "✦",
                            ].map((text, j) => (
                                <span key={j}>{text}</span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <section
                id="collections"
                className="store-container py-16 sm:py-20 scroll-mt-24"
            >
                <Reveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-9">
                    <div>
                        <p className="kicker mb-3">The essentials</p>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-pamasoul-dark">
                            Three ways to find your flow.
                        </h2>
                    </div>
                    <Link
                        href="/shop"
                        className="text-sm font-semibold text-pamasoul-700 flex items-center gap-2"
                    >
                        Explore all tackle{" "}
                        <ArrowRightIcon className="w-4 h-4" />
                    </Link>
                </Reveal>
                <div className="grid sm:grid-cols-3 gap-5">
                    {categories.map((category, i) => (
                        <Reveal key={category.id} delay={i * 90}>
                            <Link
                                href={`/shop?category=${category.slug}`}
                                className="group relative block overflow-hidden rounded-3xl h-72 sm:h-80 bg-pamasoul-dark"
                            >
                                <img
                                    src={
                                        collectionArt[category.slug] ||
                                        "/images/defaultbanner.jpg"
                                    }
                                    alt=""
                                    loading="lazy"
                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-pamasoul-dark via-pamasoul-dark/20 to-transparent" />
                                <div className="relative h-full flex flex-col justify-end p-7 text-white">
                                    <p className="text-[10px] tracking-widest uppercase text-pamasoul-200 mb-2">
                                        {category.products_count} products
                                    </p>
                                    <h3 className="text-2xl font-semibold mb-2">
                                        {category.name}
                                    </h3>
                                    <p className="text-xs text-white/75 leading-relaxed mb-4">
                                        {collectionCopy[category.slug] ||
                                            "Tackle for your next adventure."}
                                    </p>
                                    <span className="flex items-center justify-between text-sm font-medium">
                                        Discover collection{" "}
                                        <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </div>
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </section>
            <section
                id="featured"
                className="bg-white border-y border-pamasoul-50 py-16 sm:py-20"
            >
                <div className="store-container">
                    <Reveal className="mb-9">
                        <p className="kicker mb-3">Fresh in the tackle box</p>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-pamasoul-dark">
                            Your next favorite piece of gear.
                        </h2>
                        <p className="text-sm text-gray-500 mt-3">
                            Explore the latest additions to our collection.
                        </p>
                    </Reveal>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                        {featuredProducts.map((product, i) => (
                            <Reveal key={product.id} delay={(i % 4) * 65}>
                                <ProductCard product={product} />
                            </Reveal>
                        ))}
                    </div>
                    {!featuredProducts.length && (
                        <p className="rounded-2xl bg-pamasoul-50 p-8 text-pamasoul-700">
                            Our tackle box is being restocked. Check back soon.
                        </p>
                    )}
                    <Reveal className="text-center mt-10">
                        <Link href="/shop" className="button-secondary">
                            Find your gear{" "}
                            <ArrowRightIcon className="w-4 h-4" />
                        </Link>
                    </Reveal>
                </div>
            </section>
            <section className="store-container py-20">
                <div className="grid md:grid-cols-2 gap-10 lg:gap-20 items-center">
                    <Reveal className="relative overflow-hidden rounded-3xl h-80 sm:h-96 bg-pamasoul-50 flex items-center justify-center">
                        <div className="story-orb absolute w-80 h-80 rounded-full border border-pamasoul-200 border-dashed" />
                        <div className="absolute w-60 h-60 rounded-full bg-pamasoul-100/70" />
                        <div className="relative text-center">
                            <p className="text-xs uppercase tracking-[.3em] text-pamasoul-700 mb-3">
                                Pamasol + Soul
                            </p>
                            <p className="text-5xl sm:text-6xl font-bold tracking-tight text-pamasoul-dark">
                                It’s in
                                <br />
                                our soul
                                <span className="text-pamasoul-400">.</span>
                            </p>
                            <p className="mt-5 text-xs text-pamasoul-700">
                                ROOTED IN BOHOL, PHILIPPINES
                            </p>
                        </div>
                    </Reveal>
                    <Reveal delay={100}>
                        <p className="kicker mb-4">More than a hobby</p>
                        <h2 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight text-pamasoul-dark">
                            Some things pull you
                            <br />
                            back to the water.
                        </h2>
                        <p className="text-sm leading-7 text-gray-600 mt-6">
                            PamaSoul brings together “Pamasol,” the Cebuano word
                            for fishing, and “Soul.” Because for us, fishing is
                            part of who we are. We’re here for the early starts,
                            the patient waits and the stories you bring home.
                        </p>
                        <Link
                            href="/about"
                            className="inline-flex items-center gap-3 text-sm font-semibold text-pamasoul-700 mt-7"
                        >
                            Meet PamaSoul <ArrowRightIcon className="w-4 h-4" />
                        </Link>
                    </Reveal>
                </div>
            </section>
            <section className="store-container pb-4">
                <Reveal className="grid sm:grid-cols-3 gap-6 rounded-3xl border border-pamasoul-100 bg-pamasoul-50/60 p-7 sm:p-9">
                    {[
                        [
                            TruckIcon,
                            "Shipping across the Philippines",
                            "Delivery fees clearly shown at checkout.",
                        ],
                        [
                            ShieldCheckIcon,
                            "Your account, your gear",
                            "Keep your cart and follow your orders.",
                        ],
                        [
                            ChatBubbleLeftRightIcon,
                            "Let’s talk tackle",
                            "Questions before your next trip? We’re here.",
                        ],
                    ].map(([Icon, title, copy]) => (
                        <div key={title} className="flex gap-4">
                            <Icon className="h-6 w-6 text-pamasoul-600 shrink-0 mt-1" />
                            <div>
                                <h3 className="text-sm font-semibold text-pamasoul-dark">
                                    {title}
                                </h3>
                                <p className="text-xs leading-6 text-gray-600 mt-1">
                                    {copy}
                                </p>
                            </div>
                        </div>
                    ))}
                </Reveal>
            </section>
        </CustomerLayout>
    );
}
