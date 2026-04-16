import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { UserCircleIcon, KeyIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <CustomerLayout>
            <Head title="Profile - Pamasoul" />

            <div className="bg-gray-50 min-h-screen py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                        <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
                    </div>

                    <div className="space-y-6">
                        {/* Profile Information */}
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <div className="flex items-center space-x-3">
                                    <UserCircleIcon className="h-6 w-6 text-blue-600" />
                                    <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    Update your account's profile information and email address
                                </p>
                            </div>
                            <div className="px-6 py-6">
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                />
                            </div>
                        </div>

                        {/* Update Password */}
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <div className="flex items-center space-x-3">
                                    <KeyIcon className="h-6 w-6 text-blue-600" />
                                    <h2 className="text-lg font-semibold text-gray-900">Update Password</h2>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    Ensure your account is using a long, random password to stay secure
                                </p>
                            </div>
                            <div className="px-6 py-6">
                                <UpdatePasswordForm />
                            </div>
                        </div>

                        {/* Delete Account */}
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="border-b border-gray-200 bg-red-50 px-6 py-4">
                                <div className="flex items-center space-x-3">
                                    <ShieldCheckIcon className="h-6 w-6 text-red-600" />
                                    <h2 className="text-lg font-semibold text-red-900">Delete Account</h2>
                                </div>
                                <p className="text-sm text-red-600 mt-1">
                                    Once your account is deleted, all of its resources and data will be permanently deleted
                                </p>
                            </div>
                            <div className="px-6 py-6">
                                <DeleteUserForm />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}