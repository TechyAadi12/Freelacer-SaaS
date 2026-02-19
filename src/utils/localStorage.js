const STORAGE_KEYS = {
    CLIENTS: 'freelancer_clients',
    PROJECTS: 'freelancer_projects',
    INVOICES: 'freelancer_invoices',
    TIME_LOGS: 'freelancer_time_logs',
    PAYMENTS: 'freelancer_payments',
    USER: 'user',
    TOKEN: 'token'
};

const getFromStorage = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
};

const setToStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

export const storage = {
    // Clients
    getClients: () => getFromStorage(STORAGE_KEYS.CLIENTS),
    saveClient: (client) => {
        const clients = storage.getClients();
        if (client._id) {
            const index = clients.findIndex(c => c._id === client._id);
            if (index !== -1) clients[index] = client;
        } else {
            client._id = generateId();
            clients.push(client);
        }
        setToStorage(STORAGE_KEYS.CLIENTS, clients);
        return client;
    },
    deleteClient: (id) => {
        const clients = storage.getClients().filter(c => c._id !== id);
        setToStorage(STORAGE_KEYS.CLIENTS, clients);
    },

    // Projects
    getProjects: () => {
        const projects = getFromStorage(STORAGE_KEYS.PROJECTS);
        const clients = storage.getClients();
        // Populate client data
        return projects.map(p => ({
            ...p,
            client: clients.find(c => c._id === p.client) || p.client
        }));
    },
    saveProject: (project) => {
        const projects = getFromStorage(STORAGE_KEYS.PROJECTS);
        if (project._id) {
            const index = projects.findIndex(p => p._id === project._id);
            if (index !== -1) projects[index] = project;
        } else {
            project._id = generateId();
            projects.push(project);
        }
        setToStorage(STORAGE_KEYS.PROJECTS, projects);
        return project;
    },
    deleteProject: (id) => {
        const projects = getFromStorage(STORAGE_KEYS.PROJECTS).filter(p => p._id !== id);
        setToStorage(STORAGE_KEYS.PROJECTS, projects);
    },

    // Invoices
    getInvoices: () => {
        const invoices = getFromStorage(STORAGE_KEYS.INVOICES);
        const clients = storage.getClients();
        const projects = storage.getProjects();
        return invoices.map(inv => ({
            ...inv,
            client: clients.find(c => c._id === inv.client) || inv.client,
            project: projects.find(p => p._id === inv.project) || inv.project
        }));
    },
    saveInvoice: (invoice) => {
        const invoices = getFromStorage(STORAGE_KEYS.INVOICES);
        if (invoice._id) {
            const index = invoices.findIndex(i => i._id === invoice._id);
            if (index !== -1) invoices[index] = invoice;
        } else {
            invoice._id = generateId();
            invoices.push(invoice);
        }
        setToStorage(STORAGE_KEYS.INVOICES, invoices);
        return invoice;
    },
    deleteInvoice: (id) => {
        const invoices = getFromStorage(STORAGE_KEYS.INVOICES).filter(i => i._id !== id);
        setToStorage(STORAGE_KEYS.INVOICES, invoices);
    },

    // Time Logs
    getTimeLogs: () => {
        const logs = getFromStorage(STORAGE_KEYS.TIME_LOGS);
        const projects = storage.getProjects();
        return logs.map(log => ({
            ...log,
            project: projects.find(p => p._id === log.project) || log.project
        }));
    },
    saveTimeLog: (log) => {
        const logs = getFromStorage(STORAGE_KEYS.TIME_LOGS);
        if (log._id) {
            const index = logs.findIndex(l => l._id === log._id);
            if (index !== -1) logs[index] = log;
        } else {
            log._id = generateId();
            logs.push(log);
        }
        setToStorage(STORAGE_KEYS.TIME_LOGS, logs);
        return log;
    },
    deleteTimeLog: (id) => {
        const logs = getFromStorage(STORAGE_KEYS.TIME_LOGS).filter(l => l._id !== id);
        setToStorage(STORAGE_KEYS.TIME_LOGS, logs);
    },

    // Payments
    getPayments: () => {
        const payments = getFromStorage(STORAGE_KEYS.PAYMENTS);
        const clients = storage.getClients();
        const projects = storage.getProjects();
        const invoices = getFromStorage(STORAGE_KEYS.INVOICES);
        return payments.map(p => ({
            ...p,
            client: clients.find(c => c._id === p.client) || p.client,
            project: projects.find(proj => proj._id === p.project) || p.project,
            invoice: invoices.find(inv => inv._id === p.invoice) || p.invoice
        }));
    },
    savePayment: (payment) => {
        const payments = getFromStorage(STORAGE_KEYS.PAYMENTS);
        if (payment._id) {
            const index = payments.findIndex(p => p._id === payment._id);
            if (index !== -1) payments[index] = payment;
        } else {
            payment._id = generateId();
            payments.push(payment);
        }
        setToStorage(STORAGE_KEYS.PAYMENTS, payments);
        return payment;
    },
    deletePayment: (id) => {
        const payments = getFromStorage(STORAGE_KEYS.PAYMENTS).filter(p => p._id !== id);
        setToStorage(STORAGE_KEYS.PAYMENTS, payments);
    },
    clearAll: () => {
        Object.values(STORAGE_KEYS).forEach(key => {
            if (key !== STORAGE_KEYS.USER && key !== STORAGE_KEYS.TOKEN) {
                localStorage.removeItem(key);
            }
        });
    }
};

