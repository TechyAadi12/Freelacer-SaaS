import { storage } from './localStorage';

// Helper to simulate API response latency
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 300));

const api = {
    get: async (url) => {
        await simulateDelay();
        if (url.includes('/auth/me')) {
            const user = JSON.parse(localStorage.getItem('user') || '{"name": "Admin User", "email": "admin@example.com"}');
            return { data: { success: true, user } };
        }
        if (url === '/clients') return { data: { clients: storage.getClients() } };
        if (url === '/projects') return { data: { projects: storage.getProjects() } };
        if (url === '/invoices') return { data: { invoices: storage.getInvoices() } };
        if (url === '/time-tracking') return { data: { logs: storage.getTimeLogs() } };
        if (url === '/payments') return { data: { payments: storage.getPayments() } };

        if (url === '/dashboard/stats') {
            const clients = storage.getClients();
            const projects = storage.getProjects();
            const invoices = storage.getInvoices();
            const logs = storage.getTimeLogs();

            const totalHours = logs.reduce((sum, log) => sum + (log.duration || 0), 0) / 60;
            const currentMonth = new Date().getMonth();
            const monthlyRev = invoices
                .filter(i => i.status === 'paid' && new Date(i.createdAt).getMonth() === currentMonth)
                .reduce((sum, i) => sum + (i.total || 0), 0);

            return {
                data: {
                    stats: {
                        totalClients: clients.length,
                        activeProjects: projects.filter(p => p.status === 'in-progress').length,
                        totalRevenue: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + (i.total || 0), 0),
                        pendingRevenue: invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + (i.total || 0), 0),
                        recentInvoices: invoices.slice(-5).reverse(),
                        recentProjects: projects.slice(-5).reverse(),
                        totalHoursTracked: Math.round(totalHours),
                        monthlyRevenue: monthlyRev,
                        totalProjects: projects.length
                    }
                }
            };
        }
        if (url === '/dashboard/revenue-chart') {
            const invoices = storage.getInvoices();
            const hasData = invoices.length > 0;
            return {
                data: {
                    data: {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        revenue: hasData ? [2000, 3500, 3000, 5000, 4500, 6000] : [0, 0, 0, 0, 0, 0]
                    }
                }
            };
        }

        if (url === '/dashboard/project-status') {
            const projects = storage.getProjects();
            const statusCount = projects.reduce((acc, p) => {
                acc[p.status] = (acc[p.status] || 0) + 1;
                return acc;
            }, {});
            return { data: { data: statusCount } };
        }

        if (url === '/dashboard/top-clients') {
            const clients = storage.getClients();
            const projects = storage.getProjects();
            const invoices = storage.getInvoices();

            const clientData = clients.map(c => {
                const clientId = c._id;
                const clientProjects = projects.filter(p => (p.client?._id || p.client) === clientId);
                const clientInvoices = invoices.filter(i => (i.client?._id || i.client) === clientId && i.status === 'paid');
                return {
                    name: c.name,
                    projectCount: clientProjects.length,
                    totalRevenue: clientInvoices.reduce((sum, i) => sum + (i.total || 0), 0)
                };
            }).sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 5);

            return { data: { clients: clientData } };
        }

        if (url.startsWith('/analytics')) {
            const projects = storage.getProjects();
            const invoices = storage.getInvoices();
            return {
                data: {
                    totalEarnings: invoices.reduce((sum, inv) => sum + (inv.total || 0), 0),
                    activeProjects: projects.filter(p => p.status === 'in-progress').length,
                    pendingInvoices: invoices.filter(i => i.status !== 'paid').length,
                    recentActivity: []
                }
            };
        }
        return { data: {} };
    },


    post: async (url, data) => {
        await simulateDelay();
        if (url === '/reset') {
            storage.clearAll();
            return { data: { success: true } };
        }
        if (url === '/auth/login' || url === '/auth/register') {
            const user = { _id: '1', name: data.name || 'Admin', email: data.email };
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', 'mock-token');
            return { data: { success: true, user, token: 'mock-token' } };
        }
        if (url === '/auth/logout') return { data: { success: true } };
        if (url === '/clients') return { data: { client: storage.saveClient(data) } };
        if (url === '/projects') return { data: { project: storage.saveProject(data) } };
        if (url === '/invoices') return { data: { invoice: storage.saveInvoice(data) } };
        if (url === '/time-tracking') return { data: { log: storage.saveTimeLog(data) } };
        if (url === '/payments' || url === '/payments/manual') return { data: { payment: storage.savePayment(data) } };
        return { data: {} };
    },

    put: async (url, data) => {
        await simulateDelay();
        const id = url.split('/').pop();
        if (url.includes('/auth/update')) {
            localStorage.setItem('user', JSON.stringify(data));
            return { data: { success: true, user: data } };
        }
        if (url.startsWith('/clients/')) return { data: { client: storage.saveClient({ ...data, _id: id }) } };
        if (url.startsWith('/projects/')) return { data: { project: storage.saveProject({ ...data, _id: id }) } };
        if (url.startsWith('/invoices/')) return { data: { invoice: storage.saveInvoice({ ...data, _id: id }) } };
        if (url.startsWith('/time-tracking/')) return { data: { log: storage.saveTimeLog({ ...data, _id: id }) } };
        if (url.startsWith('/payments/')) return { data: { payment: storage.savePayment({ ...data, _id: id }) } };
        return { data: {} };
    },
    delete: async (url) => {
        await simulateDelay();
        const id = url.split('/').pop();
        if (url.startsWith('/clients/')) storage.deleteClient(id);
        if (url.startsWith('/projects/')) storage.deleteProject(id);
        if (url.startsWith('/invoices/')) storage.deleteInvoice(id);
        if (url.startsWith('/time-tracking/')) storage.deleteTimeLog(id);
        if (url.startsWith('/payments/')) storage.deletePayment(id);
        return { data: { success: true } };
    }
};

export default api;

