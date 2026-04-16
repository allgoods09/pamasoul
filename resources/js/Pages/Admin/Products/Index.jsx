import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { MagnifyingGlassIcon, PlusIcon, TrashIcon, PencilIcon, EyeIcon } from '@heroicons/react/24/outline';
import { getProductImageUrl } from '@/helpers/imageHelper';


export default function ProductsIndex({ products, categories, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [stockStatus, setStockStatus] = useState(filters.stock_status || '');
    const [selectedProducts, setSelectedProducts] = useState([]);

    // Helper function to get product image URL
    const getImageUrl = (product) => {
        if (product.image && product.image !== '') {
            return product.image;
        }
        const imageId = 100 + (product.id % 100);
        return `https://picsum.photos/id/${imageId}/100/100`;
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/products', {
            search,
            category: selectedCategory,
            stock_status: stockStatus,
        });
    };

    const handleFilterChange = (key, value) => {
        router.get('/admin/products', {
            ...filters,
            [key]: value,
        });
    };

    const handleSort = (field) => {
        const direction = filters.sort === field && filters.direction === 'asc' ? 'desc' : 'asc';
        router.get('/admin/products', {
            ...filters,
            sort: field,
            direction,
        });
    };

    const handleBulkDelete = () => {
        if (confirm(`Delete ${selectedProducts.length} products?`)) {
            router.post('/admin/products/bulk-delete', { ids: selectedProducts });
            setSelectedProducts([]);
        }
    };

    const stockStatusColors = {
        'In Stock': 'text-green-600',
        'Low Stock': 'text-yellow-600',
        'Out of Stock': 'text-red-600',
    };

    return (
        <AdminLayout>
            <Head title="Products" />

            <div className="space-y-6">
                {/* Header */}
                <div className="sm:flex sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
                    <Link
                        href="/admin/products/create"
                        className="inline-flex items-center rounded-md bg-pamasoul-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pamasoul-500"
                    >
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Add Product
                    </Link>
                </div>

                {/* Filters */}
                <div className="rounded-lg bg-white p-4 shadow">
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Search</label>
                                <div className="mt-1 relative">
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="block w-full rounded-md border-gray-300 pr-10 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        placeholder="Product name..."
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Stock Status</label>
                                <select
                                    value={stockStatus}
                                    onChange={(e) => handleFilterChange('stock_status', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                >
                                    <option value="">All</option>
                                    <option value="in_stock">In Stock (&gt;5)</option>
                                    <option value="low_stock">Low Stock (1-5)</option>
                                    <option value="out_of_stock">Out of Stock (0)</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                {selectedProducts.length > 0 && (
                                    <button
                                        onClick={handleBulkDelete}
                                        className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                                    >
                                        <TrashIcon className="mr-2 h-4 w-4" />
                                        Delete Selected ({selectedProducts.length})
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>

                {/* Products Table */}
                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedProducts(products.data.map(p => p.id));
                                                } else {
                                                    setSelectedProducts([]);
                                                }
                                            }}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700" onClick={() => handleSort('name')}>
                                        Name {filters.sort === 'name' && (filters.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700" onClick={() => handleSort('price')}>
                                        Price {filters.sort === 'price' && (filters.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700" onClick={() => handleSort('stock')}>
                                        Stock {filters.sort === 'stock' && (filters.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {products.data.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedProducts.includes(product.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedProducts([...selectedProducts, product.id]);
                                                    } else {
                                                        setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                                                    }
                                                }}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="px-4 py-4">
                                            <img 
                                                src={getProductImageUrl(product)}
                                                alt={product.name}
                                                className="h-12 w-12 object-cover rounded"
                                                onError={(e) => {
                                                    e.target.src = '';
                                                }}
                                            />
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-900">{product.name}</td>
                                        <td className="px-4 py-4 text-sm text-gray-500">{product.category?.name}</td>
                                        <td className="px-4 py-4 text-sm text-gray-900">₱{Number(product.price).toLocaleString()}</td>
                                        <td className="px-4 py-4 text-sm text-gray-900">{product.stock}</td>
                                        <td className="px-4 py-4">
                                            <span className={`text-sm font-medium ${stockStatusColors[product.stock_status]}`}>
                                                {product.stock_status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-right text-sm space-x-2">
                                            <Link
                                                href={`/admin/products/${product.id}/edit`}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                <PencilIcon className="h-4 w-4 inline" />
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    if (confirm('Delete this product?')) {
                                                        router.delete(`/admin/products/${product.id}`);
                                                    }
                                                }}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <TrashIcon className="h-4 w-4 inline" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="border-t border-gray-200 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                Showing {products.from || 0} to {products.to || 0} of {products.total} results
                            </div>
                            <div className="flex space-x-2">
                                {products.links?.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-3 py-1 rounded ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        } ${!link.url && 'opacity-50 cursor-default'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}