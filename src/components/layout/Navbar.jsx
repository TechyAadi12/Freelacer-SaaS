import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Avatar from '../Avatar';
import {
    Bars3Icon,
    MagnifyingGlassIcon,
    BellIcon,
    SunIcon,
    MoonIcon,
} from '@heroicons/react/24/outline';

const Navbar = ({ onMenuClick }) => {
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const notifications = [];


    return (
        <header className="sticky top-0 z-30 h-16 bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700">
            <div className="flex items-center justify-between h-full px-4 lg:px-6">
                {/* Left side */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                        <Bars3Icon className="w-6 h-6" />
                    </button>

                    {/* Search */}
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-dark-700 rounded-lg w-80">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search clients, projects, invoices..."
                            className="bg-transparent border-none outline-none w-full text-sm text-gray-900 dark:text-white placeholder-gray-500"
                        />
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    {/* Theme toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
                        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {isDark ? (
                            <SunIcon className="w-5 h-5" />
                        ) : (
                            <MoonIcon className="w-5 h-5" />
                        )}
                    </button>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
                        >
                            <BellIcon className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {/* Notifications dropdown */}
                        {showNotifications && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowNotifications(false)}
                                ></div>
                                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-800 rounded-xl shadow-lg border border-gray-200 dark:border-dark-700 z-20">
                                    <div className="p-4 border-b border-gray-200 dark:border-dark-700">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            Notifications
                                        </h3>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className={`p-4 border-b border-gray-200 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700 cursor-pointer ${notification.unread ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    {notification.unread && (
                                                        <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                                                    )}
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {notification.title}
                                                        </p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                            {notification.time}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-3 text-center border-t border-gray-200 dark:border-dark-700">
                                        <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                                            View all notifications
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Profile */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-3 p-1.5 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
                        >
                            <Avatar name={user?.name} src={user?.avatar} size="sm" />
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {user?.businessName || 'Freelancer'}
                                </p>
                            </div>
                        </button>

                        {/* Profile dropdown */}
                        {showProfileMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowProfileMenu(false)}
                                ></div>
                                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-800 rounded-xl shadow-lg border border-gray-200 dark:border-dark-700 z-20">
                                    <div className="p-4 border-b border-gray-200 dark:border-dark-700">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {user?.name}
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                            {user?.email}
                                        </p>
                                    </div>
                                    <div className="py-2">
                                        <a
                                            href="/settings"
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
                                        >
                                            Settings
                                        </a>
                                        <a
                                            href="/settings"
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
                                        >
                                            Profile
                                        </a>
                                    </div>
                                    <div className="border-t border-gray-200 dark:border-dark-700 py-2">
                                        <button
                                            onClick={logout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-dark-700"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
