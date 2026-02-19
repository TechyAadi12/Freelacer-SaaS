import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import Select from '../components/Select';
import Loader from '../components/Loader';
import { UserCircleIcon, CogIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Settings = () => {
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        businessName: user?.businessName || '',
        currency: user?.currency || 'USD',
        timezone: user?.timezone || 'UTC',
        avatar: user?.avatar || ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                businessName: user.businessName || '',
                currency: user.currency || 'USD',
                timezone: user.timezone || 'UTC',
                avatar: user.avatar || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put('/auth/update', formData);
            toast.success('Profile updated successfully');
            // Normally trigger auth reload here, but for now we rely on local update or refresh
            window.location.reload();
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage your account preferences and business details
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sidebar Navigation (Visual Only for now) */}
                <Card className="h-fit">
                    <nav className="space-y-1">
                        <a href="#" className="flex items-center px-4 py-2 text-sm font-medium rounded-md bg-primary-50 dark:bg-primary-900/10 text-primary-700 dark:text-primary-300">
                            <UserCircleIcon className="mr-3 h-6 w-6" aria-hidden="true" />
                            General Profile
                        </a>
                        <a href="#" className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md">
                            <CogIcon className="mr-3 h-6 w-6" aria-hidden="true" />
                            Preferences
                        </a>
                        <button
                            onClick={logout}
                            className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-md mt-6"
                        >
                            <ArrowLeftOnRectangleIcon className="mr-3 h-6 w-6" aria-hidden="true" />
                            Sign Out
                        </button>
                    </nav>
                </Card>

                {/* Main Content Form */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Profile Information</h3>
                            <p className="mt-1 text-sm text-gray-500">Update your account's public profile and settings.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                <div className="sm:col-span-6">
                                    <label htmlFor="photo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Photo
                                    </label>
                                    <div className="mt-2 flex items-center">
                                        <span className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                                            {formData.avatar ? (
                                                <img src={formData.avatar} alt="Profile" className="h-full w-full object-cover" />
                                            ) : (
                                                <UserCircleIcon className="h-full w-full text-gray-300" />
                                            )}
                                        </span>
                                        <div className="ml-4 flex gap-2">
                                            <Input
                                                type="text"
                                                name="avatar"
                                                placeholder="Avatar URL (optional)"
                                                value={formData.avatar}
                                                onChange={handleChange}
                                                className="w-64"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <Input
                                        label="Full Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="sm:col-span-3">
                                    <Input
                                        label="Email Address"
                                        value={user?.email || ''}
                                        disabled
                                        className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed opacity-75"
                                    />
                                </div>

                                <div className="sm:col-span-6">
                                    <Input
                                        label="Business Name"
                                        name="businessName"
                                        value={formData.businessName}
                                        onChange={handleChange}
                                        placeholder="e.g. Acme Design Studio"
                                    />
                                </div>

                                <div className="sm:col-span-3">
                                    <Select
                                        label="Currency"
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleChange}
                                        options={[
                                            { value: 'USD', label: 'USD - US Dollar' },
                                            { value: 'EUR', label: 'EUR - Euro' },
                                            { value: 'GBP', label: 'GBP - British Pound' },
                                            { value: 'INR', label: 'INR - Indian Rupee' },
                                            { value: 'AUD', label: 'AUD - Australian Dollar' },
                                            { value: 'CAD', label: 'CAD - Canadian Dollar' }
                                        ]}
                                    />
                                </div>

                                <div className="sm:col-span-3">
                                    <Select
                                        label="Timezone"
                                        name="timezone"
                                        value={formData.timezone}
                                        onChange={handleChange}
                                        options={[
                                            { value: 'UTC', label: 'UTC (GMT+00:00)' },
                                            { value: 'America/New_York', label: 'New York (GMT-05:00)' },
                                            { value: 'Europe/London', label: 'London (GMT+00:00)' },
                                            { value: 'Asia/Kolkata', label: 'Kolkata (GMT+05:30)' },
                                            { value: 'Australia/Sydney', label: 'Sydney (GMT+11:00)' }
                                        ]}
                                    />
                                </div>
                            </div>

                            <div className="pt-5 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                                <Button type="submit" loading={loading} disabled={loading}>
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Settings;
