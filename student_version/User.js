const mongoose = require("mongoose");

// user schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const UserModel = mongoose.model("User", userSchema);

class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }

    async register() {
        try {
            const existingUser = await UserModel.findOne({ username: this.username });
            if (existingUser) {
                return "Username already exists";
            }

            const newUser = new UserModel({
                username: this.username,
                password: this.password,
            });
            await newUser.save();
            return "User registered successfully";
        } catch (error) {
            return "Error registering user";
        }
    }

    async login() {
        try {
            const user = await UserModel.findOne({
                username: this.username,
                password: this.password,
            });

            if (user) {
                return "Login successful";
            } else {
                return "Invalid username or password";
            }
        } catch (error) {
            return "Error logging in";
        }
    }
}

module.exports = User;
