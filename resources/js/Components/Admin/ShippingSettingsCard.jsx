import { useState } from "react";
import { router } from "@inertiajs/react";
import {
    TruckIcon,
    PencilIcon,
    CheckIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export default function ShippingSettingsCard({ shippingConfig }) {
    const [isEditing, setIsEditing] = useState(false);
    const [freeThreshold, setFreeThreshold] = useState(
        shippingConfig?.free_threshold?.toString() || "5000",
    );
    const [baseFee, setBaseFee] = useState(
        shippingConfig?.base_fee?.toString() || "50",
    );
    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        // Convert to numbers only when saving
        const thresholdNum = parseInt(freeThreshold, 10) || 0;
        const baseFeeNum = parseInt(baseFee, 10) || 0;

        setSaving(true);
        router.post(
            "/admin/orders/shipping-settings",
            {
                free_threshold: thresholdNum,
                base_fee: baseFeeNum,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Shipping settings updated successfully");
                    setIsEditing(false);
                    setSaving(false);
                },
                onError: () => {
                    toast.error("Failed to update shipping settings");
                    setSaving(false);
                },
            },
        );
    };

    const handleCancel = () => {
        setFreeThreshold(shippingConfig?.free_threshold?.toString() || "5000");
        setBaseFee(shippingConfig?.base_fee?.toString() || "50");
        setIsEditing(false);
    };

    const handleThresholdChange = (e) => {
        const value = e.target.value;
        // Allow empty string or numbers only
        if (value === "" || /^\d*$/.test(value)) {
            setFreeThreshold(value);
        }
    };

    const handleBaseFeeChange = (e) => {
        const value = e.target.value;
        // Allow empty string or numbers only
        if (value === "" || /^\d*$/.test(value)) {
            setBaseFee(value);
        }
    };

    const getStatusText = () => {
        const threshold = parseInt(freeThreshold, 10) || 0;
        if (threshold === 0) return "Free shipping disabled";
        return `Free shipping on orders over ₱${threshold.toLocaleString()}`;
    };

    return (
        <div className="rounded-lg bg-white shadow overflow-hidden">
            {/* Header with icon and title - matching stats cards style */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="rounded-full bg-pamasoul-100 p-2">
                            <TruckIcon className="h-5 w-5 text-pamasoul-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-medium text-gray-900">
                                Shipping Settings
                            </h2>
                            <p className="text-sm text-gray-500">
                                Configure free shipping threshold and base fee
                            </p>
                        </div>
                    </div>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                        >
                            <PencilIcon className="mr-1.5 h-4 w-4" />
                            Edit Settings
                        </button>
                    )}
                </div>
            </div>

            {/* Content area */}
            <div className="px-6 py-5">
                {isEditing ? (
                    // Edit Mode
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Free Shipping Threshold (₱)
                            </label>
                            <input
                                type="text"
                                value={freeThreshold}
                                onChange={handleThresholdChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pamasoul-500 focus:ring-pamasoul-500 sm:text-sm"
                                placeholder="e.g., 5000"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Orders with subtotal equal to or above this
                                amount get free shipping. Set to 0 to disable.
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Base Shipping Fee (₱)
                            </label>
                            <input
                                type="text"
                                value={baseFee}
                                onChange={handleBaseFeeChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pamasoul-500 focus:ring-pamasoul-500 sm:text-sm"
                                placeholder="e.g., 50"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Applied when order subtotal is below the free
                                shipping threshold.
                            </p>
                        </div>
                        <div className="flex space-x-3 pt-2">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="inline-flex items-center rounded-md bg-pamasoul-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pamasoul-500 focus:outline-none focus:ring-2 focus:ring-pamasoul-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {saving ? (
                                    <>
                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <CheckIcon className="mr-1.5 h-4 w-4" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                            <button
                                onClick={handleCancel}
                                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pamasoul-500 focus:ring-offset-2 transition-colors"
                            >
                                <XMarkIcon className="mr-1.5 h-4 w-4" />
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    // View Mode - Similar to stats cards layout
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Free Threshold Card */}
                        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Free Shipping Threshold
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900">
                                        ₱
                                        {Number(
                                            shippingConfig?.free_threshold ||
                                                5000,
                                        ).toLocaleString()}
                                    </p>
                                </div>
                                <div className="rounded-full bg-green-100 p-2">
                                    <TruckIcon className="h-5 w-5 text-green-600" />
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                {getStatusText()}
                            </p>
                        </div>

                        {/* Base Fee Card */}
                        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Base Shipping Fee
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900">
                                        ₱
                                        {Number(
                                            shippingConfig?.base_fee || 50,
                                        ).toLocaleString()}
                                    </p>
                                </div>
                                <div className="rounded-full bg-blue-100 p-2">
                                    <TruckIcon className="h-5 w-5 text-blue-600" />
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Applied to orders below free shipping threshold
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
