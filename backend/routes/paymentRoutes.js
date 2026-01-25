const express = require('express');
const Payment = require('../model/paymentModel');
const Order = require('../model/orderModel');
const router = express.Router();

// Create new payment
router.post('/', async (req, res, next) => {
    try {
        const { orderId, paymentMethod, upiId } = req.body;

        // Get order details
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                status: 'error',
                message: 'Order not found'
            });
        }

        // Create payment record
        const paymentData = {
            orderId,
            amount: order.totalAmount,
            paymentMethod,
            upiId: paymentMethod === 'upi' ? upiId : undefined
        };

        const newPayment = new Payment(paymentData);
        await newPayment.save();

        // Update order payment status
        await Order.findByIdAndUpdate(orderId, {
            paymentStatus: paymentMethod === 'cod' ? 'pending' : 'processing',
            paymentMethod,
            upiId: paymentMethod === 'upi' ? upiId : undefined
        });

        res.status(201).json({
            status: 'success',
            data: newPayment
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

// Process payment
router.post('/:paymentId/process', async (req, res, next) => {
    try {
        const payment = await Payment.findById(req.params.paymentId).populate('orderId');
        
        if (!payment) {
            return res.status(404).json({
                status: 'error',
                message: 'Payment not found'
            });
        }

        // Simulate payment processing
        if (payment.paymentMethod === 'cod') {
            // For COD, mark as completed immediately
            payment.paymentStatus = 'completed';
            payment.transactionId = `COD-${Date.now()}`;
        } else if (payment.paymentMethod === 'upi') {
            // Simulate UPI payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));
            payment.paymentStatus = 'completed';
            payment.transactionId = `UPI-${Date.now()}`;
        }

        await payment.save();

        // Update order status
        await Order.findByIdAndUpdate(payment.orderId._id, {
            paymentStatus: 'paid',
            orderStatus: 'confirmed'
        });

        res.status(200).json({
            status: 'success',
            message: 'Payment processed successfully',
            data: payment
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Get payment by ID
router.get('/:id', async (req, res, next) => {
    try {
        const payment = await Payment.findById(req.params.id)
            .populate('orderId');
        
        if (!payment) {
            return res.status(404).json({
                status: 'error',
                message: 'Payment not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: payment
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Get payments by order ID
router.get('/order/:orderId', async (req, res, next) => {
    try {
        const payments = await Payment.find({ orderId: req.params.orderId })
            .populate('orderId');

        res.status(200).json({
            status: 'success',
            results: payments.length,
            data: payments
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Get all payments (Admin only)
router.get('/', async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const method = req.query.method;

        // Build query
        let query = {};
        
        if (status) {
            query.paymentStatus = status;
        }
        
        if (method) {
            query.paymentMethod = method;
        }

        const payments = await Payment.find(query)
            .populate('orderId', 'orderId totalAmount')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const total = await Payment.countDocuments(query);

        res.status(200).json({
            status: 'success',
            results: payments.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: payments
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Update payment status
router.patch('/:id/status', async (req, res, next) => {
    try {
        const { paymentStatus, failureReason } = req.body;
        
        const payment = await Payment.findByIdAndUpdate(
            req.params.id,
            { 
                paymentStatus,
                failureReason: paymentStatus === 'failed' ? failureReason : undefined
            },
            { new: true, runValidators: true }
        ).populate('orderId');

        if (!payment) {
            return res.status(404).json({
                status: 'error',
                message: 'Payment not found'
            });
        }

        // Update order payment status
        await Order.findByIdAndUpdate(payment.orderId._id, {
            paymentStatus: paymentStatus === 'completed' ? 'paid' : paymentStatus
        });

        res.status(200).json({
            status: 'success',
            data: payment
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

// Refund payment
router.post('/:paymentId/refund', async (req, res, next) => {
    try {
        const payment = await Payment.findById(req.params.paymentId).populate('orderId');
        
        if (!payment) {
            return res.status(404).json({
                status: 'error',
                message: 'Payment not found'
            });
        }

        if (payment.paymentStatus !== 'completed') {
            return res.status(400).json({
                status: 'error',
                message: 'Only completed payments can be refunded'
            });
        }

        payment.paymentStatus = 'refunded';
        await payment.save();

        // Update order status
        await Order.findByIdAndUpdate(payment.orderId._id, {
            paymentStatus: 'refunded',
            orderStatus: 'cancelled'
        });

        res.status(200).json({
            status: 'success',
            message: 'Payment refunded successfully',
            data: payment
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

module.exports = router;
