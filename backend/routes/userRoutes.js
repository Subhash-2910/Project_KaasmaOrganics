const express = require('express');
const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { fullName, email, phone, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { phone }]
        });

        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                message: 'User with this email or phone already exists'
            });
        }

        // Create new user
        const newUser = new User({
            fullName,
            email,
            phone,
            password
        });

        await newUser.save();

        // Generate token
        const token = generateToken(newUser._id);

        // Remove password from output
        newUser.password = undefined;

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: newUser
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide email and password'
            });
        }

        // Find user and include password
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        // Remove password from output
        user.password = undefined;

        res.status(200).json({
            status: 'success',
            token,
            data: {
                user
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Get user profile
router.get('/profile', async (req, res) => {
    try {
        // This would normally require authentication middleware
        // For now, we'll get user by ID from query params
        const userId = req.query.userId;
        
        if (!userId) {
            return res.status(400).json({
                status: 'error',
                message: 'User ID is required'
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Update user profile
router.patch('/profile', async (req, res) => {
    try {
        const userId = req.body.userId;
        
        if (!userId) {
            return res.status(400).json({
                status: 'error',
                message: 'User ID is required'
            });
        }

        // Remove sensitive fields from update
        const allowedUpdates = ['fullName', 'email', 'phone'];
        const updates = {};
        
        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        const user = await User.findByIdAndUpdate(
            userId,
            updates,
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

// Add address to user
router.post('/address', async (req, res) => {
    try {
        const { userId, address } = req.body;
        
        if (!userId) {
            return res.status(400).json({
                status: 'error',
                message: 'User ID is required'
            });
        }

        // If this is the first address or marked as default, make all others non-default
        if (address.isDefault) {
            await User.updateOne(
                { _id: userId },
                { $set: { 'addresses.$[].isDefault': false } }
            );
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $push: { addresses: address } },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                addresses: user.addresses
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

// Update address
router.patch('/address/:addressId', async (req, res) => {
    try {
        const { userId } = req.body;
        const { addressId } = req.params;
        
        if (!userId) {
            return res.status(400).json({
                status: 'error',
                message: 'User ID is required'
            });
        }

        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Find and update the address
        const addressIndex = user.addresses.findIndex(
            addr => addr._id.toString() === addressId
        );

        if (addressIndex === -1) {
            return res.status(404).json({
                status: 'error',
                message: 'Address not found'
            });
        }

        // If setting as default, make all others non-default
        if (req.body.isDefault) {
            user.addresses.forEach(addr => {
                addr.isDefault = false;
            });
        }

        // Update the address
        Object.assign(user.addresses[addressIndex], req.body);
        await user.save();

        res.status(200).json({
            status: 'success',
            data: {
                addresses: user.addresses
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

// Delete address
router.delete('/address/:addressId', async (req, res) => {
    try {
        const { userId } = req.query;
        const { addressId } = req.params;
        
        if (!userId) {
            return res.status(400).json({
                status: 'error',
                message: 'User ID is required'
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { addresses: { _id: addressId } } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Address deleted successfully',
            data: {
                addresses: user.addresses
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

module.exports = router;
