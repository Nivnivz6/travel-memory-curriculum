# Phase 2: Express Auth & The Data Layer

Welcome to Phase 2 of the Travel Memory App curriculum! In Phase 1, you wired up a beautiful React frontend. Now it's time to build the **entire backend** — the Express API server, the MongoDB data layer, and full User Authentication. By the end of this phase, your React app will be talking to a real API that saves real users and real images to a real database!

## 🛠️ The Ultimate Goal
Your mission is to rebuild the `backend/` directory from the ground up. We have provided the Express skeleton (routing files, middleware structure), but we **completely hollowed out**:

1. **The Mongoose Schemas** — The database blueprints are empty. You must define them first.
2. **The Controllers** — All route handlers return `501 Not Implemented`. You must write the logic.
3. **The Auth Middleware** — The JWT verification gate rejects everything. You must implement it.

### Build Order (Important!)
You **must** build in this order — controllers depend on schemas, and image routes depend on auth:
1. `backend/src/models/User.js` — Define the User schema
2. `backend/src/models/Image.js` — Define the Image schema
3. `backend/src/controllers/userController.js` — Basic CRUD
4. `backend/src/controllers/authController.js` — Register & Login with JWT
5. `backend/src/middleware/auth.js` — JWT verification gate
6. `backend/src/controllers/imageController.js` — Upload & Gallery with Data Isolation

### Files with `// TODO:` Comments
- `backend/src/models/User.js`
- `backend/src/models/Image.js`
- `backend/src/controllers/authController.js`
- `backend/src/controllers/userController.js`
- `backend/src/controllers/imageController.js`
- `backend/src/middleware/auth.js`

---

## 📚 The Lesson Concepts

### 1. What is Node.js?
JavaScript was born inside the web browser. For decades, it could **only** run inside Chrome, Firefox, or Safari. Then in 2009, a developer named Ryan Dahl took Chrome's V8 JavaScript engine and packaged it into a standalone runtime called **Node.js**.

This was revolutionary — suddenly, JavaScript could run directly on your operating system, access the file system, listen on network ports, and talk to databases. This meant you could use the **same language** (JavaScript) for both your frontend AND your backend.

When you run `node server.js`, you are telling Node.js to execute that JavaScript file outside of any browser.

### 2. What is Express.js?
Node.js by itself gives you raw tools — like `http.createServer()` — but building an API with raw Node is tedious and messy. **Express.js** is a lightweight framework that sits on top of Node.js and gives you an elegant way to define **Routes**.

A Route maps an HTTP method (GET, POST, PUT, DELETE) to a specific URL path and a handler function:

```javascript
const express = require('express');
const app = express();

// When someone sends a GET request to /api/greeting, run this function:
app.get('/api/greeting', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

// When someone sends a POST request to /api/users, run this function:
app.post('/api/users', (req, res) => {
  const { username } = req.body; // Access the data sent by the client
  res.status(201).json({ username });
});
```

Express also uses **Middleware** — functions that run _before_ your route handler. For example, `express.json()` automatically parses incoming JSON bodies so you can access `req.body`. Check `backend/src/app.js` to see these middleware in action!

### 3. REST APIs & HTTP Methods
A **REST API** (Representational State Transfer) is a standardized way for your frontend to communicate with your backend. Think of it as a structured conversation:

| HTTP Method | Purpose | Example |
|---|---|---|
| `GET` | **Read** data | `GET /api/images` → Fetch all images |
| `POST` | **Create** new data | `POST /api/auth/register` → Create a user |
| `PUT` | **Update** existing data | `PUT /api/users/123` → Edit a user |
| `DELETE` | **Remove** data | `DELETE /api/images/456` → Delete an image |

The client sends a **Request** with optional headers and a body. The server processes it and returns a **Response** with a status code and JSON data.

Common Status Codes:
- `200` — OK (success)
- `201` — Created (new resource saved)
- `400` — Bad Request (invalid input)
- `401` — Unauthorized (no valid token)
- `404` — Not Found
- `500` — Internal Server Error

### 4. What is CORS?
Your React app runs on `http://localhost:5173`. Your Express API runs on `http://localhost:3000`. These are **different origins** (different ports = different origins).

By default, browsers enforce a **Same-Origin Policy** that blocks requests between different origins. This is a critical security feature — it prevents malicious websites from secretly calling your bank's API.

To allow your React frontend to talk to your Express backend, we use the `cors` middleware:

```javascript
const cors = require('cors');
app.use(cors()); // "I accept traffic from any origin"
```

Check `backend/src/app.js` — CORS is already enabled for you!

### 5. Document Databases vs SQL
Traditional databases (like PostgreSQL or MySQL) store data in rigid **tables** with fixed columns. Before you can save a user, you must define the exact column names, types, and sizes.

**MongoDB** is a **Document Database** (NoSQL). Instead of tables and rows, it stores flexible **Documents** — which look exactly like JavaScript/JSON objects:

```json
{
  "_id": "65a1b2c3d4e5f6",
  "username": "Niv",
  "email": "niv@test.com",
  "password": "$2a$10$hashed...",
  "createdAt": "2026-03-16T00:00:00Z"
}
```

