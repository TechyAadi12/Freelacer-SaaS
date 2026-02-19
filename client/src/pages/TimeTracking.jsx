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
import { PlayIcon, StopIcon, TrashIcon, ClockIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const TimeTracking = () => {
    const [timeEntries, setTimeEntries] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTimer, setActiveTimer] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);

    // Fetch initial data
    useEffect(() => {
        fetchTimeEntries();
        fetchProjects();
    }, []);

    // Timer interval
    useEffect(() => {
        let interval;
        if (activeTimer) {
            interval = setInterval(() => {
                const start = new Date(activeTimer.startTime).getTime();
                const now = new Date().getTime();
                setElapsedTime(Math.floor((now - start) / 1000));
            }, 1000);
        } else {
            setElapsedTime(0);
        }
        return () => clearInterval(interval);
    }, [activeTimer]);

    const fetchTimeEntries = async () => {
        try {
            const response = await api.get('/time-entries');
            setTimeEntries(response.data.timeEntries);

            // Check if there's a running timer (no endTime)
            const running = response.data.timeEntries.find(entry => !entry.endTime);
            if (running) {
                setActiveTimer(running);
            }
        } catch (error) {
            console.error('Error fetching time entries:', error);
            toast.error('Failed to load time entries');
        } finally {
            setLoading(false);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await api.get('/projects');
            setProjects(response.data.projects.map(p => ({
                value: p._id,
                label: p.name,
                client: p.client?.name
            })));
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const startTimer = async (projectId, description) => {
        if (!projectId) {
            toast.error('Please select a project');
            return;
        }
        if (!description) {
            toast.error('Please enter a description');
            return;
        }

        try {
            const response = await api.post('/time-entries', {
                project: projectId,
                description,
                startTime: new Date()
            });
            setActiveTimer(response.data.timeEntry);
            toast.success('Timer started');
            fetchTimeEntries(); // Refresh list to show new entry
        } catch (error) {
            console.error('Error starting timer:', error);
            toast.error('Failed to start timer');
        }
    };

    const stopTimer = async () => {
        if (!activeTimer) return;

        try {
            await api.post(`/time-entries/${activeTimer._id}/stop`);
            setActiveTimer(null);
            toast.success('Timer stopped');
            fetchTimeEntries();
        } catch (error) {
            console.error('Error stopping timer:', error);
            toast.error('Failed to stop timer');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this time entry?')) return;
        try {
            await api.delete(`/time-entries/${id}`);
            toast.success('Time entry deleted');
            fetchTimeEntries();
            if (activeTimer?._id === id) setActiveTimer(null);
        } catch (error) {
            console.error('Error deleting time entry:', error);
            toast.error('Failed to delete time entry');
        }
    };

    const formatElapsedTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const formatDuration = (minutes) => {
        const h = Math.floor(minutes / 60);
        const m = Math.round(minutes % 60);
        return `${h}h ${m}m`;
    };

    if (loading) return <Loader fullScreen />;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Time Tracking</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Track hours and generate invoices
                    </p>
                </div>
            </div>

            {/* Timer Card */}
            <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-4">
                    <div className="flex-1 w-full space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
                        <div className="flex-1">
                            <label className="text-gray-400 text-xs uppercase font-semibold">Description</label>
                            <input
                                type="text"
                                placeholder="What are you working on?"
                                className="bg-transparent border-b border-gray-600 w-full focus:outline-none focus:border-primary-500 py-2 text-white placeholder-gray-500"
                                id="timer-description"
                                disabled={!!activeTimer}
                                defaultValue={activeTimer?.description || ''}
                            />
                        </div>
                        <div className="w-full md:w-64">
                            <label className="text-gray-400 text-xs uppercase font-semibold">Project</label>
                            {activeTimer ? (
                                <div className="py-2 font-medium">{activeTimer.project?.name || 'Unknown Project'}</div>
                            ) : (
                                <select
                                    className="bg-transparent border-b border-gray-600 w-full focus:outline-none focus:border-primary-500 py-2 text-white [&>option]:text-black"
                                    id="timer-project"
                                >
                                    <option value="">Select Project</option>
                                    {projects.map(p => (
                                        <option key={p.value} value={p.value}>{p.label}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-4xl font-mono font-bold tracking-wider">
                            {activeTimer ? formatElapsedTime(elapsedTime) : '00:00:00'}
                        </div>
                        {activeTimer ? (
                            <button
                                onClick={stopTimer}
                                className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors shadow-lg shadow-red-500/30"
                            >
                                <StopIcon className="w-6 h-6 text-white" />
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    const desc = document.getElementById('timer-description').value;
                                    const proj = document.getElementById('timer-project').value;
                                    startTimer(proj, desc);
                                }}
                                className="w-12 h-12 rounded-full bg-primary-500 hover:bg-primary-600 flex items-center justify-center transition-colors shadow-lg shadow-primary-500/30 pl-1"
                            >
                                <PlayIcon className="w-6 h-6 text-white" />
                            </button>
                        )}
                    </div>
                </div>
            </Card>

            {/* Time Entries List */}
            <Card>
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Project</th>
                                <th>Duration</th>
                                <th>Amount</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {timeEntries.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-gray-500">
                                        No time entries found. Start the timer to track your work.
                                    </td>
                                </tr>
                            ) : (
                                timeEntries.map((entry) => (
                                    <tr key={entry._id} className={!entry.endTime ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}>
                                        <td>
                                            {formatDate(entry.startTime)}
                                            {!entry.endTime && <span className="ml-2 text-xs text-primary-600 font-bold animate-pulse">LIVE</span>}
                                        </td>
                                        <td>
                                            <p className="font-medium text-gray-900 dark:text-white">{entry.description}</p>
                                        </td>
                                        <td>
                                            <Badge variant="outline">{entry.project?.name || 'Unknown'}</Badge>
                                        </td>
                                        <td>
                                            {entry.endTime ? formatDuration(entry.duration) : '-'}
                                        </td>
                                        <td>
                                            {entry.endTime ? formatCurrency(entry.amount) : '-'}
                                        </td>
                                        <td className="text-right">
                                            <button
                                                onClick={() => handleDelete(entry._id)}
                                                className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                                                disabled={!entry.endTime && activeTimer?._id === entry._id}
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default TimeTracking;
