const express = require('express');
const router = express.Router();
const Project = require('../models/Project.model');
const Client = require('../models/Client.model');
const { protect } = require('../middleware/auth.middleware');

// @route   GET /api/projects
// @desc    Get all projects for logged in user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const { status, client } = req.query;
        const filter = { user: req.user.id };

        if (status) filter.status = status;
        if (client) filter.client = client;

        const projects = await Project.find(filter)
            .populate('client', 'name email company')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: projects.length,
            projects
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, user: req.user.id })
            .populate('client', 'name email company phone');

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        res.status(200).json({
            success: true,
            project
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/projects
// @desc    Create new project
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const project = await Project.create({
            ...req.body,
            user: req.user.id
        });

        // Update client project count
        await Client.findByIdAndUpdate(req.body.client, {
            $inc: { projectCount: 1 }
        });

        const populatedProject = await Project.findById(project._id)
            .populate('client', 'name email company');

        res.status(201).json({
            success: true,
            project: populatedProject
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        let project = await Project.findOne({ _id: req.params.id, user: req.user.id });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        project = await Project.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate('client', 'name email company');

        res.status(200).json({
            success: true,
            project
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, user: req.user.id });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // Update client project count
        await Client.findByIdAndUpdate(project.client, {
            $inc: { projectCount: -1 }
        });

        await Project.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Project deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
