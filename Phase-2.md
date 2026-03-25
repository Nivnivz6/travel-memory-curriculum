# 🚀 Step 2 — Node.js & Express API

> **Prerequisites:** You've completed Step 1 (React). Now it's time to build the backend that powers it.

In this step you will build a RESTful API using **Node.js + Express**, persist data with **MongoDB + Mongoose**, and handle image uploads to an S3-compatible object store (**MinIO**).

---

## 📚 What You'll Learn

- Setting up an Express server from scratch
- Structuring a Node.js project (routes, controllers, models, middleware)
- Connecting to MongoDB using Mongoose and defining schemas
- Handling JWT-based authentication (register / login / logout)
- Accepting file uploads  and storing them in MinIO (S3-compatible)
- Writing query filters and analytics endpoints

---

## ⚙️ Local Services Setup

Before running the app, spin up MongoDB and MinIO using Docker.

### MongoDB

```bash
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=secret \
  -v mongodb_data:/data/db \
  mongo:latest
```

> Connects at: `mongodb://admin:secret@localhost:27017`

---

### MinIO

```bash
docker run -d \
  --name minio \
  -p 9000:9000 \
  -p 9001:9001 \
  -e MINIO_ROOT_USER=minioadmin \
  -e MINIO_ROOT_PASSWORD=minioadmin \
  -v minio_data:/data \
  quay.io/minio/minio server /data --console-address ":9001"
```

| Port   | Purpose                        |
|--------|--------------------------------|
| `9000` | S3 API endpoint (used in code) |
| `9001` | MinIO web console (browser UI) |

> Open the console at: [http://localhost:9001](http://localhost:9001)  
> Login: `minioadmin` / `minioadmin`  
> Create a bucket called `images` from the console before running the app.

---

## 🚀 Getting Started

## 📦 Install Dependencies

Install what you need:

```bash
npm install express mongoose dotenv bcryptjs jsonwebtoken multer cors minio
npm install -D nodemon
```

Add to `package.json`:

```json
"scripts": {
  "start": "node src/index.js",
  "dev": "nodemon src/index.js"
}
```

> 💡 Not sure what a package does? Look it up on [npmjs.com](https://www.npmjs.com) before using it.

---

## 🔐 Environment Variables

Create a `.env` in the project root and add the following keys — figure out the correct values based on how you set up MongoDB and MinIO:

```env
PORT=
MONGO_URI=
JWT_SECRET=
MINIO_ENDPOINT=
MINIO_PORT=
MINIO_ACCESS_KEY=
MINIO_SECRET_KEY=
MINIO_BUCKET=
MINIO_USE_SSL=
```

> ⚠️ Add `.env` to your `.gitignore` before your first commit.

### 3. Run the server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

---

## 📁 Suggested Project Structure
```
backend/
├── config/
│ ├── db.js # Mongoose connection
│ └── minio.js # MinIO client setup
├── middleware/
│ └── auth.js # JWT verification middleware
├── models/
│ └── Image.js # Mongoose schema for images
├── routes/
│ ├── auth.js
│ ├── images.js
│ └── analytics.js
├── controllers/
│ ├── authController.js
│ ├── imagesController.js
│ └── analyticsController.js
└── index.js # App entry point
```
---

## 📡 API Reference

All routes under `/api`. Protected routes require a `Bearer <token>` in the `Authorization` header.

---

### 🔐 Auth

#### `POST /api/auth/register`
Register a new user.

**Body:**
```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
    "_id": "69c380b120634b6865d0f934",
    "username": "a",
    "email": "a@a.a",
    "token": "eyJhbGci..."
}
```
---

#### `POST /api/auth/login`
Login and receive a JWT token.

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
    "_id": "69c380b120634b6865d0f934",
    "username": "a",
    "email": "a@a.a",
    "token": "eyJhbGci..."
}
```

---

### 🖼️ Upload

#### `POST /api/images/upload` *(Protected)*
Upload an image file. Use `multipart/form-data`.

| Field    | Type   | Description              |
|----------|--------|--------------------------|
| `image`   | File   | The image to upload      |
| `name`   | string | Display name for the image |

The file is stored in MinIO and its metadata (name, size, status, S3 key, uploader) is saved in MongoDB.

---

### 📋 Images

#### `GET /api/images` *(Protected)*
Retrieve a list of images with optional filters.

| Query Param | Type   | Description                        |
|-------------|--------|------------------------------------|
| `name`      | string | Filter by name (partial match)     |
| `status`    | string | e.g. `pending`, `completed`           |
| `minSize`   | number | Minimum file size in bytes         |
| `maxSize`   | number | Maximum file size in bytes         |
| `fromDate`  | string | ISO date — uploaded after this date |
| `toDate`    | string | ISO date — uploaded before this date |

---

#### `DELETE /api/images` *(Protected)*
Delete images by ID. Pass an array of IDs to delete specific images, or an **empty array to delete all**.

**Body:**
```json
{
  "ids": ["64a1f...", "64a1e..."]
}
```

```json
{
  "ids": []
}
```

> ⚠️ Passing an empty array deletes **all** images. Make sure to handle this carefully on the client side.

---

### 📊 Analytics

#### `GET /api/analytics/images` *(Protected)*
Returns the total count of images, optionally filtered by status.

| Query Param | Type   | Description               |
|-------------|--------|---------------------------|
| `status`    | string | Filter by a specific status |

**Example Response:**
```json
{ "count": 42 }
```

---

#### `GET /api/analytics/uploads` *(Protected)*
Returns a leaderboard of users ranked by the selected metric.

| Query Param | Type   | Description                                           |
|-------------|--------|-------------------------------------------------------|
| `metric`    | string | `count` (number of uploads) or `size` (total bytes)   |
| `limit`     | number | Max number of users to return (default: 10)           |

**Example `?metric=count&limit=3`:**
```json
[
  { "user": "alice", "count": 34 },
  { "user": "bob",   "count": 21 },
  { "user": "carol", "count": 18 }
]
```

## 💡 Implementation Tips

- **Start with the model.** Define your `Image` Mongoose schema before writing any route logic.
- **Auth middleware first.** Write and test `middleware/auth.js` before protecting any routes.
- **Use `multer` with `memoryStorage`** so you can stream the file buffer directly to MinIO without writing to disk.
- **MinIO behaves like S3.** You can use the `minio` npm package or `@aws-sdk/client-s3` with `forcePathStyle: true`.
- **Test with Postman or Thunder Client** — import the routes above and test each one in order (register → login → upload → list → delete).
- **Don't store the file in MongoDB.** Only store the metadata and the MinIO object key.

---

## 🔗 Useful Docs

- [Express.js](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/docs/)
- [MinIO JavaScript SDK](https://min.io/docs/minio/linux/developers/javascript/API.html)
- [JWT — jsonwebtoken npm](https://www.npmjs.com/package/jsonwebtoken)
- [multer npm](https://www.npmjs.com/package/multer)