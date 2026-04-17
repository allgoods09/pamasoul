import { Head, Link } from "@inertiajs/react";
import { PrinterIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function Invoice({ order }) {
    const handlePrint = () => {
        window.print();
    };

    // Helper function to safely format prices
    const formatPrice = (value) => {
        if (value === null || value === undefined) return "0.00";
        const num = parseFloat(value);
        return isNaN(num)
            ? "0.00"
            : num.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
              });
    };

    // Calculate subtotal from items
    const subtotal =
        order.items?.reduce((sum, item) => {
            return sum + Number(item.price_snapshot) * Number(item.quantity);
        }, 0) || 0;

    // Use stored total, calculate shipping fee as difference
    const orderTotal = Number(order.total) || 0;
    const shippingFee = orderTotal - subtotal;

    return (
        <>
            <Head title={`Invoice #${order.id} - Pamasoul`} />

            <style media="print">
                {`
                    .no-print { display: none !important; }
                    body { padding: 0; margin: 0; }
                    .print-container { padding: 20px; }
                `}
            </style>

            <div className="min-h-screen bg-gray-100 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="no-print mb-6 flex justify-between items-center">
                        <Link
                            href="/admin/orders"
                            className="inline-flex items-center text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeftIcon className="h-4 w-4 mr-2" />
                            Back to Orders
                        </Link>
                        <button
                            onClick={handlePrint}
                            className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                        >
                            <PrinterIcon className="h-4 w-4 mr-2" />
                            Print Invoice
                        </button>
                    </div>

                    <div className="bg-white shadow-lg rounded-lg overflow-hidden print-container">
                        <div className="p-8">
                            {/* Header */}
                            <div className="flex justify-between items-start border-b pb-6 mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        PAMASOUL
                                    </h1>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Premium Fishing Tackle
                                    </p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        Tubigon, Bohol, Philippines
                                        <br />
                                        support@pamasoul.com
                                        <br />
                                        (+63) 938 931 7261
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">
                                        INVOICE
                                    </p>
                                    <p className="text-xl font-bold text-gray-900">
                                        #{order.id}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Date:{" "}
                                        {new Date(
                                            order.created_at,
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                                        Bill To
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {order.user?.name || "Guest"}
                                        <br />
                                        {order.shipping_address ||
                                            "No address provided"}
                                        <br />
                                        {order.user?.email}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                                        Order Details
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Status:{" "}
                                        <span className="font-medium">
                                            {order.status}
                                        </span>
                                        <br />
                                        Payment:{" "}
                                        {order.payment_method === "COD"
                                            ? "Cash on Delivery"
                                            : "Bank Transfer"}
                                        <br />
                                        Shipping Fee:{" "}
                                        {shippingFee > 0
                                            ? `₱${formatPrice(shippingFee)}`
                                            : "FREE"}
                                    </p>
                                </div>
                            </div>

                            {/* Items Table */}
                            <div className="overflow-x-auto mb-8">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 text-sm font-semibold text-gray-700">
                                                Item
                                            </th>
                                            <th className="text-right py-3 text-sm font-semibold text-gray-700">
                                                Qty
                                            </th>
                                            <th className="text-right py-3 text-sm font-semibold text-gray-700">
                                                Price
                                            </th>
                                            <th className="text-right py-3 text-sm font-semibold text-gray-700">
                                                Total
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.items?.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="border-b border-gray-100"
                                            >
                                                <td className="py-3 text-sm text-gray-800">
                                                    {item.product?.name ||
                                                        "Product"}
                                                </td>
                                                <td className="py-3 text-sm text-gray-600 text-right">
                                                    {item.quantity}
                                                </td>
                                                <td className="py-3 text-sm text-gray-600 text-right">
                                                    ₱
                                                    {formatPrice(
                                                        item.price_snapshot,
                                                    )}
                                                </td>
                                                <td className="py-3 text-sm text-gray-800 font-medium text-right">
                                                    ₱
                                                    {formatPrice(
                                                        item.price_snapshot *
                                                            item.quantity,
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t border-gray-200">
                                            <td
                                                colSpan="3"
                                                className="py-3 text-right text-sm font-medium text-gray-700"
                                            >
                                                Subtotal
                                            </td>
                                            <td className="py-3 text-right text-sm text-gray-800">
                                                ₱{formatPrice(subtotal)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                colSpan="3"
                                                className="py-2 text-right text-sm text-gray-500"
                                            >
                                                Shipping Fee
                                            </td>
                                            <td className="py-2 text-right text-sm text-gray-600">
                                                {shippingFee > 0
                                                    ? `₱${formatPrice(shippingFee)}`
                                                    : "FREE"}
                                            </td>
                                        </tr>
                                        <tr className="border-t border-gray-300">
                                            <td
                                                colSpan="3"
                                                className="py-3 text-right text-base font-bold text-gray-900"
                                            >
                                                TOTAL
                                            </td>
                                            <td className="py-3 text-right text-base font-bold text-gray-900">
                                                ₱{formatPrice(orderTotal)}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            <div className="border-t pt-6 text-center text-xs text-gray-400">
                                <p>Thank you for shopping with Pamasoul!</p>
                                <p className="mt-1">
                                    For questions about this invoice, please
                                    contact support@pamasoul.com
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
