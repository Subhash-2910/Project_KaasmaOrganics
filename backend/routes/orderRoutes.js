const express = require('express');
const mongoose = require('mongoose');
const Order = require('../model/orderModel');
const User = require('../model/userModel');
const Product = require('../model/productModel');
const router = express.Router();

// Create new order
router.post('/', async (req, res) => {
    try {
        const { userId, items, shippingAddress, paymentMethod, upiId } = req.body;

        // Validate required fields
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Order items are required'
            });
        }

        if (!shippingAddress) {
            return res.status(400).json({
                status: 'error',
                message: 'Shipping address is required'
            });
        }

        if (!paymentMethod) {
            return res.status(400).json({
                status: 'error',
                message: 'Payment method is required'
            });
        }

        // Handle userId - find or create user for guest orders
        let orderUserId;
        if (userId === 'guest' || !userId) {
            // Find existing user by email or phone, or create a new guest user
            const { email, phone, name } = shippingAddress;
            
            // Validate email and phone for user lookup/creation
            if (!email && !phone) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email or phone is required in shipping address'
                });
            }

            let user = null;
            
            // Try to find existing user
            if (email) {
                user = await User.findOne({ email: email.toLowerCase() });
            }
            if (!user && phone) {
                user = await User.findOne({ phone });
            }

            if (!user) {
                // Create a guest user account
                // Generate a valid email if not provided
                const userEmail = email?.toLowerCase() || `guest_${Date.now()}_${Math.random().toString(36).substring(7)}@guest.temp`;
                // Generate a valid phone if not provided (10 digits)
                const userPhone = phone || `1${String(Date.now()).slice(-9)}`;
                // Generate a temporary password
                const tempPassword = `Guest${Date.now()}${Math.random().toString(36).substring(7)}`;
                
                try {
                    user = new User({
                        fullName: name || 'Guest User',
                        email: userEmail,
                        phone: userPhone,
                        password: tempPassword
                    });
                    await user.save();
                    console.log(`✅ Guest user created: ${user._id} - ${userEmail}`);
                } catch (userError) {
                    // If user creation fails (e.g., duplicate email), try to find again
                    user = await User.findOne({
                        $or: [{ email: userEmail }, { phone: userPhone }]
                    });
                    if (!user) {
                        console.error('Failed to create or find user:', userError);
                        return res.status(400).json({
                            status: 'error',
                            message: `Failed to create user account: ${userError.message}`
                        });
                    }
                    console.log(`✅ Found existing user: ${user._id} - ${user.email}`);
                }
            } else {
                console.log(`✅ Using existing user: ${user._id} - ${user.email}`);
            }
            orderUserId = user._id;
        } else {
            // Validate userId is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid userId format'
                });
            }
            // Verify user exists
            const userExists = await User.findById(userId);
            if (!userExists) {
                return res.status(404).json({
                    status: 'error',
                    message: 'User not found'
                });
            }
            orderUserId = userId;
        }

        // Validate and process items
        const processedItems = [];
        let totalAmount = 0;

        for (const item of items) {
            // Validate required fields
            if (!item.productId) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Product ID is required for all items'
                });
            }

            if (!item.quantity || item.quantity < 1) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Valid quantity (min 1) is required for all items'
                });
            }

            if (!item.weight) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Weight is required for all items'
                });
            }

            if (!item.name) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Product name is required for all items'
                });
            }

            // Validate and convert productId to ObjectId
            let productId;
            let product;
            
            // Strategy 1: Try to find by productId if it's a valid ObjectId
            if (item.productId && mongoose.Types.ObjectId.isValid(item.productId)) {
                try {
                    productId = new mongoose.Types.ObjectId(item.productId);
                    product = await Product.findById(productId);
                } catch (err) {
                    console.error('Error finding product by ID:', err);
                }
            }
            
            // Strategy 2: If not found, try to find by name (exact match first)
            if (!product && item.name) {
                // Try exact match (case insensitive)
                product = await Product.findOne({ 
                    name: { $regex: new RegExp(`^${item.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
                });
                if (product) {
                    productId = product._id;
                }
            }
            
            // Strategy 3: If still not found, try partial name match
            if (!product && item.name) {
                // Remove common words and try partial match
                const searchName = item.name
                    .replace(/\b(Organic|Powder|Chips|Dried)\b/gi, '')
                    .trim();
                
                if (searchName.length > 2) {
                    product = await Product.findOne({ 
                        name: { $regex: new RegExp(searchName, 'i') }
                    });
                    if (product) {
                        productId = product._id;
                        console.log(`Product found by partial match: "${item.name}" -> "${product.name}"`);
                    }
                }
            }
            
            // Strategy 4: Try to find by name containing key words
            if (!product && item.name) {
                // Extract key words from product name
                const keywords = item.name
                    .split(/\s+/)
                    .filter(word => word.length > 3 && !['Organic', 'Powder', 'Chips', 'Dried'].includes(word));
                
                if (keywords.length > 0) {
                    const searchRegex = new RegExp(keywords.join('|'), 'i');
                    product = await Product.findOne({ 
                        name: searchRegex
                    });
                    if (product) {
                        productId = product._id;
                        console.log(`Product found by keyword match: "${item.name}" -> "${product.name}"`);
                    }
                }
            }
            
            // Strategy 5: List available products for debugging
            if (!product || !productId) {
                // Get a list of available products for better error message
                const availableProducts = await Product.find({ isActive: true })
                    .select('name')
                    .limit(10)
                    .lean();
                
                const productNames = availableProducts.map(p => p.name).join(', ');
                
                return res.status(400).json({
                    status: 'error',
                    message: `Product not found: "${item.name}" (ID: ${item.productId}). Available products include: ${productNames || 'None found'}. Please ensure the product exists in the database.`
                });
            }
            
            // Verify product is active
            if (!product.isActive) {
                return res.status(400).json({
                    status: 'error',
                    message: `Product ${item.name} is not available`
                });
            }

            // Validate price is a number
            const price = parseFloat(item.price);
            if (isNaN(price) || price < 0) {
                return res.status(400).json({
                    status: 'error',
                    message: `Invalid price for item: ${item.name}`
                });
            }

            // Validate quantity is a number
            const quantity = parseInt(item.quantity);
            if (isNaN(quantity) || quantity < 1) {
                return res.status(400).json({
                    status: 'error',
                    message: `Invalid quantity for item: ${item.name}`
                });
            }

            // Validate weight enum
            const validWeights = ['50g', '100g', '250g', '500g', '1kg'];
            if (!validWeights.includes(item.weight)) {
                return res.status(400).json({
                    status: 'error',
                    message: `Invalid weight for item: ${item.name}. Must be one of: ${validWeights.join(', ')}`
                });
            }

            processedItems.push({
                productId,
                name: item.name,
                weight: item.weight,
                quantity,
                price
            });

            totalAmount += price * quantity;
        }

        // Validate totalAmount
        if (isNaN(totalAmount) || totalAmount <= 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid total amount calculated'
            });
        }

        // Validate UPI ID if payment method is UPI
        if (paymentMethod === 'upi' && !upiId) {
            return res.status(400).json({
                status: 'error',
                message: 'UPI ID is required for UPI payments'
            });
        }

        // Create order data
        const orderData = {
            userId: orderUserId,
            items: processedItems,
            totalAmount: Math.round(totalAmount * 100) / 100, // Round to 2 decimal places
            shippingAddress,
            paymentMethod,
            paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
            orderStatus: 'confirmed',
            ...(paymentMethod === 'upi' && { upiId })
        };

        console.log('Creating order with data:', {
            userId: orderUserId,
            itemsCount: processedItems.length,
            totalAmount: orderData.totalAmount,
            paymentMethod
        });

        const newOrder = new Order(orderData);
        await newOrder.save();

        console.log(`✅ Order created successfully: ${newOrder.orderId} (ID: ${newOrder._id})`);

        // Populate the order before sending response
        await newOrder.populate('userId', 'fullName email phone');
        await newOrder.populate('items.productId', 'name image');

        res.status(201).json({
            status: 'success',
            data: newOrder
        });
    } catch (error) {
        console.error('❌ Order creation error:', error);
        console.error('Error stack:', error.stack);
        
        // Provide more detailed error message
        let errorMessage = error.message || 'Failed to create order';
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message).join(', ');
            errorMessage = `Validation error: ${validationErrors}`;
        }
        
        // Handle duplicate key errors
        if (error.code === 11000) {
            errorMessage = 'Order with this ID already exists. Please try again.';
        }
        
        res.status(400).json({
            status: 'error',
            message: errorMessage
        });
    }
});

// Get all orders (with filtering)
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const userId = req.query.userId;

        // Build query
        let query = {};
        
        if (status) {
            query.orderStatus = status;
        }
        
        if (userId) {
            query.userId = userId;
        }

        const orders = await Order.find(query)
            .populate('userId', 'fullName email phone')
            .populate('items.productId', 'name image')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const total = await Order.countDocuments(query);

        res.status(200).json({
            status: 'success',
            results: orders.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Get single order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('userId', 'fullName email phone')
            .populate('items.productId', 'name image');
        
        if (!order) {
            return res.status(404).json({
                status: 'error',
                message: 'Order not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: order
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Get order by Order ID
router.get('/order/:orderId', async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId })
            .populate('userId', 'fullName email phone')
            .populate('items.productId', 'name image');
        
        if (!order) {
            return res.status(404).json({
                status: 'error',
                message: 'Order not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: order
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Track order by Tracking ID
router.get('/track/:trackingId', async (req, res) => {
    try {
        const order = await Order.findOne({ trackingId: req.params.trackingId })
            .populate('userId', 'fullName email phone')
            .populate('items.productId', 'name image');
        
        if (!order) {
            return res.status(404).json({
                status: 'error',
                message: 'Order not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: order
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
    try {
        const { orderStatus } = req.body;
        
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { orderStatus },
            { new: true, runValidators: true }
        ).populate('userId', 'fullName email phone');

        if (!order) {
            return res.status(404).json({
                status: 'error',
                message: 'Order not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: order
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

// Cancel order
router.patch('/:id/cancel', async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { 
                orderStatus: 'cancelled',
                paymentStatus: 'refunded'
            },
            { new: true }
        ).populate('userId', 'fullName email phone');

        if (!order) {
            return res.status(404).json({
                status: 'error',
                message: 'Order not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: order
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

// Get user's orders
router.get('/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const orders = await Order.find({ userId })
            .populate('items.productId', 'name image')
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            results: orders.length,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

module.exports = router;
