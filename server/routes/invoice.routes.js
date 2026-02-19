const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice.model');
const Client = require('../models/Client.model');
const { protect } = require('../middleware/auth.middleware');

// @route   GET /api/invoices
// @desc    Get all invoices for logged in user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const { status, client } = req.query;
        const filter = { user: req.user.id };

        if (status) filter.status = status;
        if (client) filter.client = client;

        const invoices = await Invoice.find(filter)
            .populate('client', 'name email company')
            .populate('project', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: invoices.length,
            invoices
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/invoices/:id
// @desc    Get single invoice
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const invoice = await Invoice.findOne({ _id: req.params.id, user: req.user.id })
            .populate('client', 'name email company phone address')
            .populate('project', 'name description');

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        res.status(200).json({
            success: true,
            invoice
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/invoices
// @desc    Create new invoice
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const invoice = await Invoice.create({
            ...req.body,
            user: req.user.id
        });

        const populatedInvoice = await Invoice.findById(invoice._id)
            .populate('client', 'name email company')
            .populate('project', 'name');

        res.status(201).json({
            success: true,
            invoice: populatedInvoice
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PUT /api/invoices/:id
// @desc    Update invoice
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        let invoice = await Invoice.findOne({ _id: req.params.id, user: req.user.id });

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        // If marking as paid, update client revenue
        if (req.body.status === 'paid' && invoice.status !== 'paid') {
            await Client.findByIdAndUpdate(invoice.client, {
                $inc: { totalRevenue: invoice.total }
            });
            req.body.paidDate = new Date();
        }

        invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate('client', 'name email company')
            .populate('project', 'name');

        res.status(200).json({
            success: true,
            invoice
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   DELETE /api/invoices/:id
// @desc    Delete invoice
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const invoice = await Invoice.findOne({ _id: req.params.id, user: req.user.id });

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        await Invoice.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Invoice deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/invoices/:id/send
// @desc    Mark invoice as sent
// @access  Private
router.post('/:id/send', protect, async (req, res) => {
    try {
        const invoice = await Invoice.findOne({ _id: req.params.id, user: req.user.id });

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        invoice.status = 'sent';
        await invoice.save();

        res.status(200).json({
            success: true,
            invoice
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
