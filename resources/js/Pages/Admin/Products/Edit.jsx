import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { ArrowLeftIcon, PhotoIcon } from '@heroicons/react/24/outline';

export default function ProductsEdit({ product, categories }) {
    const [form, setForm] = useState({
        name: product.name,
        description: product.description || '',
        price: product.price,
        stock: product.stock,
        category_id: product.category_id,
        image: product.image || '',
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState(product.image || '');

    useEffect(() => {
        setImagePreview(form.image);
    }, [form.image]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        router.put(`/admin/products/${product.id}`, form, {
            onSuccess: () => {
                setSubmitting(false);
            },
            onError: (errors) => {
                setErrors(errors);
                setSubmitting(false);
            },
        });
    };

    return (
        <AdminLayout>
            <Head title={`Edit ${product.name}`} />

            <div className="space-y-6">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/admin/products"
                            className="inline-flex items-center text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeftIcon className="h-5 w-5 mr-1" />
                            Back
                        </Link>
                        <h1 className="text-2xl font-semibold text-gray-900">Edit Product</h1>
                    </div>
                </div>

                <div className="rounded-lg bg-white shadow">
                    <form onSubmit={handleSubmit} className="space-y-6 p-6">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Left Column */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                        required
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Category *
                                    </label>
                                    <select
                                        name="category_id"
                                        value={form.category_id}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Price (₱) *
                                        </label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={form.price}
                                            onChange={handleChange}
                                            step="0.01"
                                            min="0"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Stock *
                                        </label>
                                        <input
                                            type="number"
                                            name="stock"
                                            value={form.stock}
                                            onChange={handleChange}
                                            min="0"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Image URL
                                    </label>
                                    <input
                                        type="url"
                                        name="image"
                                        value={form.image}
                                        onChange={handleChange}
                                        placeholder="https://example.com/image.jpg"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pamasoul-500 focus:ring-pamasoul-500 sm:text-sm"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Enter a valid image URL. Leave empty for default placeholder.
                                    </p>
                                </div>
                            </div>

                            {/* Right Column - Image Preview */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Image Preview
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                    {imagePreview ? (
                                        <img 
                                            src={imagePreview} 
                                            alt="Preview"
                                            className="mx-auto h-48 w-full object-cover rounded"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
                                            }}
                                        />
                                    ) : (
                                        <div className="py-12">
                                            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="mt-2 text-sm text-gray-500">No image URL provided</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows="6"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                placeholder="Enter product description..."
                            />
                        </div>

                        <div className="flex justify-end space-x-3 border-t pt-6">
                            <Link
                                href="/admin/products"
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="rounded-md bg-pamasoul-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-pamasoul-700 disabled:opacity-50"
                            >
                                {submitting ? 'Updating...' : 'Update Product'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}