import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
export default function Categories({ categories }) {
    return (
        <AdminLayout>
            <Head title="Collections" />
            <h1 className="text-2xl font-semibold">Collections</h1>
            <p className="text-sm text-gray-500 mt-2 mb-7">
                PamaSoul has three fixed collections: Rods, Reels and Lines.
                Manage availability from individual products.
            </p>
            <div className="grid sm:grid-cols-3 gap-5">
                {categories.data.map((category) => (
                    <article key={category.id} className="commerce-panel p-6">
                        <h2 className="text-lg font-semibold text-pamasoul-dark">
                            {category.name}
                        </h2>
                        <p className="text-sm text-gray-500 mt-3">
                            {category.products_count} product records
                        </p>
                        <Link
                            href={`/admin/products?category=${category.id}`}
                            className="inline-block text-sm text-pamasoul-700 font-medium mt-6"
                        >
                            Manage products →
                        </Link>
                    </article>
                ))}
            </div>
        </AdminLayout>
    );
}
