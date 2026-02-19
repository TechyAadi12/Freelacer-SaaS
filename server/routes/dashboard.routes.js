const express = require('express');
const router = express.Router();
const Client = require('../models/Client.model');
const Project = require('../models/Project.model');
const Invoice = require('../models/Invoice.model');
const TimeEntry = require('../models/TimeEntry.model');
const Payment = require('../models/Payment.model');
const { protect } = require('../middleware/auth.middleware');

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
    try {
        const userId = req.user.id;

        // Get counts
        const totalClients = await Client.countDocuments({ user: userId, status: 'active' });
        const totalProjects = await Project.countDocuments({ user: userId });
        const activeProjects = await Project.countDocuments({ user: userId, status: 'in-progress' });

        // Get revenue stats
        const paidInvoices = await Invoice.find({ user: userId, status: 'paid' });
        const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);

        const pendingInvoices = await Invoice.find({ user: userId, status: { $in: ['sent', 'overdue'] } });
        const pendingRevenue = pendingInvoices.reduce((sum, inv) => sum + inv.total, 0);

        // Get this month's revenue
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const monthlyInvoices = await Invoice.find({
            user: userId,
            status: 'paid',
            paidDate: { $gte: startOfMonth }
        });
        const monthlyRevenue = monthlyInvoices.reduce((sum, inv) => sum + inv.total, 0);

        // Get time tracking stats
        const totalTimeEntries = await TimeEntry.find({ user: userId });
        const totalHoursTracked = totalTimeEntries.reduce((sum, entry) => sum + (entry.duration / 60), 0);

        // Get recent activity
        const recentInvoices = await Invoice.find({ user: userId })
            .populate('client', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        const recentProjects = await Project.find({ user: userId })
            .populate('client', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            stats: {
                totalClients,
                totalProjects,
                activeProjects,
                totalRevenue,
                pendingRevenue,
                monthlyRevenue,
                totalHoursTracked: Math.round(totalHoursTracked * 10) / 10,
                recentInvoices,
                recentProjects
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/dashboard/revenue-chart
// @desc    Get revenue data for charts (last 6 months)
// @access  Private
router.get('/revenue-chart', protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const months = [];
        const revenueData = [];

        // Get last 6 months
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
            const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            const monthName = date.toLocaleString('default', { month: 'short' });
            months.push(monthName);

            const monthInvoices = await Invoice.find({
                user: userId,
                status: 'paid',
                paidDate: { $gte: monthStart, $lte: monthEnd }
            });

            const monthRevenue = monthInvoices.reduce((sum, inv) => sum + inv.total, 0);
            revenueData.push(monthRevenue);
        }

        res.status(200).json({
            success: true,
            data: {
                labels: months,
                revenue: revenueData
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/dashboard/project-status
// @desc    Get project status distribution
// @access  Private
router.get('/project-status', protect, async (req, res) => {
    try {
        const userId = req.user.id;

        const statusCounts = await Project.aggregate([
            { $match: { user: userId } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const statusData = {
            planning: 0,
            'in-progress': 0,
            'on-hold': 0,
            completed: 0,
            cancelled: 0
        };

        statusCounts.forEach(item => {
            statusData[item._id] = item.count;
        });

        res.status(200).json({
            success: true,
            data: statusData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/dashboard/top-clients
// @desc    Get top clients by revenue
// @access  Private
router.get('/top-clients', protect, async (req, res) => {
    try {
        const userId = req.user.id;

        const topClients = await Client.find({ user: userId })
            .sort({ totalRevenue: -1 })
            .limit(5)
            .select('name totalRevenue projectCount');

        res.status(200).json({
            success: true,
            clients: topClients
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
