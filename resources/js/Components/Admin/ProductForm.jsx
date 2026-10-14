import { Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import ProductImage from "@/Components/ProductImage";
export default function ProductForm({ product, categories }) {
    const [specText, setSpecText] = useState(
        Object.entries(product?.specifications || {})
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n"),
    );
    const [specError, setSpecError] = useState("");
    const { data, setData, post, put, processing, errors, transform } = useForm(
        {
            name: product?.name || "",
            description: product?.description || "",
            price: product?.price || "",
            stock: product?.stock ?? 0,
            category_id: product?.category_id || "",
            image: product?.image || "",
            is_active: product?.is_active ?? true,
            specifications: product?.specifications || {},
        },
    );
    const submit = (e) => {
        e.preventDefault();
        const specifications = {};
        for (const line of specText.split("\n").filter((line) => line.trim())) {
            const split = line.indexOf(":");
            const key = line.slice(0, split).trim(),
                value = line.slice(split + 1).trim();
            if (
                split < 1 ||
                !key ||
                !value ||
                key.length > 80 ||
                key in specifications ||
                Object.keys(specifications).length >= 20
            ) {
                setSpecError(
                    "Use up to 20 unique “Label: Value” lines. Labels must be 80 characters or fewer.",
                );
                return;
            }
            specifications[key] = value;
        }
        setSpecError("");
        transform((values) => ({ ...values, specifications }));
        if (product) put(`/admin/products/${product.id}`);
        else post("/admin/products");
    };
    const inputClass =
        "mt-2 w-full rounded-xl border-gray-300 text-sm focus:ring-pamasoul-500 focus:border-pamasoul-500";
    const error = (key) =>
        errors[key] && (
            <p role="alert" className="form-error">
                {errors[key]}
            </p>
        );
    return (
        <form onSubmit={submit} className="commerce-panel p-5 sm:p-8">
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-5">
                    <div>
                        <label
                            htmlFor="product-name"
                            className="text-sm font-medium"
                        >
                            Product name *
                        </label>
                        <input
                            id="product-name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                            maxLength={150}
                            className={inputClass}
                        />
                        {error("name")}
                    </div>
                    <div>
                        <label
                            htmlFor="product-category"
                            className="text-sm font-medium"
                        >
                            Collection *
                        </label>
                        <select
                            id="product-category"
                            value={data.category_id}
                            onChange={(e) =>
                                setData("category_id", e.target.value)
                            }
                            required
                            className={inputClass}
                        >
                            <option value="">Choose a collection</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                        {error("category_id")}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            ["price", "Price (₱)", "0.01", "0.01", "999999.99"],
                            ["stock", "Available stock", "0", "1", "999999"],
                        ].map(([key, label, min, step, max]) => (
                            <div key={key}>
                                <label
                                    htmlFor={`product-${key}`}
                                    className="text-sm font-medium"
                                >
                                    {label} *
                                </label>
                                <input
                                    id={`product-${key}`}
                                    type="number"
                                    min={min}
                                    max={max}
                                    step={step}
                                    required
                                    value={data[key]}
                                    onChange={(e) =>
                                        setData(key, e.target.value)
                                    }
                                    className={inputClass}
                                />
                                {error(key)}
                            </div>
                        ))}
                    </div>
                    <div>
                        <label
                            htmlFor="product-description"
                            className="text-sm font-medium"
                        >
                            Description
                        </label>
                        <textarea
                            id="product-description"
                            rows={5}
                            maxLength={10000}
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            className={inputClass}
                        />
                        {error("description")}
                    </div>
                    <label className="flex gap-3 items-center text-sm">
                        <input
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(e) =>
                                setData("is_active", e.target.checked)
                            }
                            className="rounded text-pamasoul-600 focus:ring-pamasoul-500"
                        />
                        Available in storefront
                    </label>
                    <p className="text-xs text-gray-500">
                        Archiving hides the product from browsing and preserves
                        stock and past orders.
                    </p>
                </div>
                <div className="space-y-5">
                    <div>
                        <label
                            htmlFor="product-image"
                            className="text-sm font-medium"
                        >
                            Image URL or local /images/ path
                        </label>
                        <input
                            id="product-image"
                            value={data.image}
                            onChange={(e) => setData("image", e.target.value)}
                            maxLength={255}
                            className={inputClass}
                            placeholder="https://…"
                        />
                        {error("image")}
                    </div>
                    <div className="rounded-2xl bg-pamasoul-50 border border-pamasoul-100 h-52 p-5">
                        <ProductImage
                            key={data.image}
                            product={{
                                name: data.name || "Image preview",
                                image: data.image,
                            }}
                            className="w-full h-full object-contain mix-blend-multiply"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="product-specifications"
                            className="text-sm font-medium"
                        >
                            Fishing specifications
                        </label>
                        <textarea
                            id="product-specifications"
                            rows={6}
                            value={specText}
                            onChange={(e) => setSpecText(e.target.value)}
                            placeholder={
                                "Length: 7 ft\nPower: Medium Heavy\nLine rating: 10–20 lb"
                            }
                            className={inputClass}
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            One Label: Value per line. Use verified product
                            data: length, action, gear ratio, drag, line rating
                            or spool length.
                        </p>
                        {specError && (
                            <p role="alert" className="form-error">
                                {specError}
                            </p>
                        )}
                        {Object.entries(errors)
                            .filter(([key]) => key.startsWith("specifications"))
                            .map(([key, value]) => (
                                <p
                                    key={key}
                                    role="alert"
                                    className="form-error"
                                >
                                    {value}
                                </p>
                            ))}
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap gap-3 border-t border-gray-100 mt-8 pt-6">
                <button disabled={processing} className="button-primary">
                    {processing
                        ? "Saving…"
                        : product
                          ? "Save changes"
                          : "Create product"}
                </button>
                <Link href="/admin/products" className="button-secondary">
                    Cancel
                </Link>
            </div>
        </form>
    );
}
