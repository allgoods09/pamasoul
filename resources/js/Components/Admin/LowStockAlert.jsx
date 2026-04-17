import React from "react";
import { Link } from "@inertiajs/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function LowStockAlert({ products }) {
    const criticalStock = products.filter((p) => p.stock <= 2);
    const warningStock = products.filter((p) => p.stock > 2 && p.stock <= 5);

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">
                        Low Stock Alert
                    </h2>
                    <Link
                        href="/admin/products?stock_status=low_stock"
                        className="text-sm text-blue-600 hover:text-blue-800"
                    >
                        View all →
                    </Link>
                </div>

                {products.length > 0 ? (
                    <div className="space-y-4">
                        {/* Critical Stock (≤2) */}
                        {criticalStock.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold text-red-600 uppercase mb-2">
                                    Critical (≤2 left)
                                </p>
                                {criticalStock.map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center justify-between bg-red-50 p-3 rounded-lg mb-2"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">
                                                {product.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {product.category?.name}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-bold text-red-600">
                                                {product.stock} left
                                            </span>
                                            <Link
                                                href={`/admin/products/${product.id}/edit`}
                                                className="block text-xs text-blue-600 hover:text-blue-800 mt-1"
                                            >
                                                Restock →
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Warning Stock (3-5) */}
                        {warningStock.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold text-yellow-600 uppercase mb-2">
                                    Warning (≤5 left)
                                </p>
                                {warningStock.map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center justify-between border-b pb-2 mb-2"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {product.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {product.category?.name}
                                            </p>
                                        </div>
                                        <span className="text-sm font-medium text-yellow-600">
                                            {product.stock} left
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <ExclamationTriangleIcon className="h-12 w-12 text-green-500 mx-auto mb-3" />
                        <p className="text-gray-500">
                            All products are well stocked!
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                            No low stock items to display
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
