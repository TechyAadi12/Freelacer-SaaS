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

                    {/* User/account UI removed */}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
