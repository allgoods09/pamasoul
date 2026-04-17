import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { 
    MagnifyingGlassIcon, 
    PlusIcon, 
    TrashIcon, 
    PencilIcon, 
    EyeIcon,
    ChevronUpDownIcon,
    ArrowPathIcon,
    DocumentArrowDownIcon,
    ArchiveBoxIcon,
    TagIcon,
    CurrencyDollarIcon,
    CubeIcon,
    ExclamationTriangleIcon,
    XMarkIcon,
    CheckIcon
} from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';
import { getProductImageUrl } from '@/helpers/imageHelper';

export default function ProductsIndex({ products, categories, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [stockStatus, setStockStatus] = useState(filters.stock_status || '');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [showBulkStockModal, setShowBulkStockModal] = useState(false);
    const [bulkStockValue, setBulkStockValue] = useState('');
    const [isSelectAll, setIsSelectAll] = useState(false);

    // Handle select all checkbox
    useEffect(() => {
        setIsSelectAll(selectedProducts.length === products.data.length && products.data.length > 0);
    }, [selectedProducts, products.data]);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/products', {
            search,
            category: selectedCategory,
            stock_status: stockStatus,
            sort: filters.sort,
            direction: filters.direction,
        });
    };

    const handleFilterChange = (key, value) => {
        router.get('/admin/products', {
            ...filters,
            [key]: value,
            page: 1, // Reset to first page on filter change
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

    const handleResetFilters = () => {
        setSearch('');
        setSelectedCategory('');
        setStockStatus('');
        router.get('/admin/products');
    };

    const handleBulkDelete = () => {
        if (selectedProducts.length === 0) {
            toast.error('Please select products to delete');
            return;
        }
        
        if (confirm(`Delete ${selectedProducts.length} product(s)? This action cannot be undone.`)) {
            router.post('/admin/products/bulk-delete', { ids: selectedProducts }, {
                onSuccess: () => {
                    toast.success(`${selectedProducts.length} product(s) deleted successfully`);
                    setSelectedProducts([]);
                },
                onError: () => {
                    toast.error('Failed to delete products');
                }
            });
        }
    };

    const handleBulkStockUpdate = () => {
        if (selectedProducts.length === 0) {
            toast.error('Please select products to update');
            return;
        }
        setShowBulkStockModal(true);
    };

    const submitBulkStockUpdate = () => {
        const stockValue = parseInt(bulkStockValue);
        if (isNaN(stockValue) || stockValue < 0) {
            toast.error('Please enter a valid stock quantity');
            return;
        }

        const productsData = selectedProducts.map(id => ({ id, stock: stockValue }));
        
        router.post('/admin/products/bulk-update-stock', { products: productsData }, {
            onSuccess: () => {
                toast.success(`${selectedProducts.length} product(s) stock updated to ${stockValue}`);
                setShowBulkStockModal(false);
                setBulkStockValue('');
                setSelectedProducts([]);
            },
            onError: () => {
                toast.error('Failed to update stock');
            }
        });
    };

    const handleExport = () => {
        router.get('/admin/products/export', {}, {
            onSuccess: () => {
                toast.success('Products exported successfully');
            }
        });
    };

    const handleToggleSelectAll = () => {
        if (isSelectAll) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(products.data.map(p => p.id));
        }
    };

    const handleSelectProduct = (productId) => {
        if (selectedProducts.includes(productId)) {
            setSelectedProducts(selectedProducts.filter(id => id !== productId));
        } else {
            setSelectedProducts([...selectedProducts, productId]);
        }
    };

    const getStockBadge = (product) => {
        if (product.stock === 0) {
            return { text: 'Out of Stock', color: 'bg-red-100 text-red-800', icon: ExclamationTriangleIcon };
        }
        if (product.stock <= 5) {
            return { text: 'Low Stock', color: 'bg-yellow-100 text-yellow-800', icon: ExclamationTriangleIcon };
        }
        return { text: 'In Stock', color: 'bg-green-100 text-green-800', icon: CheckIcon };
    };

    const hasActiveFilters = search || selectedCategory || stockStatus;

    return (
        <AdminLayout>
            <Head title="Products" />
            <Toaster position="top-right" />

            <div className="space-y-6">
                {/* Header */}
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage your product catalog, inventory, and pricing
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex space-x-3">
                        {/* <button
                            onClick={handleExport}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                            <DocumentArrowDownIcon className="mr-2 h-4 w-4" />
                            Export CSV
                        </button> */}
                        <Link
                            href="/admin/products/create"
                            className="inline-flex items-center rounded-md bg-pamasoul-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pamasoul-500"
                        >
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Add Product
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg bg-white p-4 shadow">
                        <div className="flex items-center">
                            <div className="rounded-full bg-blue-100 p-3">
                                <TagIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">Total Products</p>
                                <p className="text-2xl font-semibold text-gray-900">{products.total}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg bg-white p-4 shadow">
                        <div className="flex items-center">
                            <div className="rounded-full bg-green-100 p-3">
                                <CheckIcon className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">In Stock</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {products.data.filter(p => p.stock > 5).length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg bg-white p-4 shadow">
                        <div className="flex items-center">
                            <div className="rounded-full bg-yellow-100 p-3">
                                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">Low Stock</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {products.data.filter(p => p.stock > 0 && p.stock <= 5).length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg bg-white p-4 shadow">
                        <div className="flex items-center">
                            <div className="rounded-full bg-red-100 p-3">
                                <ArchiveBoxIcon className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">Out of Stock</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {products.data.filter(p => p.stock === 0).length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bulk Actions Bar */}
                {selectedProducts.length > 0 && (
                    <div className="rounded-lg bg-pamasoul-50 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <span className="text-sm font-medium text-pamasoul-800">
                                    {selectedProducts.length} product(s) selected
                                </span>
                                <button
                                    onClick={handleBulkStockUpdate}
                                    className="inline-flex items-center rounded-md bg-white px-3 py-1.5 text-sm font-medium text-pamasoul-700 shadow-sm hover:bg-pamasoul-50 border border-pamasoul-300"
                                >
                                    <ArrowPathIcon className="mr-1.5 h-4 w-4" />
                                    Update Stock
                                </button>
                                <button
                                    onClick={handleBulkDelete}
                                    className="inline-flex items-center rounded-md bg-white px-3 py-1.5 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50 border border-red-300"
                                >
                                    <TrashIcon className="mr-1.5 h-4 w-4" />
                                    Delete
                                </button>
                            </div>
                            <button
                                onClick={() => setSelectedProducts([])}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                )}

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
                                        className="block w-full rounded-md border-gray-300 pr-10 shadow-sm focus:border-pamasoul-500 focus:ring-pamasoul-500 sm:text-sm"
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
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pamasoul-500 focus:ring-pamasoul-500 sm:text-sm"
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
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pamasoul-500 focus:ring-pamasoul-500 sm:text-sm"
                                >
                                    <option value="">All</option>
                                    <option value="in_stock">In Stock (&gt;5)</option>
                                    <option value="low_stock">Low Stock (1-5)</option>
                                    <option value="out_of_stock">Out of Stock (0)</option>
                                </select>
                            </div>
                            <div className="flex items-end space-x-2">
                                {hasActiveFilters && (
                                    <button
                                        type="button"
                                        onClick={handleResetFilters}
                                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                                    >
                                        <XMarkIcon className="mr-1.5 h-4 w-4" />
                                        Reset
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className="inline-flex items-center rounded-md bg-pamasoul-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-pamasoul-500"
                                >
                                    <MagnifyingGlassIcon className="mr-1.5 h-4 w-4" />
                                    Search
                                </button>
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
                                            checked={isSelectAll}
                                            onChange={handleToggleSelectAll}
                                            className="rounded border-gray-300 text-pamasoul-600 focus:ring-pamasoul-500"
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group" onClick={() => handleSort('name')}>
                                        <div className="flex items-center space-x-1">
                                            <span>Name</span>
                                            <ChevronUpDownIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                                        </div>
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group" onClick={() => handleSort('price')}>
                                        <div className="flex items-center space-x-1">
                                            <span>Price</span>
                                            <ChevronUpDownIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                                        </div>
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group" onClick={() => handleSort('stock')}>
                                        <div className="flex items-center space-x-1">
                                            <span>Stock</span>
                                            <ChevronUpDownIcon className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                                        </div>
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {products.data.map((product) => {
                                    const stockBadge = getStockBadge(product);
                                    const StockIcon = stockBadge.icon;
                                    return (
                                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedProducts.includes(product.id)}
                                                    onChange={() => handleSelectProduct(product.id)}
                                                    className="rounded border-gray-300 text-pamasoul-600 focus:ring-pamasoul-500"
                                                />
                                            </td>
                                            <td className="px-4 py-4">
                                                <img 
                                                    src={getProductImageUrl(product)}
                                                    alt={product.name}
                                                    className="h-12 w-12 object-cover rounded-lg bg-gray-100"
                                                    onError={(e) => {
                                                        e.target.src = 'https://placehold.co/100x100?text=No+Image';
                                                    }}
                                                />
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                <div className="text-xs text-gray-500">ID: #{product.id}</div>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-600">{product.category?.name || 'Uncategorized'}</td>
                                            <td className="px-4 py-4 text-sm font-semibold text-gray-900">₱{Number(product.price).toLocaleString()}</td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm font-medium text-gray-900">{product.stock}</span>
                                                    {product.stock <= 5 && product.stock > 0 && (
                                                        <span className="text-xs text-yellow-600 animate-pulse">⚠️</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${stockBadge.color}`}>
                                                    <StockIcon className="mr-1 h-3 w-3" />
                                                    {stockBadge.text}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-right text-sm space-x-2">
                                                <Link
                                                    href={`/admin/products/${product.id}/edit`}
                                                    className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                                                    title="Edit"
                                                >
                                                    <PencilIcon className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        if (confirm(`Delete "${product.name}"? This action cannot be undone.`)) {
                                                            router.delete(`/admin/products/${product.id}`, {
                                                                onSuccess: () => toast.success('Product deleted successfully')
                                                            });
                                                        }
                                                    }}
                                                    className="text-red-600 hover:text-red-900 inline-flex items-center"
                                                    title="Delete"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                                <Link
                                                    href={`/product/${product.id}`}
                                                    target="_blank"
                                                    className="text-gray-400 hover:text-gray-600 inline-flex items-center"
                                                    title="View on store"
                                                >
                                                    <EyeIcon className="h-4 w-4" />
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {products.links && products.links.length > 0 && (
                        <div className="border-t border-gray-200 px-6 py-4">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="text-sm text-gray-500">
                                    Showing {products.from || 0} to {products.to || 0} of {products.total} results
                                </div>
                                <div className="flex space-x-1">
                                    {products.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                                link.active
                                                    ? 'bg-pamasoul-600 text-white'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            } ${!link.url && 'opacity-50 cursor-default'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bulk Stock Update Modal */}
            {showBulkStockModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowBulkStockModal(false)} />
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-pamasoul-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <ArrowPathIcon className="h-6 w-6 text-pamasoul-600" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Update Stock Quantity</h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Set new stock quantity for {selectedProducts.length} selected product(s).
                                            </p>
                                            <div className="mt-4">
                                                <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                                                <input
                                                    type="number"
                                                    value={bulkStockValue}
                                                    onChange={(e) => setBulkStockValue(e.target.value)}
                                                    min="0"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pamasoul-500 focus:ring-pamasoul-500 sm:text-sm"
                                                    placeholder="Enter stock quantity"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    onClick={submitBulkStockUpdate}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pamasoul-600 text-base font-medium text-white hover:bg-pamasoul-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pamasoul-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Update Stock
                                </button>
                                <button
                                    onClick={() => setShowBulkStockModal(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pamasoul-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}