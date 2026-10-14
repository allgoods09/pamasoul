import AdminLayout from "@/Layouts/AdminLayout";
import ProductForm from "@/Components/Admin/ProductForm";
import { Head, Link } from "@inertiajs/react";
export default function Create({ categories }) {
    return (
        <AdminLayout>
            <Head title="Add product" />
            <Link href="/admin/products" className="text-sm text-pamasoul-700">
                ← Back to products
            </Link>
            <h1 className="text-2xl font-semibold my-6">Add product</h1>
            <ProductForm categories={categories} />
        </AdminLayout>
    );
}
