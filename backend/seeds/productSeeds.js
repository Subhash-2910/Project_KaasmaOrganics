const mongoose = require('mongoose');
const Product = require('../model/productModel');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Sample products data
const sampleProducts = [
    {
        name: 'Organic Turmeric Powder',
        description: 'Pure organic turmeric powder made from high-quality turmeric roots. Rich in curcumin and natural antioxidants.',
        price: 120,
        image: '/images/products/turmeric-powder.jpg',
        category: 'powders',
        weightOptions: [
            { weight: '50g', price: 60 },
            { weight: '100g', price: 120 },
            { weight: '250g', price: 280 },
            { weight: '500g', price: 550 }
        ],
        stock: 200,
        tags: ['turmeric', 'powder', 'organic', 'spice', 'antioxidant']
    },
    {
        name: 'Organic Amla Powder',
        description: 'Dried Indian gooseberry powder, rich in Vitamin C. Boosts immunity and improves digestion.',
        price: 150,
        image: '/images/products/amla-powder.jpg',
        category: 'powders',
        weightOptions: [
            { weight: '50g', price: 75 },
            { weight: '100g', price: 150 },
            { weight: '250g', price: 350 },
            { weight: '500g', price: 680 }
        ],
        stock: 150,
        tags: ['amla', 'powder', 'vitamin-c', 'immunity', 'organic']
    },
    {
        name: 'Organic Moringa Powder',
        description: 'Nutrient-dense moringa leaf powder. Contains vitamins, minerals, and antioxidants.',
        price: 180,
        image: '/images/products/moringa-powder.jpg',
        category: 'powders',
        weightOptions: [
            { weight: '50g', price: 90 },
            { weight: '100g', price: 180 },
            { weight: '250g', price: 420 },
            { weight: '500g', price: 800 }
        ],
        stock: 180,
        tags: ['moringa', 'powder', 'superfood', 'nutrients', 'organic']
    },
    {
        name: 'Dried Mango Slices',
        description: 'Sweet and tangy dried mango slices without any added sugar. Perfect healthy snack.',
        price: 200,
        image: '/images/products/dried-mango.jpg',
        category: 'fruits',
        weightOptions: [
            { weight: '100g', price: 200 },
            { weight: '250g', price: 480 },
            { weight: '500g', price: 900 },
            { weight: '1kg', price: 1700 }
        ],
        stock: 120,
        tags: ['mango', 'dried', 'fruit', 'snack', 'sweet']
    },
    {
        name: 'Organic Banana Chips',
        description: 'Crispy banana chips made from organic bananas. No artificial preservatives.',
        price: 160,
        image: '/images/products/banana-chips.jpg',
        category: 'snacks',
        weightOptions: [
            { weight: '100g', price: 160 },
            { weight: '250g', price: 380 },
            { weight: '500g', price: 720 }
        ],
        stock: 200,
        tags: ['banana', 'chips', 'snack', 'crispy', 'organic']
    },
    {
        name: 'Organic Banana Powder',
        description: 'Pure organic banana powder made from ripe organic bananas. Rich in potassium and natural sweetness.',
        price: 160,
        image: '/images/products/banana-powder.jpg',
        category: 'powders',
        weightOptions: [
            { weight: '50g', price: 80 },
            { weight: '100g', price: 160 },
            { weight: '250g', price: 380 },
            { weight: '500g', price: 720 }
        ],
        stock: 150,
        tags: ['banana', 'powder', 'potassium', 'organic', 'sweet']
    },
    {
        name: 'Dried Fig',
        description: 'Premium quality dried figs, naturally sweet and rich in fiber.',
        price: 300,
        image: '/images/products/dried-fig.jpg',
        category: 'fruits',
        weightOptions: [
            { weight: '100g', price: 300 },
            { weight: '250g', price: 700 },
            { weight: '500g', price: 1350 }
        ],
        stock: 100,
        tags: ['fig', 'dried', 'fruit', 'fiber', 'sweet']
    },
    {
        name: 'Organic Spinach Powder',
        description: 'Dehydrated spinach powder, perfect for smoothies and cooking. Rich in iron.',
        price: 140,
        image: '/images/products/spinach-powder.jpg',
        category: 'powders',
        weightOptions: [
            { weight: '50g', price: 70 },
            { weight: '100g', price: 140 },
            { weight: '250g', price: 320 },
            { weight: '500g', price: 600 }
        ],
        stock: 160,
        tags: ['spinach', 'powder', 'iron', 'green', 'organic']
    },
    {
        name: 'Dried Apricot',
        description: 'Sweet and chewy dried apricots, rich in vitamins A and C.',
        price: 250,
        image: '/images/products/dried-apricot.jpg',
        category: 'fruits',
        weightOptions: [
            { weight: '100g', price: 250 },
            { weight: '250g', price: 600 },
            { weight: '500g', price: 1150 }
        ],
        stock: 90,
        tags: ['apricot', 'dried', 'fruit', 'vitamin', 'sweet']
    },
    {
        name: 'Organic Wheat Grass Powder',
        description: 'Fresh wheat grass powder, detoxifying and alkalizing. Rich in chlorophyll.',
        price: 220,
        image: '/images/products/wheatgrass-powder.jpg',
        category: 'powders',
        weightOptions: [
            { weight: '50g', price: 110 },
            { weight: '100g', price: 220 },
            { weight: '250g', price: 500 },
            { weight: '500g', price: 950 }
        ],
        stock: 140,
        tags: ['wheatgrass', 'powder', 'detox', 'chlorophyll', 'organic']
    },
    {
        name: 'Mixed Dry Fruits',
        description: 'Premium mix of almonds, cashews, raisins, and dried apricots. Perfect energy booster.',
        price: 450,
        image: '/images/products/mixed-dry-fruits.jpg',
        category: 'fruits',
        weightOptions: [
            { weight: '250g', price: 450 },
            { weight: '500g', price: 850 },
            { weight: '1kg', price: 1600 }
        ],
        stock: 80,
        tags: ['mixed', 'dry-fruits', 'energy', 'nuts', 'premium']
    },
    {
        name: 'Organic Beetroot Powder',
        description: 'Nutrient-rich beetroot powder, great for stamina and blood health.',
        price: 160,
        image: '/images/products/beetroot-powder.jpg',
        category: 'powders',
        weightOptions: [
            { weight: '50g', price: 80 },
            { weight: '100g', price: 160 },
            { weight: '250g', price: 370 },
            { weight: '500g', price: 700 }
        ],
        stock: 130,
        tags: ['beetroot', 'powder', 'stamina', 'iron', 'organic']
    },
    {
        name: 'Dried Cranberries',
        description: 'Tart and sweet dried cranberries, perfect for baking and snacking.',
        price: 280,
        image: '/images/products/dried-cranberries.jpg',
        category: 'fruits',
        weightOptions: [
            { weight: '100g', price: 280 },
            { weight: '250g', price: 650 },
            { weight: '500g', price: 1250 }
        ],
        stock: 110,
        tags: ['cranberry', 'dried', 'fruit', 'tart', 'antioxidant']
    },
    {
        name: 'Organic Onion Powder',
        description: 'Pure organic onion powder with intense flavor. Perfect for seasoning and cooking.',
        price: 130,
        image: '/images/products/onion-powder.jpg',
        category: 'powders',
        weightOptions: [
            { weight: '50g', price: 65 },
            { weight: '100g', price: 130 },
            { weight: '250g', price: 300 },
            { weight: '500g', price: 580 }
        ],
        stock: 170,
        tags: ['onion', 'powder', 'seasoning', 'organic', 'flavor']
    }
];

// Connect to database
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DATABASE_URL);
        const dbName = conn.connection.name;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`Database Name: ${dbName}`);
        return conn;
    } catch (error) {
        console.error('Database connection failed:');
        console.error(error.message);
        process.exit(1);
    }
};

// Import data into database
const importData = async () => {
    try {
        // Connect to database first
        await connectDB();
        
        // Wait a bit to ensure connection is ready
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Clear existing products
        console.log('Clearing existing products...');
        await Product.deleteMany({});
        console.log('Existing products cleared.');
        
        // Insert sample products
        console.log('Inserting products...');
        await Product.insertMany(sampleProducts);
        
        console.log(`✅ Data imported successfully! ${sampleProducts.length} products added.`);
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error importing data:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
};

// Destroy data
const destroyData = async () => {
    try {
        // Connect to database first
        await connectDB();
        
        // Wait a bit to ensure connection is ready
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('Deleting all products...');
        await Product.deleteMany({});
        console.log('✅ Data destroyed successfully!');
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error destroying data:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
};

// Run based on command line argument
if (process.argv[2] === '-import') {
    importData();
} else if (process.argv[2] === '-destroy') {
    destroyData();
} else {
    console.log('Please provide a command: -import or -destroy');
    process.exit();
}
