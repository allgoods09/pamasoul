import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { 
    EyeIcon, 
    TrashIcon, 
    UserCircleIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
    UsersIcon,
    UserGroupIcon,
    ShieldCheckIcon,
    EnvelopeIcon,
    CalendarIcon,
    ChevronUpDownIcon,
    PlusIcon,
    ShoppingCartIcon
} from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';

export default function UsersIndex({ users, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || '');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showBulkRoleModal, setShowBulkRoleModal] = useState(false);
    const [bulkRole, setBulkRole] = useState('');
    const [isSelectAll, setIsSelectAll] = useState(false);
    
    // Create user form
    const [createForm, setCreateForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'customer',
    });
    const [createErrors, setCreateErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setIsSelectAll(selectedUsers.length === users.data.length && users.data.length > 0);
    }, [selectedUsers, users.data]);

    const handleFilter = () => {
        router.get('/admin/users', {
            search,
            role: roleFilter,
        });
    };

    const handleResetFilters = () => {
        setSearch('');
        setRoleFilter('');
        router.get('/admin/users');
    };

    const handleRoleChange = (userId, newRole) => {
        router.patch(`/admin/users/${userId}/role`, { role: newRole }, {
            onSuccess: () => toast.success('User role updated'),
            onError: () => toast.error('Failed to update role')
        });
    };

    const handleBulkRoleUpdate = () => {
        if (!bulkRole || selectedUsers.length === 0) return;
        
        Promise.all(selectedUsers.map(userId => 
            router.patch(`/admin/users/${userId}/role`, { role: bulkRole }, { preserveScroll: true })
        )).then(() => {
            toast.success(`${selectedUsers.length} user(s) updated to ${bulkRole}`);
            setSelectedUsers([]);
            setBulkRole('');
            setShowBulkRoleModal(false);
        });
    };

    const handleDelete = (user) => {
        if (user.role === 'admin' && users.data.filter(u => u.role === 'admin').length === 1) {
            toast.error('Cannot delete the only admin user');
            return;
        }
        
        if (confirm(`Delete user "${user.name}"? This action cannot be undone.`)) {
            router.delete(`/admin/users/${user.id}`, {
                onSuccess: () => toast.success('User deleted successfully'),
                onError: () => toast.error('Failed to delete user')
            });
        }
    };

    const handleBulkDelete = () => {
        if (selectedUsers.length === 0) return;
        
        if (confirm(`Delete ${selectedUsers.length} user(s)? This action cannot be undone.`)) {
            Promise.all(selectedUsers.map(userId => 
                router.delete(`/admin/users/${userId}`, { preserveScroll: true })
            )).then(() => {
                toast.success(`${selectedUsers.length} user(s) deleted`);
                setSelectedUsers([]);
            });
        }
    };

    const handleCreateUser = (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        router.post('/admin/users', createForm, {
            onSuccess: () => {
                toast.success('User created successfully');
                setShowCreateModal(false);
                setCreateForm({ name: '', email: '', password: '', role: 'customer' });
                setCreateErrors({});
                setSubmitting(false);
            },
            onError: (errors) => {
                setCreateErrors(errors);
                setSubmitting(false);
            }
        });
    };

    const handleToggleSelectAll = () => {
        if (isSelectAll) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(users.data.map(u => u.id));
        }
    };

    const handleSelectUser = (userId) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
    };

    const hasActiveFilters = search || roleFilter;
    
    // Calculate stats
    const totalUsers = users.total || 0;
    const customersCount = users.data.filter(u => u.role === 'customer').length;
    const adminsCount = users.data.filter(u => u.role === 'admin').length;
    const totalOrders = users.data.reduce((sum, u) => sum + (u.orders_count || 0), 0);

    return (
        <AdminLayout>
            <Head title="Users" />
            <Toaster position="top-right" />

            <div className="space-y-6">
                {/* Header */}
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Users Management</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage customers, administrators, and user permissions
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="mt-4 sm:mt-0 inline-flex items-center rounded-md bg-pamasoul-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pamasoul-500"
                    >
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Add User
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg bg-white p-4 shadow">
                        <div className="flex items-center">
                            <div className="rounded-full bg-blue-100 p-3">
                                <UsersIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">Total Users</p>
                                <p className="text-2xl font-semibold text-gray-900">{totalUsers}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg bg-white p-4 shadow">
                        <div className="flex items-center">
                            <div className="rounded-full bg-green-100 p-3">
                                <UserGroupIcon className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">Customers</p>
                                <p className="text-2xl font-semibold text-gray-900">{customersCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg bg-white p-4 shadow">
                        <div className="flex items-center">
                            <div className="rounded-full bg-purple-100 p-3">
                                <ShieldCheckIcon className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">Admins</p>
                                <p className="text-2xl font-semibold text-gray-900">{adminsCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg bg-white p-4 shadow">
                        <div className="flex items-center">
                            <div className="rounded-full bg-orange-100 p-3">
                                <ShoppingCartIcon className="h-6 w-6 text-orange-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">Total Orders</p>
                                <p className="text-2xl font-semibold text-gray-900">{totalOrders}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bulk Actions Bar */}
                {selectedUsers.length > 0 && (
                    <div className="rounded-lg bg-pamasoul-50 p-4 shadow-sm">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center space-x-4">
                                <span className="text-sm font-medium text-pamasoul-800">
                                    {selectedUsers.length} user(s) selected
                                </span>
                                <button
                                    onClick={() => setShowBulkRoleModal(true)}
                                    className="inline-flex items-center rounded-md bg-white px-3 py-1.5 text-sm font-medium text-pamasoul-700 shadow-sm hover:bg-pamasoul-50 border border-pamasoul-300"
                                >
                                    <ShieldCheckIcon className="mr-1.5 h-4 w-4" />
                                    Change Role
                                </button>
                                <button
                                    onClick={handleBulkDelete}
                                    className="inline-flex items-center rounded-md bg-white px-3 py-1.5 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50 border border-red-300"
                                >
                                    <TrashIcon className="mr-1.5 h-4 w-4" />
                                    Delete
                                </button>
                            </div>
                            <button
                                onClick={() => setSelectedUsers([])}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="rounded-lg bg-white p-4 shadow">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Search</label>
                            <div className="mt-1 relative">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Name or email..."
                                    className="block w-full rounded-md border-gray-300 pr-10 shadow-sm focus:border-pamasoul-500 focus:ring-pamasoul-500 sm:text-sm"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pamasoul-500 focus:ring-pamasoul-500 sm:text-sm"
                            >
                                <option value="">All Users</option>
                                <option value="customer">Customers Only</option>
                                <option value="admin">Admins Only</option>
                            </select>
                        </div>
                        <div className="flex items-end space-x-2">
                            {hasActiveFilters && (
                                <button
                                    onClick={handleResetFilters}
                                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                                >
                                    <XMarkIcon className="mr-1.5 h-4 w-4" />
                                    Reset
                                </button>
                            )}
                            <button
                                onClick={handleFilter}
                                className="inline-flex items-center rounded-md bg-pamasoul-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-pamasoul-500"
                            >
                                <MagnifyingGlassIcon className="mr-1.5 h-4 w-4" />
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            checked={isSelectAll}
                                            onChange={handleToggleSelectAll}
                                            className="rounded border-gray-300 text-pamasoul-600 focus:ring-pamasoul-500"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Orders
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total Spent
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Joined
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.includes(user.id)}
                                                onChange={() => handleSelectUser(user.id)}
                                                className="rounded border-gray-300 text-pamasoul-600 focus:ring-pamasoul-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-9 w-9 rounded-full bg-pamasoul-100 flex items-center justify-center">
                                                    <span className="text-sm font-medium text-pamasoul-700">
                                                        {user.name?.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                    <div className="text-xs text-gray-500">ID: #{user.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-1">
                                                <EnvelopeIcon className="h-3.5 w-3.5 text-gray-400" />
                                                <span className="text-sm text-gray-600">{user.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                className={`text-sm rounded-md border-gray-300 shadow-sm focus:border-pamasoul-500 focus:ring-pamasoul-500 ${
                                                    user.role === 'admin' ? 'bg-purple-50 text-purple-700 font-medium' : ''
                                                }`}
                                            >
                                                <option value="customer">Customer</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                                {user.orders_count || 0} orders
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-semibold text-gray-900">
                                                ₱{Number(user.total_spent || 0).toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-1">
                                                <CalendarIcon className="h-3.5 w-3.5 text-gray-400" />
                                                <span className="text-sm text-gray-500">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <Link
                                                href={`/admin/users/${user.id}`}
                                                className="text-pamasoul-600 hover:text-pamasoul-800"
                                                title="View details"
                                            >
                                                <EyeIcon className="h-5 w-5 inline" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(user)}
                                                className="text-red-600 hover:text-red-900"
                                                title="Delete user"
                                                disabled={user.role === 'admin' && adminsCount === 1}
                                            >
                                                <TrashIcon className="h-5 w-5 inline" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {users.data.length === 0 && (
                        <div className="text-center py-12">
                            <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {hasActiveFilters ? 'Try adjusting your filters.' : 'Get started by creating a new user.'}
                            </p>
                            {!hasActiveFilters && (
                                <div className="mt-6">
                                    <button
                                        onClick={() => setShowCreateModal(true)}
                                        className="inline-flex items-center rounded-md bg-pamasoul-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pamasoul-500"
                                    >
                                        <PlusIcon className="mr-2 h-4 w-4" />
                                        Add User
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    {users.links && users.links.length > 0 && users.data.length > 0 && (
                        <div className="border-t border-gray-200 px-6 py-4">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="text-sm text-gray-500">
                                    Showing {users.from || 0} to {users.to || 0} of {users.total} results
                                </div>
                                <div className="flex space-x-1">
                                    {users.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                                link.active
                                                    ? 'bg-pamasoul-600 text-white'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            } ${!link.url && 'opacity-50 cursor-default'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Create User Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowCreateModal(false)} />
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <form onSubmit={handleCreateUser}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-pamasoul-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <UserCircleIcon className="h-6 w-6 text-pamasoul-600" />
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">Create New User</h3>
                                            <div className="mt-4 space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Name *</label>
                                                    <input
                                                        type="text"
                                                        value={createForm.name}
                                                        onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pamasoul-500 focus:ring-pamasoul-500 sm:text-sm"
                                                        required
                                                    />
                                                    {createErrors.name && <p className="mt-1 text-sm text-red-600">{createErrors.name}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Email *</label>
                                                    <input
                                                        type="email"
                                                        value={createForm.email}
                                                        onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pamasoul-500 focus:ring-pamasoul-500 sm:text-sm"
                                                        required
                                                    />
                                                    {createErrors.email && <p className="mt-1 text-sm text-red-600">{createErrors.email}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Password *</label>
                                                    <input
                                                        type="password"
                                                        value={createForm.password}
                                                        onChange={(e) => setCreateForm({...createForm, password: e.target.value})}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pamasoul-500 focus:ring-pamasoul-500 sm:text-sm"
                                                        required
                                                        minLength={8}
                                                    />
                                                    {createErrors.password && <p className="mt-1 text-sm text-red-600">{createErrors.password}</p>}
                                                    <p className="mt-1 text-xs text-gray-500">Minimum 8 characters</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Role *</label>
                                                    <select
                                                        value={createForm.role}
                                                        onChange={(e) => setCreateForm({...createForm, role: e.target.value})}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pamasoul-500 focus:ring-pamasoul-500 sm:text-sm"
                                                    >
                                                        <option value="customer">Customer</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pamasoul-600 text-base font-medium text-white hover:bg-pamasoul-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pamasoul-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                                    >
                                        {submitting ? 'Creating...' : 'Create User'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pamasoul-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Role Update Modal */}
            {showBulkRoleModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowBulkRoleModal(false)} />
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-pamasoul-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <ShieldCheckIcon className="h-6 w-6 text-pamasoul-600" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Update User Roles</h3>
                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700">New Role</label>
                                            <select
                                                value={bulkRole}
                                                onChange={(e) => setBulkRole(e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pamasoul-500 focus:ring-pamasoul-500 sm:text-sm"
                                            >
                                                <option value="">Select role...</option>
                                                <option value="customer">Customer</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                            <p className="mt-2 text-sm text-gray-500">
                                                This will update {selectedUsers.length} selected user(s).
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    onClick={handleBulkRoleUpdate}
                                    disabled={!bulkRole}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pamasoul-600 text-base font-medium text-white hover:bg-pamasoul-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pamasoul-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                                >
                                    Update Roles
                                </button>
                                <button
                                    onClick={() => setShowBulkRoleModal(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pamasoul-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}