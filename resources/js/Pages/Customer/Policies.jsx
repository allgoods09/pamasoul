import CustomerLayout from "@/Layouts/CustomerLayout";
import { Head } from "@inertiajs/react";

export default function Policies() {
    return (
        <CustomerLayout>
            <Head title="Store Policies - Pamasoul" />

            <div className="bg-gray-50 min-h-screen py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Store Policies
                        </h1>
                        <div className="w-24 h-1 bg-pamasoul-600 mx-auto"></div>
                    </div>

                    {/* Shipping Policy */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                📦 Shipping Policy
                            </h2>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    <strong className="text-gray-900">
                                        Processing Time:
                                    </strong>{" "}
                                    Orders are processed within 1-2 business
                                    days.
                                </p>
                                <p>
                                    <strong className="text-gray-900">
                                        Delivery Time:
                                    </strong>{" "}
                                    3-7 business days for Metro Manila, 5-10
                                    business days for provincial areas.
                                </p>
                                <p>
                                    <strong className="text-gray-900">
                                        Shipping Fees:
                                    </strong>{" "}
                                    Calculated at checkout based on location and
                                    order weight.
                                </p>
                                <p>
                                    <strong className="text-gray-900">
                                        Free Shipping:
                                    </strong>{" "}
                                    On orders over ₱5,000 within the
                                    Philippines.
                                </p>
                                <p>
                                    <strong className="text-gray-900">
                                        Tracking:
                                    </strong>{" "}
                                    Tracking number provided via email once
                                    shipped.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Returns & Refunds */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                🔄 Returns & Refunds
                            </h2>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    <strong className="text-gray-900">
                                        Return Window:
                                    </strong>{" "}
                                    14 days from delivery date.
                                </p>
                                <p>
                                    <strong className="text-gray-900">
                                        Condition:
                                    </strong>{" "}
                                    Items must be unused, in original packaging,
                                    with all tags attached.
                                </p>
                                <p>
                                    <strong className="text-gray-900">
                                        Return Shipping:
                                    </strong>{" "}
                                    Customer is responsible for return shipping
                                    costs unless item is defective.
                                </p>
                                <p>
                                    <strong className="text-gray-900">
                                        Refund Processing:
                                    </strong>{" "}
                                    Refunds issued within 5-7 business days
                                    after inspection.
                                </p>
                                <p>
                                    <strong className="text-gray-900">
                                        Non-returnable Items:
                                    </strong>{" "}
                                    Fishing lines (cut to size), clearance
                                    items, and gift cards.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Warranty */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                🔧 Warranty Policy
                            </h2>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    <strong className="text-gray-900">
                                        Manufacturer Warranty:
                                    </strong>{" "}
                                    All products come with manufacturer's
                                    warranty (varies by brand).
                                </p>
                                <p>
                                    <strong className="text-gray-900">
                                        Defective Items:
                                    </strong>{" "}
                                    If you receive a defective item, contact us
                                    within 7 days for replacement.
                                </p>
                                <p>
                                    <strong className="text-gray-900">
                                        Wear & Tear:
                                    </strong>{" "}
                                    Normal wear and tear, misuse, or improper
                                    care not covered.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Privacy Policy */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                🔒 Privacy Policy
                            </h2>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    <strong className="text-gray-900">
                                        Information We Collect:
                                    </strong>{" "}
                                    Name, email, shipping address, phone number,
                                    order history.
                                </p>
                                <p>
                                    <strong className="text-gray-900">
                                        How We Use It:
                                    </strong>{" "}
                                    To process orders, provide customer support,
                                    and send updates (with consent).
                                </p>
                                <p>
                                    <strong className="text-gray-900">
                                        Data Security:
                                    </strong>{" "}
                                    We use industry-standard encryption to
                                    protect your information.
                                </p>
                                <p>
                                    <strong className="text-gray-900">
                                        Third Parties:
                                    </strong>{" "}
                                    We never sell your data. We share only with
                                    shipping partners and payment processors.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                💳 Payment Methods
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <span className="text-2xl block mb-2">
                                        🏦
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        Bank Transfer
                                    </span>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <span className="text-2xl block mb-2">
                                        💵
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        Cash on Delivery
                                    </span>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <span className="text-2xl block mb-2">
                                        💳
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        Credit/Debit Card
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
