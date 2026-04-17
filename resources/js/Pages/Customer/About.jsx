import CustomerLayout from "@/Layouts/CustomerLayout";
import { Head } from "@inertiajs/react";

export default function About() {
    return (
        <CustomerLayout>
            <Head title="About Us - Pamasoul" />

            <div className="bg-gray-50 min-h-screen py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            About Pamasoul
                        </h1>
                        <div className="w-24 h-1 bg-pamasoul-600 mx-auto"></div>
                    </div>

                    {/* Story Section */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Our Story
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Founded in 2024, Pamasoul was born from a
                                passion for fishing and a desire to provide
                                Filipino anglers with premium quality fishing
                                tackle at affordable prices. What started as a
                                small local shop in Tubigon, Bohol has grown
                                into a trusted name among fishing enthusiasts
                                across the Philippines.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Our name "Pamasoul" combines "Pamana" (heritage)
                                and "Soul" - representing our commitment to
                                preserving the rich fishing heritage of the
                                Philippines while bringing modern, high-quality
                                gear to every angler.
                            </p>
                        </div>
                    </div>

                    {/* Mission & Vision */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                    Our Mission
                                </h2>
                                <p className="text-gray-600 leading-relaxed">
                                    To empower every Filipino angler with
                                    quality, reliable fishing gear that enhances
                                    their fishing experience and helps them
                                    create lasting memories on the water.
                                </p>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                    Our Vision
                                </h2>
                                <p className="text-gray-600 leading-relaxed">
                                    To become the most trusted fishing tackle
                                    retailer in the Philippines, known for
                                    quality products, expert knowledge, and
                                    genuine passion for the sport.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Values */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                                Our Core Values
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="text-4xl mb-3">🎣</div>
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        Quality First
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        We only stock gear we'd use ourselves
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl mb-3">💙</div>
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        Customer Trust
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Your satisfaction is our priority
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl mb-3">🌊</div>
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        Passion for Fishing
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        We live and breathe the sport
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Team Section */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                                Meet Our Team
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Team Member 1 */}
                                <div className="text-center">
                                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-3 bg-gray-100">
                                        <img
                                            src="https://dailytheology.org/wp-content/uploads/2013/08/heisenberg-breaking-bad.jpg?w=590"
                                            alt="Walter White - Founder & Master Angler"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src =
                                                    "https://placehold.co/400x400/e2e8f0/64748b?text=WW";
                                            }}
                                        />
                                    </div>
                                    <h3 className="font-semibold text-gray-900">
                                        Walter White
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Founder & Master Angler
                                    </p>
                                </div>

                                {/* Team Member 2 */}
                                <div className="text-center">
                                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-3 bg-gray-100">
                                        <img
                                            src="https://upload.wikimedia.org/wikipedia/commons/6/6f/Jeremy_Wade_2011_Shankbone.jpg"
                                            alt="Jeremy Wade - Lead Angler"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src =
                                                    "https://placehold.co/400x400/e2e8f0/64748b?text=JW";
                                            }}
                                        />
                                    </div>
                                    <h3 className="font-semibold text-gray-900">
                                        Jeremy Wade
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Lead Angler
                                    </p>
                                </div>

                                {/* Team Member 3 */}
                                <div className="text-center">
                                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-3 bg-gray-100">
                                        <img
                                            src="https://m.media-amazon.com/images/M/MV5BYWYwYzYzMjUtNWE0MS00NmJlLTljNGMtNzliYjg5NzQ1OWY5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg"
                                            alt="Taylor Swift - Executive Dancer/Singer"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src =
                                                    "https://placehold.co/400x400/e2e8f0/64748b?text=PR";
                                            }}
                                        />
                                    </div>
                                    <h3 className="font-semibold text-gray-900">
                                        Taylor Swift
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Executive Dancer/Singer
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
