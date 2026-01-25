const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative']
    },
    image: {
        type: String,
        required: [true, 'Product image is required']
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
        enum: ['fruits', 'vegetables', 'powders', 'snacks', 'other']
    },
    weightOptions: [{
        weight: {
            type: String,
            required: true,
            enum: ['50g', '100g', '250g', '500g', '1kg']
        },
        price: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    stock: {
        type: Number,
        default: 100,
        min: [0, 'Stock cannot be negative']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    rating: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true
});

// Index for search functionality
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