Documents are grouped into **Collections** (the equivalent of tables). A `users` collection holds User documents. An `images` collection holds Image documents.

### 6. What is an ODM? (Mongoose)
While MongoDB is flexible, that flexibility can be dangerous — without rules, anyone could save a user without an email, or with a number instead of a string for the username.

**Mongoose** is an **Object Data Modeling (ODM)** library. It sits between your Express code and MongoDB and enforces strict rules called **Schemas**:

```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false, // Never return password in queries by default!
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
```

Once you define a schema, Mongoose gives you powerful query methods:
```javascript
// Create a new user document
const user = await User.create({ username: 'Niv', email: 'niv@test.com', password: 'secret123' });

// Find a user by email
const foundUser = await User.findOne({ email: 'niv@test.com' });

// Find a user by ID
const userById = await User.findById('65a1b2c3d4e5f6');
```

> **⚠️ IMPORTANT:** In this project, we do NOT use `unique: true` or `index: true` in our schemas. Instead, we handle duplicate checking **manually** in our controllers using `User.findOne()` before creating a new document. This teaches you how validation really works under the hood!

### 7. User Authentication with bcrypt
Never, ever, **EVER** save a plain-text password in your database. If your database is compromised, every single user is instantly hacked.

We use **bcryptjs** to "hash" passwords — a one-way mathematical transformation:

```javascript
const bcrypt = require('bcryptjs');

// Hashing a password (during registration)
const salt = await bcrypt.genSalt(10);               // Generate random salt
const hashedPassword = await bcrypt.hash('myPassword123', salt);
// hashedPassword → "$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q..."

// Comparing passwords (during login)
const isMatch = await bcrypt.compare('myPassword123', hashedPassword);
// isMatch → true
```

In our Mongoose schema, we use a **pre-save hook** so hashing happens automatically before any User document is saved to the database. You will implement this in `User.js`!

### 8. JSON Web Tokens (JWT)
HTTP is **stateless** — the server has amnesia. It forgets who you are the instant it finishes responding. So how do we keep users "logged in" across multiple requests?

**JSON Web Tokens (JWT)** are cryptographically signed strings that encode a user's identity:

```javascript
const jwt = require('jsonwebtoken');

// SIGNING a token (after successful login/register)
const token = jwt.sign(
  { id: user._id },                    // Payload: the user's database ID
  'my_secret_key',                     // Secret key (keep this hidden!)
  { expiresIn: '30d' }                 // Token expires in 30 days
);

// VERIFYING a token (in the auth middleware)
const decoded = jwt.verify(token, 'my_secret_key');
// decoded → { id: '65a1b2c3d4e5f6', iat: 1710..., exp: 1713... }
```

**The Flow:**
1. User registers/logs in → Server generates a JWT and sends it back
2. Frontend saves the JWT in `localStorage`
3. For every protected request, the frontend includes: `Authorization: Bearer <token>`
4. The `protect` middleware (`auth.js`) extracts the token, verifies it, finds the user, and attaches `req.user`
5. The controller can now access `req.user._id` to know exactly who is making the request

### 9. Data Isolation (Tenant Privacy)
A real application is **useless** if User A can see User B's private photos! When fetching images, we MUST filter by the logged-in user's ID:

```javascript
// ❌ WRONG — returns EVERYONE's images!
const images = await Image.find({});

// ✅ CORRECT — returns only THIS user's images!
const images = await Image.find({ userId: req.user._id });
```

This is called **Tenant Isolation** — each user is a "tenant" who can only access their own data.

---

## 💻 Environment Setup

### 1. The "Magic" Command (MongoDB)
Before your Node.js application can save users, it needs a database. We use MongoDB hosted inside a Docker container.

Open a WSL terminal at the root of the project and run:
```bash
docker compose up -d db
```
*(Wait a few seconds for the database to spin up.)*

### 2. Start the Backend API
Open a second terminal, navigate into `backend/`, install dependencies, and start the dev server:
```bash
cd backend
npm install
npm run dev
```
*(Your API should now be running on port 3000!)*

---

## 🧪 The Assignment: Test-Driven Development (TDD)
We have provided a robust backend testing suite using **Jest** and **Supertest**. Right now, **19 out of 21 tests fail** because your schemas are empty and controllers return `501 Not Implemented`.

### How to Run Your Assignment:
Keep your `npm run dev` server running in one terminal. Open a new terminal inside `backend/` and run the TDD Watcher:
```bash
cd backend
npm run test:watch
```

Keep your terminal open. Every time you save a file, Jest will instantly re-run the tests. Read the failing error messages closely — they tell you exactly what is missing!

### Final Verification
Once all backend tests are completely **GREEN**:
1. Open your React frontend (`cd frontend && npm run dev`).
2. Navigate to `http://localhost:5173/`.
3. Register a new account with a username, email, and password.
4. If your API is built correctly... you will bypass the Auth screen and enter the Travel Memory App!
5. Upload an image. Refresh the page. If Data Isolation is working, your gallery will persist **only your images**.

**You've officially built a real, functioning Full-Stack application with authentication!** 🎉

Good luck!
