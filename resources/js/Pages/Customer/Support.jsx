import CustomerLayout from "@/Layouts/CustomerLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";

export default function Support() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would normally send to your backend
        console.log("Support form submitted:", formData);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setFormData({ name: "", email: "", subject: "", message: "" });
    };

    return (
        <CustomerLayout>
            <Head title="Customer Support - Pamasoul" />

            <div className="bg-gray-50 min-h-screen py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Customer Support
                        </h1>
                        <div className="w-24 h-1 bg-pamasoul-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                            Have questions? We're here to help! Reach out to us
                            through any of the channels below.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {/* Email Support */}
                        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                            <div className="text-4xl mb-3">✉️</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Email Us
                            </h3>
                            <p className="text-gray-600 mb-2">
                                Get a response within 24 hours
                            </p>
                            <a
                                href="mailto:support@pamasoul.com"
                                className="text-pamasoul-600 hover:text-pamasoul-800"
                            >
                                support@pamasoul.com
                            </a>
                        </div>

                        {/* Phone Support */}
                        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                            <div className="text-4xl mb-3">📞</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Call Us
                            </h3>
                            <p className="text-gray-600 mb-2">
                                Mon-Sat, 9AM - 6PM
                            </p>
                            <a
                                href="tel:+639389317261"
                                className="text-pamasoul-600 hover:text-pamasoul-800"
                            >
                                (+63) 938 931 7261
                            </a>
                        </div>

                        {/* Live Chat */}
                        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                            <div className="text-4xl mb-3">💬</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Live Chat
                            </h3>
                            <p className="text-gray-600 mb-2">
                                Available 24/7 for quick questions
                            </p>
                            <button className="text-pamasoul-600 hover:text-pamasoul-800">
                                Start a conversation →
                            </button>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Send Us a Message
                            </h2>

                            {submitted && (
                                <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
                                    Thank you! Your message has been sent. We'll
                                    get back to you soon.
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Your Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pamasoul-500 focus:border-pamasoul-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pamasoul-500 focus:border-pamasoul-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pamasoul-500 focus:border-pamasoul-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="6"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pamasoul-500 focus:border-pamasoul-500"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full md:w-auto px-6 py-3 bg-pamasoul-600 text-white rounded-lg hover:bg-pamasoul-800 transition-colors"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="mt-12 bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Frequently Asked Questions
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        How long does shipping take?
                                    </h3>
                                    <p className="text-gray-600">
                                        Metro Manila: 3-7 business days.
                                        Provincial: 5-10 business days.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        Do you ship internationally?
                                    </h3>
                                    <p className="text-gray-600">
                                        Currently, we only ship within the
                                        Philippines.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        Can I change or cancel my order?
                                    </h3>
                                    <p className="text-gray-600">
                                        Yes, within 2 hours of placing the
                                        order. Contact us immediately.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        Do you have a physical store?
                                    </h3>
                                    <p className="text-gray-600">
                                        Yes! We're located in Tubigon, Bohol.
                                        Visit us Monday-Saturday, 9AM-6PM.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
