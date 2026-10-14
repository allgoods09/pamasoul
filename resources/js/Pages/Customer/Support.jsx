import CustomerLayout from "@/Layouts/CustomerLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import {
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
} from "@heroicons/react/24/outline";
import Reveal from "@/Components/Motion/Reveal";
export default function Support() {
    const [data, setData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [opened, setOpened] = useState(false);
    const submit = (e) => {
        e.preventDefault();
        const body = `${data.message}\n\nFrom: ${data.name}\nReply to: ${data.email}`;
        window.location.href = `mailto:support@pamasoul.com?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`;
        setOpened(true);
    };
    return (
        <CustomerLayout>
            <Head title="Customer support" />
            <div className="store-container py-12 sm:py-16">
                <Reveal>
                    <p className="kicker mb-3">Let’s talk fishing</p>
                    <h1 className="text-3xl sm:text-4xl font-bold text-pamasoul-dark tracking-tight">
                        A little help before your next cast.
                    </h1>
                    <p className="text-sm text-gray-500 mt-4 max-w-xl">
                        Questions about your gear or an order? Use the existing
                        contact details below to reach the PamaSoul team.
                    </p>
                </Reveal>
                <div className="grid sm:grid-cols-3 gap-5 mt-9 mb-10">
                    {[
                        [
                            EnvelopeIcon,
                            "Email",
                            "support@pamasoul.com",
                            "mailto:support@pamasoul.com",
                        ],
                        [
                            PhoneIcon,
                            "Phone",
                            "(+63) 938 931 7261",
                            "tel:+639389317261",
                        ],
                        [
                            MapPinIcon,
                            "Visit our home waters",
                            "Tubigon, Bohol, Philippines",
                            null,
                        ],
                    ].map(([Icon, title, text, href]) => (
                        <Reveal key={title} className="commerce-panel p-6">
                            <Icon className="h-6 w-6 text-pamasoul-600 mb-4" />
                            <h2 className="text-sm font-semibold text-pamasoul-dark">
                                {title}
                            </h2>
                            {href ? (
                                <a
                                    className="text-sm text-pamasoul-700 mt-3 block break-all"
                                    href={href}
                                >
                                    {text}
                                </a>
                            ) : (
                                <p className="text-sm text-gray-500 mt-3">
                                    {text}
                                </p>
                            )}
                        </Reveal>
                    ))}
                </div>
                <form
                    onSubmit={submit}
                    className="commerce-panel max-w-3xl p-6 sm:p-8"
                >
                    <h2 className="text-xl font-semibold text-pamasoul-dark">
                        Write an email
                    </h2>
                    <p className="text-xs text-gray-500 leading-6 mt-2 mb-6">
                        This opens your email app with a draft. You’ll review
                        and send it there. This website does not submit support
                        messages or provide live chat.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-5">
                        {[
                            ["name", "Your name", "text"],
                            ["email", "Reply email", "email"],
                            ["subject", "Subject", "text"],
                        ].map(([key, label, type]) => (
                            <div
                                key={key}
                                className={
                                    key === "subject" ? "sm:col-span-2" : ""
                                }
                            >
                                <label
                                    htmlFor={`support-${key}`}
                                    className="text-sm font-medium"
                                >
                                    {label}
                                </label>
                                <input
                                    id={`support-${key}`}
                                    type={type}
                                    value={data[key]}
                                    required
                                    maxLength={150}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            [key]: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-xl border-gray-200 mt-2 focus:ring-pamasoul-500"
                                />
                            </div>
                        ))}
                    </div>
                    <label
                        htmlFor="support-message"
                        className="block text-sm font-medium mt-5"
                    >
                        Your message
                    </label>
                    <textarea
                        id="support-message"
                        value={data.message}
                        onChange={(e) =>
                            setData({ ...data, message: e.target.value })
                        }
                        rows={5}
                        required
                        maxLength={2000}
                        className="w-full rounded-xl border-gray-200 mt-2 focus:ring-pamasoul-500"
                    />
                    <button className="button-primary mt-5">
                        <EnvelopeIcon className="w-4 h-4" />
                        Open email draft
                    </button>
                    {opened && (
                        <p
                            role="status"
                            className="text-xs text-pamasoul-700 mt-4"
                        >
                            An email draft was requested. If your email app
                            didn’t open, email support@pamasoul.com directly.
                            Your message has not been sent by this website.
                        </p>
                    )}
                </form>
            </div>
        </CustomerLayout>
    );
}
