const UserModel = require("../models/UserModel");

/**
 * User Class
 *
 * Encapsulates user authentication operations following the class-based pattern.
 * Delegates data persistence to the Mongoose UserModel and leverages bcrypt
 * for secure password comparison.
 */
class User {
    /**
     * @param {string} username - The user's unique username
     * @param {string} password - The user's plaintext password
     */
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }

    /**
     * Registers a new user in the database.
     * Password hashing is handled automatically by the Mongoose pre-save middleware
     * defined in the UserModel schema.
     *
     * @returns {Promise<{success: boolean, message: string}>} Registration result
     */
    async register() {
        try {
            // Check for existing user to provide clear feedback
            const existingUser = await UserModel.findOne({ username: this.username });
            if (existingUser) {
                return { success: false, message: "Username already exists" };
            }

            const newUser = new UserModel({
                username: this.username,
                password: this.password,
            });

            await newUser.save();
            return { success: true, message: "User registered successfully" };
        } catch (error) {
            // Handle Mongoose validation errors specifically
            if (error.name === "ValidationError") {
                const messages = Object.values(error.errors).map((err) => err.message);
                return { success: false, message: messages.join(", ") };
            }
            return { success: false, message: "An error occurred during registration" };
        }
    }

    /**
     * Authenticates a user by verifying credentials against the database.
     * Uses bcrypt.compare() via the Mongoose instance method for secure
     * password verification without exposing the hash.
     *
     * @returns {Promise<{success: boolean, message: string}>} Login result
     */
    async login() {
        try {
            const user = await UserModel.findOne({ username: this.username });

            if (!user) {
                // Generic message to prevent username enumeration attacks
                return { success: false, message: "Invalid username or password" };
            }

            const isMatch = await user.comparePassword(this.password);

            if (!isMatch) {
                return { success: false, message: "Invalid username or password" };
            }

            return { success: true, message: "Login successful" };
        } catch (error) {
            return { success: false, message: "An error occurred during login" };
        }
    }
}

module.exports = User;
