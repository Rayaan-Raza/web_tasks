const express = require("express");
const User = require("../classes/User");
const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

/**
 * POST /register
 * Handles new user registration.
 * Validates input, creates user via the User class, and returns the result.
 */
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Input validation
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required",
            });
        }

        const user = new User(username.trim(), password);
        const result = await user.register();

        const statusCode = result.success ? 201 : 400;
        return res.status(statusCode).json(result);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

/**
 * POST /login
 * Authenticates user credentials and creates a session on success.
 * Regenerates session ID to prevent session fixation attacks.
 */
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required",
            });
        }

        const user = new User(username.trim(), password);
        const result = await user.login();

        if (result.success) {
            // Regenerate session to prevent session fixation
            req.session.regenerate((err) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: "Session error",
                    });
                }

                req.session.user = username.trim();
                return res.status(200).json(result);
            });
        } else {
            return res.status(401).json(result);
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

/**
 * GET /dashboard
 * Protected route - only accessible to authenticated users.
 * Returns a personalized welcome message.
 */
router.get("/dashboard", isAuthenticated, (req, res) => {
    return res.status(200).json({
        success: true,
        message: `Welcome ${req.session.user}`,
    });
});

/**
 * GET /logout
 * Destroys the current session and clears the session cookie.
 */
router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error logging out",
            });
        }

        res.clearCookie("connect.sid");
        return res.status(200).json({
            success: true,
            message: "Logout successful",
        });
    });
});

module.exports = router;
