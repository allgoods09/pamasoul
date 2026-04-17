import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import {
    ArrowLeftIcon,
    PrinterIcon,
    EnvelopeIcon,
    TruckIcon,
    CurrencyDollarIcon,
    CheckCircleIcon,
    ClockIcon,
    UserIcon,
    MapPinIcon,
    CreditCardIcon,
    CalendarIcon,
} from "@heroicons/react/24/outline";
import toast, { Toaster } from "react-hot-toast";

export default function OrdersShow({ order, shippingConfig }) {
    const [updating, setUpdating] = useState(false);

    const statusColors = {
        Pending: {
            bg: "bg-yellow-100",
            text: "text-yellow-800",
            icon: ClockIcon,
        },
        Paid: {
            bg: "bg-blue-100",
            text: "text-blue-800",
            icon: CurrencyDollarIcon,
        },
        Shipped: {
            bg: "bg-purple-100",
            text: "text-purple-800",
            icon: TruckIcon,
        },
        Completed: {
            bg: "bg-green-100",
            text: "text-green-800",
            icon: CheckCircleIcon,
        },
    };

    const handleStatusUpdate = (newStatus) => {
        if (updating) return;
        setUpdating(true);

        router.patch(
            `/admin/orders/${order.id}/status`,
            { status: newStatus },
            {
                onSuccess: () => {
                    toast.success(`Order status updated to ${newStatus}`);
                    setUpdating(false);
                },
                onError: () => {
                    toast.error("Failed to update order status");
                    setUpdating(false);
                },
            },
        );
    };

    const handlePrintInvoice = () => {
        window.open(`/admin/orders/${order.id}/invoice`, "_blank");
    };

    const handleEmailCustomer = () => {
        router.post(
            `/admin/orders/${order.id}/send-email`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        `Order status email sent to ${order.user?.email}`,
                    );
                },
                onError: (error) => {
                    console.error("Email error:", error);
                    toast.error("Failed to send email. Please try again.");
                },
            },
        );
    };

    const CurrentStatusIcon = statusColors[order.status]?.icon || ClockIcon;
    const statusColor = statusColors[order.status];

    // Calculate item subtotal from stored price snapshots
    const itemsSubtotal =
        order.items?.reduce((sum, item) => {
            const quantity = Number(item.quantity) || 0;
            const price = Number(item.price_snapshot) || 0;
            return sum + quantity * price;
        }, 0) || 0;

    // Use stored order total and calculate shipping fee as the difference
    const orderTotal = Number(order.total) || 0;
    const shippingFee = orderTotal - itemsSubtotal;
    const total = orderTotal;

    return (
        <AdminLayout>
            <Head title={`Order #${order.id}`} />
            <Toaster position="top-right" />

            <div className="space-y-6">
                {/* Header */}
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/admin/orders"
                            className="inline-flex items-center text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeftIcon className="h-5 w-5 mr-1" />
                            Back to Orders
                        </Link>
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                Order #{order.id}
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Placed on{" "}
                                {new Date(order.created_at).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 sm:mt-0 flex space-x-3">
                        <button
                            onClick={handlePrintInvoice}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                            <PrinterIcon className="mr-2 h-4 w-4" />
                            Print Invoice
                        </button>
                        <button
                            onClick={handleEmailCustomer}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                            <EnvelopeIcon className="mr-2 h-4 w-4" />
                            Email Customer
                        </button>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="rounded-lg bg-white shadow p-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center space-x-4">
                            <div
                                className={`rounded-full p-3 ${statusColor?.bg}`}
                            >
                                <CurrentStatusIcon
                                    className={`h-6 w-6 ${statusColor?.text}`}
                                />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    Current Status
                                </p>
                                <p
                                    className={`text-xl font-semibold ${statusColor?.text}`}
                                >
                                    {order.status}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <label className="text-sm font-medium text-gray-700">
                                Update Status:
                            </label>
                            <select
                                value={order.status}
                                onChange={(e) =>
                                    handleStatusUpdate(e.target.value)
                                }
                                disabled={updating}
                                className={`rounded-md border-0 px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-pamasoul-500 cursor-pointer ${statusColor?.bg} ${statusColor?.text}`}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Order Info Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Customer Info */}
                    <div className="rounded-lg bg-white shadow p-6">
                        <div className="flex items-center space-x-2 mb-4">
                            <UserIcon className="h-5 w-5 text-gray-400" />
                            <h2 className="text-lg font-medium text-gray-900">
                                Customer Information
                            </h2>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500">Name</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {order.user?.name}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="text-sm text-gray-600">
                                    {order.user?.email}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    Member Since
                                </p>
                                <p className="text-sm text-gray-600">
                                    {new Date(
                                        order.user?.created_at,
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    Total Orders
                                </p>
                                <p className="text-sm text-gray-600">
                                    {order.user?.order_count || 1} orders
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Shipping & Payment Info */}
                    <div className="rounded-lg bg-white shadow p-6">
                        <div className="flex items-center space-x-2 mb-4">
                            <TruckIcon className="h-5 w-5 text-gray-400" />
                            <h2 className="text-lg font-medium text-gray-900">
                                Shipping & Payment
                            </h2>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500 flex items-center">
                                    <MapPinIcon className="h-4 w-4 mr-1" />
                                    Shipping Address
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    {order.shipping_address}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 flex items-center">
                                    <CreditCardIcon className="h-4 w-4 mr-1" />
                                    Payment Method
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    {order.payment_method === "COD"
                                        ? "Cash on Delivery"
                                        : "Bank Transfer"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 flex items-center">
                                    <CalendarIcon className="h-4 w-4 mr-1" />
                                    Order Date
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    {new Date(
                                        order.created_at,
                                    ).toLocaleString()}
                                </p>
                            </div>
                            {order.updated_at !== order.created_at && (
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Last Updated
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {new Date(
                                            order.updated_at,
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="rounded-lg bg-white shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">
                            Order Items
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Product
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        SKU
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Quantity
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Unit Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Subtotal
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {order.items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {item.product?.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {item.product?.category?.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            #{item.product_id}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {item.quantity}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            ₱
                                            {Number(
                                                item.price_snapshot,
                                            ).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                            ₱
                                            {Number(
                                                item.quantity *
                                                    item.price_snapshot,
                                            ).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-50">
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="px-6 py-4 text-right font-medium text-gray-900"
                                    >
                                        Subtotal:
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                        ₱{itemsSubtotal.toLocaleString()}
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="px-6 py-4 text-right font-medium text-gray-900"
                                    >
                                        Shipping Fee:
                                    </td>
                                    <td className="px-6 py-4">
                                        {shippingFee > 0 ? (
                                            <span className="text-sm text-gray-600">
                                                ₱{shippingFee.toLocaleString()}
                                            </span>
                                        ) : (
                                            <span className="text-sm text-green-600 font-semibold">
                                                FREE
                                            </span>
                                        )}
                                    </td>
                                </tr>
                                <tr className="border-t border-gray-200">
                                    <td
                                        colSpan="4"
                                        className="px-6 py-4 text-right text-lg font-bold text-gray-900"
                                    >
                                        Total:
                                    </td>
                                    <td className="px-6 py-4 text-xl font-bold text-pamasoul-600">
                                        ₱{total.toLocaleString()}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Order Timeline */}
                <div className="rounded-lg bg-white shadow p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Order Timeline
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                                <div className="rounded-full bg-green-100 p-2">
                                    <CheckCircleIcon className="h-4 w-4 text-green-600" />
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    Order Placed
                                </p>
                                <p className="text-xs text-gray-500">
                                    {new Date(
                                        order.created_at,
                                    ).toLocaleString()}
                                </p>
                            </div>
                        </div>
                        {order.status !== "Pending" && (
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    <div className="rounded-full bg-blue-100 p-2">
                                        <CurrencyDollarIcon className="h-4 w-4 text-blue-600" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        Payment Confirmed
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Status changed to Paid
                                    </p>
                                </div>
                            </div>
                        )}
                        {order.status === "Shipped" && (
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    <div className="rounded-full bg-purple-100 p-2">
                                        <TruckIcon className="h-4 w-4 text-purple-600" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        Order Shipped
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Status changed to Shipped
                                    </p>
                                </div>
                            </div>
                        )}
                        {order.status === "Completed" && (
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    <div className="rounded-full bg-green-100 p-2">
                                        <CheckCircleIcon className="h-4 w-4 text-green-600" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        Order Completed
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Status changed to Completed
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
