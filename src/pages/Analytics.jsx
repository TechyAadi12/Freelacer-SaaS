import { useState, useEffect } from 'react';
import api from '../utils/api';
import { formatDate, formatCurrency } from '../utils/helpers';
import Card from '../components/Card';
import Loader from '../components/Loader';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, CurrencyDollarIcon, UserGroupIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

const Analytics = () => {
    const [stats, setStats] = useState(null);
    const [revenueData, setRevenueData] = useState(null);
    const [projectStatus, setProjectStatus] = useState(null);
    const [topClients, setTopClients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, revenueRes, projectStatusRes, topClientsRes] = await Promise.all([
                api.get('/dashboard/stats'),
                api.get('/dashboard/revenue-chart'),
                api.get('/dashboard/project-status'),
                api.get('/dashboard/top-clients')
            ]);
            setStats(statsRes.data.stats);
            setRevenueData(revenueRes.data.data);
            setProjectStatus(projectStatusRes.data.data);
            setTopClients(topClientsRes.data.clients);
        } catch (error) {
            console.error('Error fetching analytics data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader fullScreen />;

    // Prepare chart data
    const projectStatusData = projectStatus
        ? Object.entries(projectStatus).map(([key, value]) => ({
            name: key.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            value,
        }))
        : [];

    const revenueChartData = revenueData?.labels?.map((label, index) => ({
        month: label,
        revenue: revenueData.revenue[index],
    })) || [];

    const COLORS = ['#94a3b8', '#0ea5e9', '#f59e0b', '#10b981', '#ef4444']; // Default, Blue, Yellow, Green, Red

    const overviewMetrics = [
        {
            title: 'Total Revenue',
            value: formatCurrency(stats?.totalRevenue || 0),
            icon: CurrencyDollarIcon,
            change: '0%',
            trend: 'none'
        },
        {
            title: 'Active Projects',
            value: stats?.activeProjects || 0,
            icon: BriefcaseIcon,
            change: '0%',
            trend: 'none'
        },
        {
            title: 'Total Clients',
            value: stats?.totalClients || 0,
            icon: UserGroupIcon,
            change: '0%',
            trend: 'none'
        },
        {
            title: 'Pending Amount',
            value: formatCurrency(stats?.pendingRevenue || 0),
            icon: ArrowTrendingUpIcon,
            change: '0%',
            trend: 'none'
        }
    ];


    return (
        <div className="space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Deep dive into your business performance.</p>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {overviewMetrics.map((metric, index) => (
                    <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-l-4 border-primary-500">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500 uppercase">{metric.title}</p>
                                <h3 className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">{metric.value}</h3>
                            </div>
                            <metric.icon className="w-8 h-8 text-primary-500 opacity-80" />
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className={`font-medium ${metric.trend === 'up' ? 'text-green-600' : metric.trend === 'down' ? 'text-red-600' : 'text-gray-400'} flex items-center gap-1`}>
                                {metric.trend === 'up' && <ArrowTrendingUpIcon className="w-4 h-4" />}
                                {metric.trend === 'down' && <ArrowTrendingDownIcon className="w-4 h-4" />}
                                {metric.change}
                            </span>
                            <span className="text-gray-400 ml-2">from last month</span>
                        </div>

                    </Card>
                ))}
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trend */}
                <Card className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Revenue Trend (6 Months)</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueChartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Project Distribution */}
                <Card className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Project Status Distribution</h3>
                    <div className="h-80 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={projectStatusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {projectStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Top Clients Table */}
            <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Top Performing Clients</h3>
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr className="text-left text-gray-500 uppercase text-xs tracking-wider border-b">
                                <th className="pb-3">Client Name</th>
                                <th className="pb-3">Total Projects</th>
                                <th className="pb-3 text-right">Total Revenue</th>
                                <th className="pb-3 text-right">Contribution</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {topClients.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-4 text-center text-gray-500">No client data available yet.</td>
                                </tr>
                            ) : (
                                topClients.map((client, index) => {
                                    const percentage = stats?.totalRevenue > 0
                                        ? Math.round((client.totalRevenue / stats.totalRevenue) * 100)
                                        : 0;

                                    return (
                                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <td className="py-4 font-medium text-gray-900 dark:text-white">{client.name}</td>
                                            <td className="py-4 text-gray-600 dark:text-gray-400">{client.projectCount} Projects</td>
                                            <td className="py-4 text-right font-bold text-gray-900 dark:text-white">{formatCurrency(client.totalRevenue)}</td>
                                            <td className="py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <span className="text-xs font-semibold text-gray-500">{percentage}%</span>
                                                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-primary-500 rounded-full"
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Analytics;
