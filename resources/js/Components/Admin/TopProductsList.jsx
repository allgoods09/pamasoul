import React from 'react';
import { Link } from '@inertiajs/react';

export default function TopProductsList({ products }) {
    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Top Selling Products</h2>
                {products.length > 0 ? (
                    <div className="space-y-4">
                        {products.map((product, index) => (
                            <div key={product.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0 w-8 text-center">
                                        <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{product.name}</p>
                                        <p className="text-sm text-gray-500">{product.category?.name}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">
                                        {product.order_items_count} sold
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        ₱{Number(product.price).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <Link
                            href="/admin/products"
                            className="block text-center text-sm text-blue-600 hover:text-blue-800 pt-2"
                        >
                            Manage all products →
                        </Link>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-4">No sales data yet.</p>
                )}
            </div>
        </div>
    );
}