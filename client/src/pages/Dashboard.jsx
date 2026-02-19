import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { formatCurrency, formatDate } from '../utils/helpers';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Loader from '../components/Loader';
import {
    UsersIcon,
    FolderIcon,
    DocumentTextIcon,
    CurrencyDollarIcon,
    ClockIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [revenueData, setRevenueData] = useState(null);
    const [projectStatus, setProjectStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, revenueRes, projectStatusRes] = await Promise.all([
                api.get('/dashboard/stats'),
                api.get('/dashboard/revenue-chart'),
                api.get('/dashboard/project-status'),
            ]);

            setStats(statsRes.data.stats);
            setRevenueData(revenueRes.data.data);
            setProjectStatus(projectStatusRes.data.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader fullScreen />;
    }

    const statCards = [
        {
            title: 'Total Clients',
            value: stats?.totalClients || 0,
            icon: UsersIcon,
            color: 'bg-blue-500',
            change: '0%',
            trend: 'none',
        },
        {
            title: 'Active Projects',
            value: stats?.activeProjects || 0,
            icon: FolderIcon,
            color: 'bg-purple-500',
            change: '0%',
            trend: 'none',
        },
        {
            title: 'Total Revenue',
            value: formatCurrency(stats?.totalRevenue || 0),
            icon: CurrencyDollarIcon,
            color: 'bg-green-500',
            change: '0%',
            trend: 'none',
        },
        {
            title: 'Pending Revenue',
            value: formatCurrency(stats?.pendingRevenue || 0),
            icon: DocumentTextIcon,
            color: 'bg-orange-500',
            change: '0%',
            trend: 'none',
        },
    ];


    const projectStatusData = projectStatus
        ? Object.entries(projectStatus).map(([key, value]) => ({
            name: key.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            value,
        }))
        : [];

    const COLORS = ['#94a3b8', '#0ea5e9', '#f59e0b', '#10b981', '#ef4444'];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Welcome back! Here's what's happening with your business.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <select className="input py-2">
                        <option>Last 30 days</option>
                        <option>Last 90 days</option>
                        <option>Last year</option>
                    </select>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    {stat.title}
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                                    {stat.value}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    {stat.trend === 'up' && <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />}
                                    {stat.trend === 'down' && <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />}
                                    <span
                                        className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : 'text-gray-500'
                                            }`}
                                    >
                                        {stat.change}
                                    </span>
                                    <span className="text-sm text-gray-500">vs last month</span>
                                </div>
                            </div>
                            <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <Card>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Revenue Overview
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={revenueData?.labels?.map((label, index) => ({
                            month: label,
                            revenue: revenueData.revenue[index],
                        }))}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                            <XAxis dataKey="month" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1f2937',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#fff',
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#0ea5e9"
                                strokeWidth={3}
                                dot={{ fill: '#0ea5e9', r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>

                {/* Project Status */}
                <Card>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Project Status Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={projectStatusData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) =>
                                    `${name}: ${(percent * 100).toFixed(0)}%`
                                }
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {projectStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Invoices */}
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Recent Invoices
                        </h3>
                        <Link
                            to="/invoices"
                            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                        >
                            View all
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {stats?.recentInvoices?.slice(0, 5).map((invoice) => (
                            <div
                                key={invoice._id}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg"
                            >
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {invoice.invoiceNumber}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {invoice.client?.name}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {formatCurrency(invoice.total)}
                                    </p>
                                    <Badge variant={invoice.status}>{invoice.status}</Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Recent Projects */}
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Recent Projects
                        </h3>
                        <Link
                            to="/projects"
                            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                        >
                            View all
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {stats?.recentProjects?.slice(0, 5).map((project) => (
                            <div
                                key={project._id}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg"
                            >
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {project.name}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {project.client?.name}
                                    </p>
                                </div>
                                <Badge variant={project.status}>{project.status}</Badge>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white">
                    <div className="flex items-center gap-4">
                        <ClockIcon className="w-12 h-12 opacity-80" />
                        <div>
                            <p className="text-sm opacity-90">Hours Tracked</p>
                            <p className="text-3xl font-bold">{stats?.totalHoursTracked || 0}h</p>
                        </div>
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <div className="flex items-center gap-4">
                        <CurrencyDollarIcon className="w-12 h-12 opacity-80" />
                        <div>
                            <p className="text-sm opacity-90">This Month</p>
                            <p className="text-3xl font-bold">
                                {formatCurrency(stats?.monthlyRevenue || 0)}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <div className="flex items-center gap-4">
                        <FolderIcon className="w-12 h-12 opacity-80" />
                        <div>
                            <p className="text-sm opacity-90">Total Projects</p>
                            <p className="text-3xl font-bold">{stats?.totalProjects || 0}</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
