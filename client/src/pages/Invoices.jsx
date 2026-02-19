import { useState, useEffect } from 'react';
import api from '../utils/api';
import { formatDate, formatCurrency } from '../utils/helpers';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Select from '../components/Select';
import { PencilIcon, TrashIcon, PlusIcon, EyeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Invoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [clients, setClients] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [formData, setFormData] = useState({
        client: '',
        project: '',
        status: 'draft',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
        notes: '',
        tax: 0,
        discount: 0
    });

    useEffect(() => {
        fetchInvoices();
        fetchClients();
        fetchProjects();
    }, []);

    const fetchInvoices = async () => {
        try {
            const response = await api.get('/invoices');
            setInvoices(response.data.invoices);
        } catch (error) {
            console.error('Error fetching invoices:', error);
            toast.error('Failed to load invoices');
        } finally {
            setLoading(false);
        }
    };

    const fetchClients = async () => {
        try {
            const response = await api.get('/clients');
            setClients(response.data.clients.map(c => ({
                value: c._id,
                label: c.name
            })));
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await api.get('/projects');
            setProjects(response.data.projects.map(p => ({
                value: p._id,
                label: p.name,
                clientId: p.client?._id || p.client
            })));
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const handleOpenModal = (mode, invoice = null) => {
        setModalMode(mode);
        setSelectedInvoice(invoice);
        if (invoice) {
            setFormData({
                client: invoice.client?._id || invoice.client,
                project: invoice.project?._id || invoice.project || '',
                status: invoice.status,
                issueDate: invoice.issueDate?.split('T')[0] || '',
                dueDate: invoice.dueDate?.split('T')[0] || '',
                items: invoice.items || [{ description: '', quantity: 1, rate: 0, amount: 0 }],
                notes: invoice.notes || '',
                tax: invoice.tax || 0,
                discount: invoice.discount || 0
            });
        } else {
            setFormData({
                client: '',
                project: '',
                status: 'draft',
                issueDate: new Date().toISOString().split('T')[0],
                dueDate: '',
                items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
                notes: '',
                tax: 0,
                discount: 0
            });
        }
        setIsModalOpen(true);
    };

    // Calculate item amount whenever quantity or rate changes
    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;

        if (field === 'quantity' || field === 'rate') {
            newItems[index].amount = newItems[index].quantity * newItems[index].rate;
        }

        setFormData({ ...formData, items: newItems });
    };

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { description: '', quantity: 1, rate: 0, amount: 0 }]
        });
    };

    const removeItem = (index) => {
        if (formData.items.length === 1) return;
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const calculateSubtotal = () => {
        return formData.items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const taxAmount = (subtotal * (Number(formData.tax) || 0)) / 100;
        const discountAmount = Number(formData.discount) || 0;
        return subtotal + taxAmount - discountAmount;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const invoiceData = {
            ...formData,
            subtotal: calculateSubtotal(),
            total: calculateTotal()
        };

        try {
            if (modalMode === 'add') {
                await api.post('/invoices', invoiceData);
                toast.success('Invoice created successfully');
            } else {
                await api.put(`/invoices/${selectedInvoice._id}`, invoiceData);
                toast.success('Invoice updated successfully');
            }
            fetchInvoices();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving invoice:', error);
            toast.error(error.response?.data?.message || 'Failed to save invoice');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this invoice?')) return;
        try {
            await api.delete(`/invoices/${id}`);
            toast.success('Invoice deleted successfully');
            fetchInvoices();
        } catch (error) {
            console.error('Error deleting invoice:', error);
            toast.error('Failed to delete invoice');
        }
    };

    if (loading) return <Loader fullScreen />;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Invoices</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage your billing and payments
                    </p>
                </div>
                <Button onClick={() => handleOpenModal('add')} icon={PlusIcon}>
                    New Invoice
                </Button>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Invoice #</th>
                                <th>Client</th>
                                <th>Issue Date</th>
                                <th>Due Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-8 text-gray-500">
                                        No invoices found. Create your first invoice.
                                    </td>
                                </tr>
                            ) : (
                                invoices.map((invoice) => (
                                    <tr key={invoice._id}>
                                        <td>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {invoice.invoiceNumber}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex flex-col">
                                                <span className="text-gray-900 dark:text-white">
                                                    {invoice.client?.name || 'Unknown Client'}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {invoice.project?.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="text-sm text-gray-500">
                                                {formatDate(invoice.issueDate)}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="text-sm text-gray-500">
                                                {formatDate(invoice.dueDate)}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="font-bold text-gray-900 dark:text-white">
                                                {formatCurrency(invoice.total)}
                                            </span>
                                        </td>
                                        <td>
                                            <Badge variant={invoice.status}>{invoice.status}</Badge>
                                        </td>
                                        <td className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal('edit', invoice)}
                                                    className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(invoice._id)}
                                                    className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalMode === 'add' ? 'Create New Invoice' : 'Edit Invoice'}
                size="xl"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                            label="Client"
                            value={formData.client}
                            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                            options={[{ value: '', label: 'Select Client' }, ...clients]}
                            required
                        />
                        <Select
                            label="Project (Optional)"
                            value={formData.project}
                            onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                            options={[{ value: '', label: 'Select Project' }, ...projects.filter(p => !formData.client || p.clientId === formData.client)]}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            label="Issue Date"
                            type="date"
                            value={formData.issueDate}
                            onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                            required
                        />
                        <Input
                            label="Due Date"
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            required
                        />
                        <Select
                            label="Status"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            options={[
                                { value: 'draft', label: 'Draft' },
                                { value: 'sent', label: 'Sent' },
                                { value: 'paid', label: 'Paid' },
                                { value: 'overdue', label: 'Overdue' },
                                { value: 'cancelled', label: 'Cancelled' }
                            ]}
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b pb-2">
                            <h4 className="font-medium">Invoice Items</h4>
                            <Button type="button" size="sm" onClick={addItem} icon={PlusIcon}>Add Item</Button>
                        </div>
                        {formData.items.map((item, index) => (
                            <div key={index} className="grid grid-cols-12 gap-2 items-center">
                                <div className="col-span-5">
                                    <Input
                                        placeholder="Description"
                                        value={item.description}
                                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Input
                                        type="number"
                                        placeholder="Qty"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Input
                                        type="number"
                                        placeholder="Rate"
                                        min="0"
                                        value={item.rate}
                                        onChange={(e) => handleItemChange(index, 'rate', Number(e.target.value))}
                                        required
                                    />
                                </div>
                                <div className="col-span-2 text-right font-medium">
                                    {formatCurrency(item.amount)}
                                </div>
                                <div className="col-span-1 text-right">
                                    <button
                                        type="button"
                                        onClick={() => removeItem(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t pt-4 flex flex-col items-end space-y-2">
                        <div className="flex justify-between w-64 items-center">
                            <span>Subtotal:</span>
                            <span className="font-semibold">{formatCurrency(calculateSubtotal())}</span>
                        </div>
                        <div className="flex justify-between w-64 items-center gap-2">
                            <span>Tax (%):</span>
                            <input
                                type="number"
                                className="input w-20 py-1 px-2 text-right"
                                value={formData.tax}
                                onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-between w-64 items-center gap-2">
                            <span>Discount:</span>
                            <input
                                type="number"
                                className="input w-20 py-1 px-2 text-right"
                                value={formData.discount}
                                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-between w-64 items-center text-lg pt-2 border-t">
                            <span className="font-bold">Total:</span>
                            <span className="font-bold text-primary-600">{formatCurrency(calculateTotal())}</span>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">
                            {modalMode === 'add' ? 'Create Invoice' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Invoices;
