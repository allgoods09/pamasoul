import { Link } from '@inertiajs/react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

export default function Breadcrumb({ items }) {
    return (
        <nav className="flex items-center space-x-2 text-sm mb-6">
            {items.map((item, index) => (
                <div key={index} className="flex items-center">
                    {index > 0 && <ChevronRightIcon className="h-4 w-4 text-gray-400 mx-1" />}
                    {item.href ? (
                        <Link href={item.href} className="text-gray-500 hover:text-blue-600">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-gray-900 font-medium">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}