# Comparison Report: Student Code vs AI-Generated Code

## Overview

This report compares two implementations of the same login system:
- **Student Version**: Written with basic knowledge of Express.js and MongoDB
- **AI Version**: Generated using AI tools with expert-level patterns

---

## Feature Comparison

| Feature | Student Code | AI Code |
|---|---|---|
| **Structure** | Simple — all logic in 2 files (`server.js`, `User.js`) | Advanced — modular folders (`config/`, `models/`, `classes/`, `middleware/`, `routes/`) |
| **Readability** | Easy — straightforward, no abstractions | Medium — more files to navigate but well-documented with JSDoc |
| **Security** | Basic — passwords stored in plain text | Good — bcrypt hashing with salt, httpOnly cookies, session regeneration |
| **Session Handling** | Basic — in-memory sessions (lost on restart) | Advanced — MongoStore persistent sessions with TTL and cookie config |
| **Error Handling** | Basic — generic try/catch returning strings | Good — specific validation errors, proper HTTP status codes (400, 401, 500) |
| **Password Storage** | Plain text in MongoDB | Bcrypt hashed with pre-save middleware |
| **Input Validation** | None | Mongoose schema validation + route-level checks |
| **Environment Config** | Hardcoded values | `.env` file with `dotenv` |
| **Return Format** | Plain strings (`"Login successful"`) | JSON objects (`{ success: true, message: "..." }`) |
| **Dependencies** | 3 (express, mongoose, express-session) | 6 (+ bcrypt, connect-mongo, dotenv) |

---

## Detailed Analysis

### 1. Project Structure

**Student Code:**
```
student_version/
├── server.js          # Everything in one file
├── User.js            # User class with Mongoose model
└── package.json
```

**AI Code:**
```
ai_version/
├── config/
│   └── db.js          # Database connection module
├── models/
│   └── UserModel.js   # Mongoose schema with validation
├── classes/
│   └── User.js        # User class (uses model)
├── middleware/
│   └── auth.js        # Authentication middleware
├── routes/
│   └── authRoutes.js  # Express Router with all routes
├── server.js          # Clean entry point
├── .env               # Environment variables
└── package.json
```

The student code is easier to understand for beginners since everything is in fewer files. The AI code follows the MVC-like pattern which is better for larger projects but adds complexity for a simple login system.

### 2. Security Comparison

**Student Code** stores passwords as plain text:
```javascript
// Password stored directly — anyone with DB access can read passwords
const newUser = new UserModel({ username: this.username, password: this.password });
```

**AI Code** uses bcrypt hashing:
```javascript
// Pre-save hook automatically hashes password before storing
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
```

The AI version also prevents session fixation attacks by regenerating the session ID after login.

### 3. Session Handling

**Student Code** uses default in-memory session store:
```javascript
app.use(session({ secret: "mysecretkey", resave: false, saveUninitialized: false }));
```
Sessions are lost when the server restarts.

**AI Code** uses MongoDB-backed sessions:
```javascript
store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI, ttl: 24 * 60 * 60 })
```
Sessions persist across server restarts and have proper TTL configuration.

---

## Conclusion

The **student code** is simpler and easier to understand, making it suitable for learning. The **AI code** follows production-level best practices but is more complex. For a class assignment, the student approach is sufficient. For a real application, the AI approach with password hashing and persistent sessions would be necessary.
