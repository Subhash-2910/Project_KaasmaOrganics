const mongoose = require('mongoose');
const validator = require('validator');

const paymentSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    paymentId: {
        type: String,
        required: true,
        unique: true,
        default: function() {
            return `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        }
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['cod', 'upi', 'card']
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    transactionId: {
        type: String,
        sparse: true
    },
    upiId: {
        type: String,
        required: function() {
            return this.paymentMethod === 'upi';
        }
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    failureReason: {
        type: String,
        maxlength: 500
    }
}, {
    timestamps: true
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;