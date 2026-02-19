export const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
};

export const formatDate = (date, format = 'short') => {
    if (!date) return '';

    const dateObj = new Date(date);

    if (format === 'short') {
        return dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    }

    if (format === 'long') {
        return dateObj.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    }

    if (format === 'time') {
        return dateObj.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    return dateObj.toLocaleDateString();
};

export const formatDuration = (minutes) => {
    if (!minutes) return '0h 0m';

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return `${hours}h ${mins}m`;
};

export const getStatusColor = (status) => {
    const colors = {
        // Project statuses
        'planning': 'badge-gray',
        'in-progress': 'badge-primary',
        'on-hold': 'badge-warning',
        'completed': 'badge-success',
        'cancelled': 'badge-danger',

        // Invoice statuses
        'draft': 'badge-gray',
        'sent': 'badge-primary',
        'paid': 'badge-success',
        'overdue': 'badge-danger',

        // Client statuses
        'active': 'badge-success',
        'inactive': 'badge-gray',
        'archived': 'badge-danger',

        // Payment statuses
        'pending': 'badge-warning',
        'completed': 'badge-success',
        'failed': 'badge-danger',
        'refunded': 'badge-gray',
    };

    return colors[status] || 'badge-gray';
};

export const getPriorityColor = (priority) => {
    const colors = {
        'low': 'badge-gray',
        'medium': 'badge-primary',
        'high': 'badge-warning',
        'urgent': 'badge-danger',
    };

    return colors[priority] || 'badge-gray';
};

export const calculateInvoiceTotal = (items, tax = 0, discount = 0) => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const total = subtotal + tax - discount;
    return { subtotal, total };
};

export const isOverdue = (dueDate, status) => {
    if (status === 'paid' || status === 'cancelled') return false;
    return new Date(dueDate) < new Date();
};

export const getInitials = (name) => {
    if (!name) return '';
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

export const truncate = (str, length = 50) => {
    if (!str) return '';
    if (str.length <= length) return str;
    return str.slice(0, length) + '...';
};

export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};
