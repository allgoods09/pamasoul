import { useState, useEffect, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function AdBanner({ position, page, className = '' }) {
    const [ads, setAds] = useState([]);
    const [closedAds, setClosedAds] = useState({});
    const [loading, setLoading] = useState(true);
    const [shouldLoad, setShouldLoad] = useState(false);
    const observerRef = useRef(null);

    // Use Intersection Observer to load ads only when visible
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setShouldLoad(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1, rootMargin: '100px' } // Start loading when ad area is 100px from viewport
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Load ads only when shouldLoad is true
    useEffect(() => {
        if (!shouldLoad) return;

        const storedClosed = localStorage.getItem(`ad_closed_${position}`);
        if (storedClosed) {
            try {
                setClosedAds(JSON.parse(storedClosed));
            } catch(e) {
                setClosedAds({});
            }
        }

        // Use requestIdleCallback to load ads during idle time
        const loadAds = () => {
            fetch(`/api/ads?position=${position}&page=${page}&limit=3`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.ads.length > 0) {
                        setAds(data.ads);
                    }
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        };

        if ('requestIdleCallback' in window) {
            requestIdleCallback(loadAds, { timeout: 3000 });
        } else {
            setTimeout(loadAds, 100);
        }
    }, [shouldLoad, position, page]);

    const handleClose = (adId) => {
        const newClosedAds = { ...closedAds, [adId]: true };
        setClosedAds(newClosedAds);
        localStorage.setItem(`ad_closed_${position}`, JSON.stringify(newClosedAds));
    };

    const handleAdClick = async (ad) => {
        try {
            await fetch(`/api/ads/${ad.id}/click`, { method: 'POST' });
        } catch {}
        window.open(ad.link_url, '_blank');
    };

    if (loading || !shouldLoad) {
        // Reserve space to prevent layout shift
        return <div ref={observerRef} className={`space-y-5 ${className}`}>
            <div className="h-96 bg-gray-50 animate-pulse rounded"></div>
        </div>;
    }

    const visibleAds = ads.filter(ad => !closedAds[ad.id]);
    if (visibleAds.length === 0) return null;

    return (
        <div ref={observerRef} className={`space-y-5 ${className}`}>
            {visibleAds.map((ad) => (
                <div
                    key={ad.id}
                    className="relative border border-gray-200 bg-white hover:border-gray-300 transition cursor-pointer"
                    onClick={() => handleAdClick(ad)}
                >
                    {/* Close */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClose(ad.id);
                        }}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 z-10"
                    >
                        <XMarkIcon className="h-4 w-4" />
                    </button>

                    {/* Image */}
                    {ad.image_url && (
                        <div className="w-full h-44 bg-gray-100">
                            <img
                                src={ad.image_url}
                                alt={ad.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                onError={(e) => (e.target.style.display = 'none')}
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-4">
                        <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-2">
                            Sponsored
                        </div>

                        <h3 className="text-base font-semibold text-gray-900 leading-snug">
                            {ad.title}
                        </h3>

                        {ad.description && (
                            <p className="text-sm text-gray-500 mt-2 leading-relaxed line-clamp-3">
                                {ad.description}
                            </p>
                        )}

                        <div className="mt-4">
                            <span className="inline-block text-sm font-medium text-white bg-pamasoul-600 px-4 py-2 hover:bg-pamasoul-800 transition">
                                Learn More
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}