import { NavLink } from 'react-router-dom';
import {
    HomeIcon,
    UsersIcon,
    FolderIcon,
    DocumentTextIcon,
    ClockIcon,
    CreditCardIcon,
    ChartBarIcon,
    Cog6ToothIcon,
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, onClose }) => {
    const navigation = [
        { name: 'Dashboard', to: '/dashboard', icon: HomeIcon },
        { name: 'Clients', to: '/clients', icon: UsersIcon },
        { name: 'Projects', to: '/projects', icon: FolderIcon },
        { name: 'Invoices', to: '/invoices', icon: DocumentTextIcon },
        { name: 'Time Tracking', to: '/time-tracking', icon: ClockIcon },
        { name: 'Payments', to: '/payments', icon: CreditCardIcon },
        { name: 'Analytics', to: '/analytics', icon: ChartBarIcon },
        { name: 'Settings', to: '/settings', icon: Cog6ToothIcon },
    ];

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                ></div>
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-dark-700">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">F</span>
                            </div>
                            <span className="text-xl font-bold text-gradient">
                                FreelancerHub
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="lg:hidden text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        {navigation.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.to}
                                onClick={() => window.innerWidth < 1024 && onClose()}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                                    }`
                                }
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.name}</span>
                            </NavLink>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200 dark:border-dark-700">
                        <div className="card-compact">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    All Systems Operational
                                </span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                v1.0.0 • Production Ready
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
