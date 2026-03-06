require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Body Parsing Middleware ─────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ─── Session Configuration ──────────────────────────────────────
app.use(
    session({
        secret: process.env.SESSION_SECRET || "fallback-secret-key",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI || "mongodb://localhost:27017/studentDB",
            collectionName: "sessions",
            ttl: 24 * 60 * 60, // Session TTL: 24 hours
        }),
        cookie: {
            httpOnly: true, // Prevents client-side JS from reading the cookie
            secure: false, // Set to true in production with HTTPS
            maxAge: 1000 * 60 * 60 * 24, // 24 hours
        },
    })
);

// ─── Routes ─────────────────────────────────────────────────────
app.use("/", authRoutes);

// ─── Root Health Check ──────────────────────────────────────────
app.get("/", (req, res) => {
    res.json({ status: "ok", message: "Login System API is running" });
});

// ─── 404 Handler ────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

// ─── Global Error Handler ───────────────────────────────────────
app.use((err, req, res, next) => {
    console.error(`❌ Unhandled Error: ${err.message}`);
    res.status(500).json({ success: false, message: "Internal server error" });
});

// ─── Database Connection & Server Start ─────────────────────────
const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
    });
};

startServer();
