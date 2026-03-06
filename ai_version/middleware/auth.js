/**
 * Authentication Middleware
 *
 * Protects routes by verifying that a valid user session exists.
 * Redirects unauthenticated requests with appropriate HTTP status codes.
 */

/**
 * Checks if the incoming request has an active authenticated session.
 * If not, responds with 401 Unauthorized status.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }

    return res.status(401).json({
        success: false,
        message: "Access denied. Please login to continue.",
    });
};

module.exports = { isAuthenticated };
