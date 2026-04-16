import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

export default function GuestLayout({ children }) {
    return (
        <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
            {/* Decorative background pattern */}
            <div className="absolute inset-0 bg-grid-gray-900/[0.02] bg-[size:20px_20px] pointer-events-none" />
            
            <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                {/* Logo and Brand */}
                <div className="mb-8 text-center">
                    <Link href="/" className="group inline-flex flex-col items-center space-y-3">
                        <div className="rounded-full bg-blue-100 p-3 shadow-lg transition-transform group-hover:scale-105">
                            <ApplicationLogo className="h-12 w-auto" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Pamasoul</h1>
                            <p className="text-sm text-gray-500">Premium Fishing Tackle</p>
                        </div>
                    </Link>
                </div>

                {/* Card Container */}
                <div className="w-full max-w-md">
                    <div className="rounded-2xl bg-white shadow-xl ring-1 ring-gray-900/5">
                        <div className="px-6 py-8 sm:p-10">
                            {children}
                        </div>
                    </div>

                    {/* Footer Links */}
                    <div className="mt-6 text-center text-xs text-gray-500">
                        <p>© {new Date().getFullYear()} Pamasoul Fishing Tackle. All rights reserved.</p>
                        <div className="mt-2 flex justify-center space-x-4">
                            <Link href="/" className="hover:text-blue-600">Home</Link>
                            <Link href="/shop" className="hover:text-blue-600">Shop</Link>
                            <Link href="#" className="hover:text-blue-600">Privacy Policy</Link>
                            <Link href="#" className="hover:text-blue-600">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}