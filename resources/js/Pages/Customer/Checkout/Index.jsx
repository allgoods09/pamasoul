import CustomerLayout from "@/Layouts/CustomerLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { useRef } from "react";
import {
    ArrowLeftIcon,
    MapPinIcon,
    ArrowRightIcon,
    CheckCircleIcon,
} from "@heroicons/react/24/outline";
import ProductImage from "@/Components/ProductImage";
import { formatPeso } from "@/helpers/imageHelper";
const fields = [
    ["recipient", "Recipient name", "name", "text", "Your full name"],
    ["phone", "Mobile number", "tel", "tel", "0917 123 4567"],
    [
        "street",
        "House / unit / street",
        "address-line1",
        "text",
        "House number and street",
    ],
    ["barangay", "Barangay", "address-line2", "text", "Barangay"],
    ["city", "City / municipality", "address-level2", "text", "Tubigon"],
    ["province", "Province", "address-level1", "text", "Bohol"],
    ["postal_code", "ZIP code", "postal-code", "text", "6329"],
];
export default function CheckoutIndex({
    cartItems,
    subtotal,
    shippingFee,
    total,
    checkoutToken,
}) {
    const { auth } = usePage().props;
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        recipient: auth.user.name,
        phone: "",
        street: "",
        barangay: "",
        city: "",
        province: "",
        postal_code: "",
        payment_method: "COD",
        checkout_token: checkoutToken,
    });
    const submitLock = useRef(false);
    const submit = (e) => {
        e.preventDefault();
        if (submitLock.current) return;
        submitLock.current = true;
        post("/checkout", {
            preserveScroll: true,
            onFinish: () => {
                submitLock.current = false;
            },
        });
    };
    return (
        <CustomerLayout>
            <Head title="Checkout" />
            <div className="store-container py-10 sm:py-14">
                <Link
                    href="/cart"
                    className="inline-flex items-center gap-2 text-sm text-pamasoul-700 mb-6"
                >
                    <ArrowLeftIcon className="h-4 w-4" />
                    Back to cart
                </Link>
                <h1 className="text-3xl sm:text-4xl font-bold text-pamasoul-dark tracking-tight">
                    A little closer to the water.
                </h1>
                <p className="text-sm text-gray-500 mt-3 mb-8">
                    Review your gear and tell us where it’s going.
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-8">
                    <CheckCircleIcon className="w-5 h-5 text-pamasoul-600" />
                    Cart
                    <span className="w-8 h-px bg-pamasoul-200" />
                    <span className="font-semibold text-pamasoul-700">
                        02 · Checkout
                    </span>
                    <span className="w-8 h-px bg-gray-200" />
                    <span>03 · Confirmation</span>
                </div>
                <form
                    onSubmit={submit}
                    className="grid lg:grid-cols-[1fr_380px] gap-7 items-start"
                >
                    <div className="space-y-6">
                        <section className="commerce-panel p-5 sm:p-7">
                            <h2 className="font-semibold text-lg text-pamasoul-dark flex items-center gap-2 mb-6">
                                <MapPinIcon className="w-5 h-5 text-pamasoul-600" />
                                Shipping information
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-5">
                                {fields.map(
                                    ([
                                        name,
                                        label,
                                        autoComplete,
                                        type,
                                        placeholder,
                                    ]) => (
                                        <div
                                            key={name}
                                            className={
                                                name === "street"
                                                    ? "sm:col-span-2"
                                                    : ""
                                            }
                                        >
                                            <label
                                                htmlFor={name}
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                            >
                                                {label}{" "}
                                                <span className="text-pamasoul-600">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                id={name}
                                                name={name}
                                                type={type}
                                                value={data[name]}
                                                autoComplete={autoComplete}
                                                placeholder={placeholder}
                                                required
                                                maxLength={
                                                    name === "postal_code"
                                                        ? 4
                                                        : name === "phone"
                                                          ? 13
                                                          : name === "street"
                                                            ? 200
                                                            : 100
                                                }
                                                inputMode={
                                                    name === "postal_code"
                                                        ? "numeric"
                                                        : undefined
                                                }
                                                pattern={
                                                    name === "postal_code"
                                                        ? "[0-9]{4}"
                                                        : undefined
                                                }
                                                aria-invalid={!!errors[name]}
                                                aria-describedby={
                                                    errors[name]
                                                        ? `${name}-error`
                                                        : undefined
                                                }
                                                onChange={(e) => {
                                                    setData(
                                                        name,
                                                        e.target.value,
                                                    );
                                                    clearErrors(name);
                                                }}
                                                className={`w-full rounded-xl text-sm focus:ring-pamasoul-500 focus:border-pamasoul-500 ${errors[name] ? "border-red-400" : "border-gray-200"}`}
                                            />
                                            {errors[name] && (
                                                <p
                                                    id={`${name}-error`}
                                                    className="form-error"
                                                    role="alert"
                                                >
                                                    {errors[name]}
                                                </p>
                                            )}
                                        </div>
                                    ),
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mt-5">
                                Philippines only. Use an 11-digit mobile number
                                starting with 09, or +639 followed by 9 digits.
                            </p>
                        </section>
                        <section className="commerce-panel p-5 sm:p-7">
                            <h2 className="font-semibold text-lg text-pamasoul-dark mb-5">
                                Payment method
                            </h2>
                            <fieldset className="space-y-3">
                                <legend className="sr-only">
                                    Choose a simulated payment method
                                </legend>
                                {[
                                    [
                                        "COD",
                                        "Cash on Delivery",
                                        "Simulated COD. No payment is collected by this application.",
                                    ],
                                    [
                                        "BankTransfer",
                                        "Bank Transfer",
                                        "Simulated transfer. Do not send money; payment verification is demonstrated by the administrator.",
                                    ],
                                ].map(([value, label, copy]) => (
                                    <label
                                        key={value}
                                        className={`flex gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${data.payment_method === value ? "border-pamasoul-400 bg-pamasoul-50" : "border-gray-200 hover:bg-gray-50"}`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value={value}
                                            checked={
                                                data.payment_method === value
                                            }
                                            onChange={() =>
                                                setData("payment_method", value)
                                            }
                                            className="text-pamasoul-600 mt-1 focus:ring-pamasoul-500"
                                        />
                                        <span>
                                            <span className="block text-sm font-semibold text-gray-900">
                                                {label}
                                            </span>
                                            <span className="block text-xs leading-5 text-gray-500 mt-1">
                                                {copy}
                                            </span>
                                        </span>
                                    </label>
                                ))}
                            </fieldset>
                            {errors.payment_method && (
                                <p role="alert" className="form-error">
                                    {errors.payment_method}
                                </p>
                            )}
                        </section>
                    </div>
                    <aside className="commerce-panel p-5 sm:p-7 lg:sticky lg:top-28">
                        <h2 className="font-semibold text-lg text-pamasoul-dark mb-6">
                            Your order
                        </h2>
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex gap-3 items-center"
                                >
                                    <div className="w-14 h-14 p-1 bg-pamasoul-50 rounded-lg shrink-0">
                                        <ProductImage
                                            product={item.product}
                                            className="h-full w-full object-contain mix-blend-multiply"
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-semibold leading-5">
                                            {item.product.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Qty {item.quantity}
                                        </p>
                                    </div>
                                    <p className="text-xs font-medium">
                                        {formatPeso(
                                            item.quantity * item.price_snapshot,
                                        )}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="text-sm space-y-4 border-t border-gray-100 mt-6 pt-6">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Subtotal</span>
                                <span>{formatPeso(subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Shipping</span>
                                <span>
                                    {Number(shippingFee) === 0
                                        ? "Free"
                                        : formatPeso(shippingFee)}
                                </span>
                            </div>
                            <div className="flex justify-between font-bold text-lg text-pamasoul-800 border-t border-gray-100 pt-4">
                                <span>Total</span>
                                <span>{formatPeso(total)}</span>
                            </div>
                        </div>
                        {["cart", "checkout_token"].map(
                            (key) =>
                                errors[key] && (
                                    <div
                                        role="alert"
                                        key={key}
                                        className="p-3 bg-red-50 rounded-xl text-xs text-red-700 mt-5"
                                    >
                                        {errors[key]}{" "}
                                        <Link
                                            href="/cart"
                                            className="underline font-semibold"
                                        >
                                            Review cart
                                        </Link>
                                    </div>
                                ),
                        )}
                        <button
                            disabled={processing}
                            className="button-primary w-full mt-6"
                        >
                            {processing ? "Placing your order…" : "Place order"}
                            <ArrowRightIcon className="w-4 h-4" />
                        </button>
                        <p className="text-[11px] leading-5 text-gray-500 mt-4">
                            Your order will begin as Pending. Payment methods
                            are simulated; this creates an actual order record
                            and reserves inventory.
                        </p>
                    </aside>
                </form>
            </div>
        </CustomerLayout>
    );
}
