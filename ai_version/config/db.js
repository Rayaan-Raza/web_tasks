const mongoose = require("mongoose");
require("dotenv").config();

/**
 * Establishes connection to MongoDB using Mongoose.
 * Implements connection event handlers for monitoring database state.
 * Uses environment variable for the connection URI with a fallback default.
 *
 * @returns {Promise<void>} Resolves when connection is established
 * @throws {Error} Exits process on initial connection failure
 */
const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/studentDB";

        await mongoose.connect(uri, {
            // Mongoose 7+ uses these defaults automatically, but explicit for clarity
            autoIndex: true,
        });

        console.log(`✅ MongoDB connected successfully: ${mongoose.connection.host}`);

        // Connection event listeners for resilience monitoring
        mongoose.connection.on("error", (err) => {
            console.error(`❌ MongoDB connection error: ${err.message}`);
        });

        mongoose.connection.on("disconnected", () => {
            console.warn("⚠️  MongoDB disconnected. Attempting reconnection...");
        });

        mongoose.connection.on("reconnected", () => {
            console.log("🔄 MongoDB reconnected successfully");
        });
    } catch (error) {
        console.error(`❌ Failed to connect to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
