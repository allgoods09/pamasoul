import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { 
    PlusIcon, 
    PencilIcon, 
    TrashIcon, 
    MagnifyingGlassIcon,
    XMarkIcon,
    FolderIcon,
    TagIcon,
    ClockIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';

export default function CategoriesIndex({ categories, filters }) {
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [form, setForm] = useState({ name: '' });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [search, setSearch] = useState(filters.search || '');

    // Calculate stats
    const totalCategories = categories.total || 0;
    const totalProducts = categories.data.reduce((sum, cat) => sum + (cat.products_count || 0), 0);
    const categoriesWithProducts = categories.data.filter(cat => (cat.products_count || 0) > 0).length;
    const emptyCategories = categories.data.filter(cat => (cat.products_count || 0) === 0).length;

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/categories', { search });
    };

    const handleResetSearch = () => {
        setSearch('');
        router.get('/admin/categories');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        if (editingCategory) {
            router.put(`/admin/categories/${editingCategory.id}`, form, {
                onSuccess: () => {
                    toast.success('Category updated successfully!');
                    setShowModal(false);
                    setEditingCategory(null);
                    setForm({ name: '' });
                    setSubmitting(false);
                    setErrors({});
                },
                onError: (errors) => {
                    setErrors(errors);
                    setSubmitting(false);
                    toast.error('Failed to update category');
                },
            });
        } else {
            router.post('/admin/categories', form, {
                onSuccess: () => {
                    toast.success('Category created successfully!');
                    setShowModal(false);
                    setForm({ name: '' });
                    setSubmitting(false);
                    setErrors({});
                },
                onError: (errors) => {
                    setErrors(errors);
                    setSubmitting(false);
                    toast.error('Failed to create category');
                },
            });
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setForm({ name: category.name });
        setShowModal(true);
    };

    const handleDelete = (category) => {
        const productCount = category.products_count || 0;
        const warningMessage = productCount > 0
            ? `Category "${category.name}" has ${productCount} product(s). Deleting it will also delete all associated products. This action cannot be undone.`
            : `Delete category "${category.name}"? This action cannot be undone.`;

        if (confirm(warningMessage)) {
            router.delete(`/admin/categories/${category.id}`, {
                onSuccess: () => {
                    toast.success('Category deleted successfully');
                },
                onError: (error) => {
                    toast.error(error.message || 'Failed to delete category');
                }
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Categories" />
            <Toaster position="top-right" />

            <div className="space-y-6">
                {/* Header */}
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage your product categories and organization
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingCategory(null);
                            setForm({ name: '' });
                            setErrors({});
                            setShowModal(true);
                        }}
                        className="mt-4 sm:mt-0 inline-flex items-center rounded-md bg-pamasoul-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pamasoul-500"
                    >
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Add Category
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg bg-white p-4 shadow">
                        <div className="flex items-center">
                            <div className="rounded-full bg-blue-100 p-3">
                                <FolderIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">Total Categories</p>
                                <p className="text-2xl font-semibold text-gray-900">{totalCategories}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg bg-white p-4 shadow">
                        <div className="flex items-center">
                            <div className="rounded-full bg-green-100 p-3">
                                <TagIcon className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">Total Products</p>
                                <p className="text-2xl font-semibold text-gray-900">{totalProducts}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg bg-white p-4 shadow">
                        <div className="flex items-center">
                            <div className="rounded-full bg-yellow-100 p-3">
                                <ClockIcon className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">Categories with Products</p>
                                <p className="text-2xl font-semibold text-gray-900">{categoriesWithProducts}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg bg-white p-4 shadow">
                        <div className="flex items-center">
                            <div className="rounded-full bg-gray-100 p-3">
                                <ExclamationTriangleIcon className="h-6 w-6 text-gray-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">Empty Categories</p>
                                <p className="text-2xl font-semibold text-gray-900">{emptyCategories}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="rounded-lg bg-white p-4 shadow">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search categories by name..."
                                className="block w-full rounded-md border-gray-300 pr-10 shadow-sm focus:border-pamasoul-500 focus:ring-pamasoul-500 sm:text-sm"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="rounded-md bg-pamasoul-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pamasoul-500"
                        >
                            Search
                        </button>
                        {search && (
                            <button
                                type="button"
                                onClick={handleResetSearch}
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                            >
                                <XMarkIcon className="h-4 w-4" />
                            </button>
                        )}
                    </form>
                </div>

                {/* Categories Table */}
                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Products
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {categories.data.map((category) => (
                                    <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            #{category.id}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-pamasoul-100 flex items-center justify-center">
                                                    <TagIcon className="h-4 w-4 text-pamasoul-600" />
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {category.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                category.products_count > 0 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-gray-100 text-gray-500'
                                            }`}>
                                                {category.products_count || 0} products
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(category.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm space-x-3">
                                            <button
                                                onClick={() => handleEdit(category)}
                                                className="text-blue-600 hover:text-blue-900 transition-colors"
                                                title="Edit category"
                                            >
                                                <PencilIcon className="h-4 w-4 inline" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category)}
                                                className="text-red-600 hover:text-red-900 transition-colors"
                                                title="Delete category"
                                            >
                                                <TrashIcon className="h-4 w-4 inline" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {categories.data.length === 0 && (
                        <div className="text-center py-12">
                            <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No categories</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {search ? 'No categories match your search.' : 'Get started by creating a new category.'}
                            </p>
                            {!search && (
                                <div className="mt-6">
                                    <button
                                        onClick={() => {
                                            setEditingCategory(null);
                                            setForm({ name: '' });
                                            setShowModal(true);
                                        }}
                                        className="inline-flex items-center rounded-md bg-pamasoul-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pamasoul-500"
                                    >
                                        <PlusIcon className="mr-2 h-4 w-4" />
                                        Add Category
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    {categories.links && categories.links.length > 0 && categories.data.length > 0 && (
                        <div className="border-t border-gray-200 px-6 py-4">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="text-sm text-gray-500">
                                    Showing {categories.from || 0} to {categories.to || 0} of {categories.total} results
                                </div>
                                <div className="flex space-x-1">
                                    {categories.links.map((link, index) => (
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

            {/* Modal for Create/Edit */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center p-4">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)} />
                        
                        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all">
                            <div className="px-6 pt-6 pb-4">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    {editingCategory ? 'Edit Category' : 'Create New Category'}
                                </h2>
                                
                                <form onSubmit={handleSubmit}>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Category Name
                                        </label>
                                        <input
                                            type="text"
                                            value={form.name}
                                            onChange={(e) => setForm({ name: e.target.value })}
                                            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                                                errors.name 
                                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                                                    : 'border-gray-300 focus:border-pamasoul-500 focus:ring-pamasoul-500'
                                            }`}
                                            placeholder="Enter category name..."
                                            autoFocus
                                            required
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                        )}
                                        <p className="mt-1 text-xs text-gray-500">
                                            Category names should be unique and descriptive.
                                        </p>
                                    </div>
                                    
                                    <div className="mt-6 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pamasoul-500"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="rounded-md bg-pamasoul-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-pamasoul-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pamasoul-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {submitting ? 'Saving...' : (editingCategory ? 'Update Category' : 'Create Category')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}