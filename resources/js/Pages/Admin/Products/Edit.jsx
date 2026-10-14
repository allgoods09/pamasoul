import AdminLayout from "@/Layouts/AdminLayout";
import ProductForm from "@/Components/Admin/ProductForm";
import { Head, Link } from "@inertiajs/react";
export default function Edit({ product, categories }) {
    return (
        <AdminLayout>
            <Head title={`Edit ${product.name}`} />
            <Link href="/admin/products" className="text-sm text-pamasoul-700">
                ← Back to products
            </Link>
            <h1 className="text-2xl font-semibold my-6">Edit product</h1>
            <ProductForm product={product} categories={categories} />
        </AdminLayout>
    );
}
