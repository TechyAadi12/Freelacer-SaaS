import { useState, useEffect } from 'react';
import api from '../utils/api';
import { formatDate, formatCurrency } from '../utils/helpers';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [selectedClient, setSelectedClient] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
        },
        notes: ''
    });

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await api.get('/clients');
            setClients(response.data.clients);
        } catch (error) {
            console.error('Error fetching clients:', error);
            toast.error('Failed to load clients');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (mode, client = null) => {
        setModalMode(mode);
        setSelectedClient(client);
        if (client) {
            setFormData({
                name: client.name,
                email: client.email,
                phone: client.phone || '',
                company: client.company || '',
                address: {
                    street: client.address?.street || '',
                    city: client.address?.city || '',
                    state: client.address?.state || '',
                    zipCode: client.address?.zipCode || '',
                    country: client.address?.country || ''
                },
                notes: client.notes || ''
            });
        } else {
            setFormData({
                name: '',
                email: '',
                phone: '',
                company: '',
                address: {
                    street: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    country: ''
                },
                notes: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalMode === 'add') {
                await api.post('/clients', formData);
                toast.success('Client created successfully');
            } else {
                await api.put(`/clients/${selectedClient._id}`, formData);
                toast.success('Client updated successfully');
            }
            fetchClients();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving client:', error);
            toast.error(error.response?.data?.message || 'Failed to save client');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this client?')) return;
        try {
            await api.delete(`/clients/${id}`);
            toast.success('Client deleted successfully');
            fetchClients();
        } catch (error) {
            console.error('Error deleting client:', error);
            toast.error('Failed to delete client');
        }
    };

    if (loading) return <Loader fullScreen />;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Clients</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage your client relationships
                    </p>
                </div>
                <Button onClick={() => handleOpenModal('add')} icon={PlusIcon}>
                    New Client
                </Button>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Contact</th>
                                <th>Status</th>
                                <th>Projects</th>
                                <th>Revenue</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-gray-500">
                                        No clients found. Add your first client to get started.
                                    </td>
                                </tr>
                            ) : (
                                clients.map((client) => (
                                    <tr key={client._id}>
                                        <td>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {client.name}
                                                </p>
                                                <p className="text-sm text-gray-500">{client.company}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <p className="text-sm text-gray-900 dark:text-white">
                                                    {client.email}
                                                </p>
                                                <p className="text-sm text-gray-500">{client.phone}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <Badge variant={client.status}>{client.status}</Badge>
                                        </td>
                                        <td>
                                            <span className="text-gray-900 dark:text-white font-medium">
                                                {client.projectCount}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="text-gray-900 dark:text-white font-medium">
                                                {formatCurrency(client.totalRevenue)}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal('edit', client)}
                                                    className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(client._id)}
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
                title={modalMode === 'add' ? 'Add New Client' : 'Edit Client'}
                size="lg" // Ensure Modal component supports size prop or remove if not
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Client Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <Input
                            label="Email Address"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        <Input
                            label="Phone Number"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                        <Input
                            label="Company Name"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Street Address"
                            value={formData.address.street}
                            onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                        />
                        <Input
                            label="City"
                            value={formData.address.city}
                            onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                        />
                        <Input
                            label="State/Province"
                            value={formData.address.state}
                            onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
                        />
                        <Input
                            label="Zip/Postal Code"
                            value={formData.address.zipCode}
                            onChange={(e) => setFormData({ ...formData, address: { ...formData.address, zipCode: e.target.value } })}
                        />
                        <Input
                            label="Country"
                            value={formData.address.country}
                            onChange={(e) => setFormData({ ...formData, address: { ...formData.address, country: e.target.value } })}
                        />
                    </div>

                    <div>
                        <label className="label">Notes</label>
                        <textarea
                            className="input min-h-[100px]"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
                            {modalMode === 'add' ? 'Create Client' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Clients;
