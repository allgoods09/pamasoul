import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeftIcon, PhotoIcon } from '@heroicons/react/24/outline';

export default function ProductsCreate({ categories }) {
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category_id: '',
        image: '',
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        
        // Show image preview if it's the image field
        if (name === 'image') {
            setImagePreview(value);
        }
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        router.post('/admin/products', form, {
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
            <Head title="Create Product" />

            <div className="space-y-6">
                {/* Header */}
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/admin/products"
                            className="inline-flex items-center text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeftIcon className="h-5 w-5 mr-1" />
                            Back
                        </Link>
                        <h1 className="text-2xl font-semibold text-gray-900">Create New Product</h1>
                    </div>
                </div>

                {/* Form */}
                <div className="rounded-lg bg-white shadow">
                    <form onSubmit={handleSubmit} className="space-y-6 p-6">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Left Column */}
                            <div className="space-y-6">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                                            errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                                        }`}
                                        required
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Category *
                                    </label>
                                    <select
                                        name="category_id"
                                        value={form.category_id}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category_id && <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>}
                                </div>

                                {/* Price and Stock */}
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
                                        {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
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
                                        {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
                                    </div>
                                </div>

                                {/* Image URL */}
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
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Enter a valid image URL (optional). Leave empty for default placeholder.
                                    </p>
                                    {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
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
                                            <p className="mt-2 text-sm text-gray-500">Image preview will appear here</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows="6"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                placeholder="Enter product description..."
                            />
                            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                        </div>

                        {/* Submit Buttons */}
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
                                className="rounded-md bg-pamasoul-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-pamasoul-800 disabled:opacity-50"
                            >
                                {submitting ? 'Creating...' : 'Create Product'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}