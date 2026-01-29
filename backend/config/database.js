const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DATABASE_URL);
        const dbName = conn.connection.name;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`Database Name: ${dbName}`);
    } catch (error) {
        console.error('Database connection failed:');
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
