const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/**
 * User Schema Definition
 * Enforces data integrity through Mongoose validation and
 * implements pre-save middleware for automatic password hashing.
 */
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            trim: true,
            minlength: [3, "Username must be at least 3 characters"],
            maxlength: [30, "Username cannot exceed 30 characters"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

/**
 * Pre-save middleware: Hashes the password before storing in the database.
 * Only hashes if the password field has been modified (prevents re-hashing on updates).
 * Uses bcrypt with a salt factor of 10 for industry-standard security.
 */
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

/**
 * Instance method: Compares a candidate password against the stored hash.
 * @param {string} candidatePassword - The plaintext password to verify
 * @returns {Promise<boolean>} True if passwords match
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
