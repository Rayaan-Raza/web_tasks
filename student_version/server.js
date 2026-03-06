const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const User = require("./User");

const app = express();

// middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// session setup
app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: false,
  })
);

// connect to mongodb
mongoose
  .connect("mongodb://localhost:27017/studentDB")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

// auth middleware
function isLoggedIn(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.send("Please login first");
  }
}

// register route
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const user = new User(username, password);
  const result = await user.register();
  res.send(result);
});

// login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = new User(username, password);
  const result = await user.login();

  if (result === "Login successful") {
    req.session.user = username;
  }

  res.send(result);
});

// dashboard route (protected)
app.get("/dashboard", isLoggedIn, (req, res) => {
  res.send("Welcome " + req.session.user);
});

// logout route
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.send("Logout successful");
  });
});

// start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
