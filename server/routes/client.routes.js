const express = require('express');
const router = express.Router();
const Client = require('../models/Client.model');
const { protect } = require('../middleware/auth.middleware');

// @route   GET /api/clients
// @desc    Get all clients for logged in user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const clients = await Client.find({ user: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: clients.length,
            clients
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/clients/:id
// @desc    Get single client
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const client = await Client.findOne({ _id: req.params.id, user: req.user.id });

        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        res.status(200).json({
            success: true,
            client
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/clients
// @desc    Create new client
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const client = await Client.create({
            ...req.body,
            user: req.user.id
        });

        res.status(201).json({
            success: true,
            client
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PUT /api/clients/:id
// @desc    Update client
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        let client = await Client.findOne({ _id: req.params.id, user: req.user.id });

        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        client = await Client.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            client
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   DELETE /api/clients/:id
// @desc    Delete client
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const client = await Client.findOne({ _id: req.params.id, user: req.user.id });

        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        await Client.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Client deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
