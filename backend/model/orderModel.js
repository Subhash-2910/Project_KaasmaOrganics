const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    weight: {
        type: String,
        required: true,
        enum: ['50g', '100g', '250g', '500g', '1kg']
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
});

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
        default: function() {
            return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        }
    },
    trackingId: {
        type: String,
        required: true,
        unique: true,
        default: function() {
            return `TRK${Date.now()}`;
        }
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [orderItemSchema],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    shippingAddress: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        }
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['cod', 'upi', 'card']
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    orderStatus: {
        type: String,
        enum: ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'confirmed'
    },
    upiId: {
        type: String,
        required: function() {
            return this.paymentMethod === 'upi';
        }
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    estimatedDelivery: {
        type: Date,
        default: function() {
            const deliveryDate = new Date();
            deliveryDate.setDate(deliveryDate.getDate() + 5);
            return deliveryDate;
        }
    },
    notes: {
        type: String,
        maxlength: 500
    }
}, {
    timestamps: true
});

// Index for searching orders
orderSchema.index({ orderId: 1, trackingId: 1, userId: 1 });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
