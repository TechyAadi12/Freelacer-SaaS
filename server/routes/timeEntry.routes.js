const express = require('express');
const router = express.Router();
const TimeEntry = require('../models/TimeEntry.model');
const Project = require('../models/Project.model');
const { protect } = require('../middleware/auth.middleware');

// @route   GET /api/time-entries
// @desc    Get all time entries for logged in user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const { project, client, startDate, endDate } = req.query;
        const filter = { user: req.user.id };

        if (project) filter.project = project;
        if (client) filter.client = client;
        if (startDate || endDate) {
            filter.startTime = {};
            if (startDate) filter.startTime.$gte = new Date(startDate);
            if (endDate) filter.startTime.$lte = new Date(endDate);
        }

        const timeEntries = await TimeEntry.find(filter)
            .populate('project', 'name')
            .populate('client', 'name')
            .sort({ startTime: -1 });

        res.status(200).json({
            success: true,
            count: timeEntries.length,
            timeEntries
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/time-entries/:id
// @desc    Get single time entry
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const timeEntry = await TimeEntry.findOne({ _id: req.params.id, user: req.user.id })
            .populate('project', 'name hourlyRate')
            .populate('client', 'name');

        if (!timeEntry) {
            return res.status(404).json({
                success: false,
                message: 'Time entry not found'
            });
        }

        res.status(200).json({
            success: true,
            timeEntry
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/time-entries
// @desc    Create new time entry
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        // If hourlyRate is not provided, fetch from project
        let entryData = { ...req.body, user: req.user.id };

        if (!entryData.hourlyRate && entryData.project) {
            const projectDoc = await Project.findById(entryData.project);
            if (projectDoc) {
                entryData.hourlyRate = projectDoc.hourlyRate;
            }
        }

        const timeEntry = await TimeEntry.create(entryData);

        // Update project total hours and earned
        if (timeEntry.endTime) {
            await Project.findByIdAndUpdate(timeEntry.project, {
                $inc: {
                    totalHours: timeEntry.duration / 60,
                    totalEarned: timeEntry.amount
                }
            });
        }

        const populatedTimeEntry = await TimeEntry.findById(timeEntry._id)
            .populate('project', 'name')
            .populate('client', 'name');

        res.status(201).json({
            success: true,
            timeEntry: populatedTimeEntry
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PUT /api/time-entries/:id
// @desc    Update time entry
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        let timeEntry = await TimeEntry.findOne({ _id: req.params.id, user: req.user.id });

        if (!timeEntry) {
            return res.status(404).json({
                success: false,
                message: 'Time entry not found'
            });
        }

        const oldDuration = timeEntry.duration;
        const oldAmount = timeEntry.amount;

        timeEntry = await TimeEntry.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate('project', 'name')
            .populate('client', 'name');

        // Update project totals
        const durationDiff = (timeEntry.duration - oldDuration) / 60;
        const amountDiff = timeEntry.amount - oldAmount;

        await Project.findByIdAndUpdate(timeEntry.project, {
            $inc: {
                totalHours: durationDiff,
                totalEarned: amountDiff
            }
        });

        res.status(200).json({
            success: true,
            timeEntry
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   DELETE /api/time-entries/:id
// @desc    Delete time entry
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const timeEntry = await TimeEntry.findOne({ _id: req.params.id, user: req.user.id });

        if (!timeEntry) {
            return res.status(404).json({
                success: false,
                message: 'Time entry not found'
            });
        }

        // Update project totals
        await Project.findByIdAndUpdate(timeEntry.project, {
            $inc: {
                totalHours: -(timeEntry.duration / 60),
                totalEarned: -timeEntry.amount
            }
        });

        await TimeEntry.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Time entry deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/time-entries/:id/stop
// @desc    Stop a running timer
// @access  Private
router.post('/:id/stop', protect, async (req, res) => {
    try {
        const timeEntry = await TimeEntry.findOne({ _id: req.params.id, user: req.user.id });

        if (!timeEntry) {
            return res.status(404).json({
                success: false,
                message: 'Time entry not found'
            });
        }

        if (timeEntry.endTime) {
            return res.status(400).json({
                success: false,
                message: 'Timer already stopped'
            });
        }

        timeEntry.endTime = new Date();
        await timeEntry.save();

        // Update project totals
        await Project.findByIdAndUpdate(timeEntry.project, {
            $inc: {
                totalHours: timeEntry.duration / 60,
                totalEarned: timeEntry.amount
            }
        });

        res.status(200).json({
            success: true,
            timeEntry
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
