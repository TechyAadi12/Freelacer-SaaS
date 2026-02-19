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
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedProject, setSelectedProject] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        client: '',
        description: '',
        status: 'planning',
        priority: 'medium',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        budget: 0,
        hourlyRate: 0,
        billingType: 'hourly'
    });

    useEffect(() => {
        fetchProjects();
        fetchClients();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await api.get('/projects');
            setProjects(response.data.projects);
        } catch (error) {
            console.error('Error fetching projects:', error);
            toast.error('Failed to load projects');
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

    const handleOpenModal = (mode, project = null) => {
        setModalMode(mode);
        setSelectedProject(project);
        if (project) {
            setFormData({
                name: project.name,
                client: project.client?._id || project.client,
                description: project.description || '',
                status: project.status,
                priority: project.priority,
                startDate: project.startDate?.split('T')[0] || '',
                endDate: project.endDate?.split('T')[0] || '',
                budget: project.budget || 0,
                hourlyRate: project.hourlyRate || 0,
                billingType: project.billingType
            });
        } else {
            setFormData({
                name: '',
                client: '',
                description: '',
                status: 'planning',
                priority: 'medium',
                startDate: new Date().toISOString().split('T')[0],
                endDate: '',
                budget: 0,
                hourlyRate: 0,
                billingType: 'hourly'
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalMode === 'add') {
                await api.post('/projects', formData);
                toast.success('Project created successfully');
            } else {
                await api.put(`/projects/${selectedProject._id}`, formData);
                toast.success('Project updated successfully');
            }
            fetchProjects();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving project:', error);
            toast.error(error.response?.data?.message || 'Failed to save project');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        try {
            await api.delete(`/projects/${id}`);
            toast.success('Project deleted successfully');
            fetchProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
            toast.error('Failed to delete project');
        }
    };

    if (loading) return <Loader fullScreen />;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Track your project progress and budget
                    </p>
                </div>
                <Button onClick={() => handleOpenModal('add')} icon={PlusIcon}>
                    New Project
                </Button>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Project Name</th>
                                <th>Client</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Budget/Rate</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-gray-500">
                                        No projects found. Create your first project.
                                    </td>
                                </tr>
                            ) : (
                                projects.map((project) => (
                                    <tr key={project._id}>
                                        <td>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {project.name}
                                                </p>
                                                <p className="text-sm text-gray-500 truncate max-w-xs">{project.description}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <p className="text-sm text-gray-900 dark:text-white">
                                                {project.client?.name || 'Unknown Client'}
                                            </p>
                                        </td>
                                        <td>
                                            <Badge variant={project.status}>{project.status}</Badge>
                                        </td>
                                        <td>
                                            <Badge variant={project.priority === 'urgent' ? 'danger' : project.priority === 'high' ? 'warning' : 'default'}>
                                                {project.priority}
                                            </Badge>
                                        </td>
                                        <td>
                                            <div>
                                                {project.billingType === 'hourly' ? (
                                                    <p className="text-sm font-medium">{formatCurrency(project.hourlyRate)}/hr</p>
                                                ) : (
                                                    <p className="text-sm font-medium">{formatCurrency(project.budget)} (Fixed)</p>
                                                )}
                                                <p className="text-xs text-gray-500">{project.billingType}</p>
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal('edit', project)}
                                                    className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(project._id)}
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
                title={modalMode === 'add' ? 'Add New Project' : 'Edit Project'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Project Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <Select
                            label="Client"
                            value={formData.client}
                            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                            options={[{ value: '', label: 'Select Client' }, ...clients]}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Select
                            label="Status"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            options={[
                                { value: 'planning', label: 'Planning' },
                                { value: 'in-progress', label: 'In Progress' },
                                { value: 'on-hold', label: 'On Hold' },
                                { value: 'completed', label: 'Completed' },
                                { value: 'cancelled', label: 'Cancelled' }
                            ]}
                        />
                        <Select
                            label="Priority"
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                            options={[
                                { value: 'low', label: 'Low' },
                                { value: 'medium', label: 'Medium' },
                                { value: 'high', label: 'High' },
                                { value: 'urgent', label: 'Urgent' }
                            ]}
                        />
                        <Select
                            label="Billing Type"
                            value={formData.billingType}
                            onChange={(e) => setFormData({ ...formData, billingType: e.target.value })}
                            options={[
                                { value: 'hourly', label: 'Hourly' },
                                { value: 'fixed', label: 'Fixed Price' },
                                { value: 'retainer', label: 'Retainer' }
                            ]}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Start Date"
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        />
                        <Input
                            label="End Date"
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.billingType === 'hourly' ? (
                            <Input
                                label="Hourly Rate"
                                type="number"
                                min="0"
                                value={formData.hourlyRate}
                                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                            />
                        ) : (
                            <Input
                                label="Total Budget"
                                type="number"
                                min="0"
                                value={formData.budget}
                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                            />
                        )}
                    </div>

                    <div>
                        <label className="label">Description</label>
                        <textarea
                            className="input min-h-[100px]"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                            {modalMode === 'add' ? 'Create Project' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Projects;
