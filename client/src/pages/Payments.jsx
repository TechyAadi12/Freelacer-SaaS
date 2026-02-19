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
import { PlusIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        invoiceId: '',
        amount: '',
        paymentMethod: 'bank_transfer',
        transactionId: '',
        notes: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [paymentsRes, invoicesRes] = await Promise.all([
                api.get('/payments'),
                api.get('/invoices')
            ]);
            setPayments(paymentsRes.data.payments);
            // Filter only unpaid or partially paid invoices for the dropdown
            const unpaidInvoices = invoicesRes.data.invoices.filter(
                inv => inv.status === 'sent' || inv.status === 'overdue' || inv.status === 'partially_paid'
            );
            setInvoices(unpaidInvoices);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load payments data');
        } finally {
            setLoading(false);
        }
    };

    const handleInvoiceChange = (e) => {
        const invoiceId = e.target.value;
        const invoice = invoices.find(inv => inv._id === invoiceId);
        setFormData({
            ...formData,
            invoiceId,
            amount: invoice ? invoice.total : '' // Auto-fill amount with invoice total
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/payments/manual', formData);
            toast.success('Payment recorded successfully');
            fetchData(); // Refresh data
            setIsModalOpen(false);
            setFormData({
                invoiceId: '',
                amount: '',
                paymentMethod: 'bank_transfer',
                transactionId: '',
                notes: ''
            });
        } catch (error) {
            console.error('Error recording payment:', error);
            toast.error(error.response?.data?.message || 'Failed to record payment');
        }
    };

    if (loading) return <Loader fullScreen />;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payments</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Track payment history and record manual transactions
                    </p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} icon={PlusIcon}>
                    Record Payment
                </Button>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Client</th>
                                <th>Invoice</th>
                                <th>Method</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Ref ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-8 text-gray-500">
                                        No payments found. Record your first payment.
                                    </td>
                                </tr>
                            ) : (
                                payments.map((payment) => (
                                    <tr key={payment._id}>
                                        <td>
                                            <span className="text-sm text-gray-900 dark:text-white">
                                                {formatDate(payment.paymentDate)}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {payment.client?.name || 'Unknown Client'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="text-sm text-primary-600">
                                                {payment.invoice?.invoiceNumber || 'N/A'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="capitalize text-sm text-gray-600 dark:text-gray-400">
                                                {payment.paymentMethod.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="font-bold text-green-600">
                                                {formatCurrency(payment.amount)}
                                            </span>
                                        </td>
                                        <td>
                                            <Badge variant={payment.status === 'completed' ? 'success' : 'warning'}>
                                                {payment.status}
                                            </Badge>
                                        </td>
                                        <td>
                                            <span className="text-xs font-mono text-gray-500">
                                                {payment.transactionId || payment.stripePaymentIntentId || '-'}
                                            </span>
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
                title="Record Manual Payment"
                size="md"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-start gap-3 mb-4">
                        <BanknotesIcon className="w-6 h-6 text-blue-600 mt-1" />
                        <div className="text-sm text-blue-800 dark:text-blue-200">
                            <p className="font-semibold">Manual Payment Recording</p>
                            <p>Use this form to record payments received outside the system (e.g., Bank Transfer, Cash, Check).</p>
                        </div>
                    </div>

                    <Select
                        label="Select Invoice"
                        value={formData.invoiceId}
                        onChange={handleInvoiceChange}
                        options={[
                            { value: '', label: 'Select an unpaid invoice...' },
                            ...invoices.map(inv => ({
                                value: inv._id,
                                label: `${inv.invoiceNumber} - ${inv.client?.name} (${formatCurrency(inv.total)})`
                            }))
                        ]}
                        required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Amount Received"
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            required
                        />
                        <Select
                            label="Payment Method"
                            value={formData.paymentMethod}
                            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                            options={[
                                { value: 'bank_transfer', label: 'Bank Transfer' },
                                { value: 'cash', label: 'Cash' },
                                { value: 'check', label: 'Check' },
                                { value: 'paypal', label: 'PayPal' },
                                { value: 'other', label: 'Other' }
                            ]}
                        />
                    </div>

                    <Input
                        label="Transaction / Reference ID (Optional)"
                        value={formData.transactionId}
                        onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                        placeholder="e.g. BANK-12345678"
                    />

                    <div>
                        <label className="label">Notes</label>
                        <textarea
                            className="input min-h-[80px]"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Additional details about this payment..."
                        ></textarea>
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
                            Record Payment
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Payments;
