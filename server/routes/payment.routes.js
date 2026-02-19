const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment.model');
const Invoice = require('../models/Invoice.model');
const Client = require('../models/Client.model');
const { protect } = require('../middleware/auth.middleware');

// @route   GET /api/payments
// @desc    Get all payments for logged in user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const payments = await Payment.find({ user: req.user.id })
            .populate('invoice', 'invoiceNumber total')
            .populate('client', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: payments.length,
            payments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/payments/create-payment-intent
// @desc    Create Stripe payment intent
// @access  Private
router.post('/create-payment-intent', protect, async (req, res) => {
    try {
        const { invoiceId, amount, currency = 'usd' } = req.body;

        const invoice = await Invoice.findOne({ _id: invoiceId, user: req.user.id });

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: currency.toLowerCase(),
            metadata: {
                invoiceId: invoice._id.toString(),
                userId: req.user.id.toString()
            }
        });

        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/payments/confirm
// @desc    Confirm payment and update invoice
// @access  Private
router.post('/confirm', protect, async (req, res) => {
    try {
        const { invoiceId, paymentIntentId, amount } = req.body;

        const invoice = await Invoice.findOne({ _id: invoiceId, user: req.user.id });

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        // Create payment record
        const payment = await Payment.create({
            user: req.user.id,
            invoice: invoiceId,
            client: invoice.client,
            amount,
            paymentMethod: 'stripe',
            status: 'completed',
            stripePaymentIntentId: paymentIntentId,
            paymentDate: new Date()
        });

        // Update invoice status
        invoice.status = 'paid';
        invoice.paidDate = new Date();
        invoice.paymentMethod = 'stripe';
        await invoice.save();

        // Update client revenue
        await Client.findByIdAndUpdate(invoice.client, {
            $inc: { totalRevenue: amount }
        });

        res.status(200).json({
            success: true,
            payment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/payments/manual
// @desc    Record manual payment (bank transfer, cash, etc.)
// @access  Private
router.post('/manual', protect, async (req, res) => {
    try {
        const { invoiceId, amount, paymentMethod, transactionId, notes } = req.body;

        const invoice = await Invoice.findOne({ _id: invoiceId, user: req.user.id });

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        // Create payment record
        const payment = await Payment.create({
            user: req.user.id,
            invoice: invoiceId,
            client: invoice.client,
            amount,
            paymentMethod,
            status: 'completed',
            transactionId,
            notes,
            paymentDate: new Date()
        });

        // Update invoice status
        invoice.status = 'paid';
        invoice.paidDate = new Date();
        invoice.paymentMethod = paymentMethod;
        await invoice.save();

        // Update client revenue
        await Client.findByIdAndUpdate(invoice.client, {
            $inc: { totalRevenue: amount }
        });

        res.status(201).json({
            success: true,
            payment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
