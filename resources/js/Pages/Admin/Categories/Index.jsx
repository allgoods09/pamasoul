import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function CategoriesIndex({ categories, filters }) {
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [form, setForm] = useState({ name: '' });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/categories', { search });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        if (editingCategory) {
            router.put(`/admin/categories/${editingCategory.id}`, form, {
                onSuccess: () => {
                    setShowModal(false);
                    setEditingCategory(null);
                    setForm({ name: '' });
                    setSubmitting(false);
                },
                onError: (errors) => {
                    setErrors(errors);
                    setSubmitting(false);
                },
            });
        } else {
            router.post('/admin/categories', form, {
                onSuccess: () => {
                    setShowModal(false);
                    setForm({ name: '' });
                    setSubmitting(false);
                },
                onError: (errors) => {
                    setErrors(errors);
                    setSubmitting(false);
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
        if (confirm(`Delete category "${category.name}"? This will also delete all products in this category.`)) {
            router.delete(`/admin/categories/${category.id}`);
        }
    };

    return (
        <AdminLayout>
            <Head title="Categories" />

            <div className="space-y-6">
                {/* Header */}
                <div className="sm:flex sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
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

                {/* Search */}
                <div className="rounded-lg bg-white p-4 shadow">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search categories..."
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            className="rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Categories Table */}
                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products Count</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {categories.data.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">#{category.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{category.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{category.products_count}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(category.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm space-x-2">
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            <PencilIcon className="h-4 w-4 inline" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <TrashIcon className="h-4 w-4 inline" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="border-t border-gray-200 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                Showing {categories.from || 0} to {categories.to || 0} of {categories.total} results
                            </div>
                            <div className="flex space-x-2">
                                {categories.links?.map((link, index) => (
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

            {/* Modal for Create/Edit */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center p-4">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowModal(false)} />
                        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                            <h2 className="text-xl font-semibold mb-4">
                                {editingCategory ? 'Edit Category' : 'Create Category'}
                            </h2>
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Category Name</label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm({ name: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        required
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>
                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="rounded-md bg-pamasoul-600 px-4 py-2 text-sm font-medium text-white hover:bg-pamasoul-800 disabled:opacity-50"
                                    >
                                        {submitting ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}