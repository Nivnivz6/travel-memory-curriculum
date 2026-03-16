# Phase 4: Caching & Object Storage — Deep Dive ⚡️📦

Welcome to the most important "Architecture" lesson of this course. In the previous phases, you focused on **Logic** (how to authenticate, how to save data). In Phase 4, we focus on **Performance and Infrastructure Strategy**.

You will learn why professional apps don't just "talk to a database," but instead use a multi-layered storage strategy involving **Redis** and **Object Storage (S3/MinIO)**.

---

## 🧠 Lesson 1: The Memory Hierarchy (RAM vs. Disk)

Every computer has a hierarchy of speed.
1.  **Registers/L1 Cache**: Extremely fast, but tiny (bytes).
2.  **RAM (Random Access Memory)**: Fast, volatile (lost on reboot), but limited in size. **This is where Redis lives.**
3.  **SSD/HDD (Disk)**: Slow, persistent (permanent), and vast. **This is where MongoDB lives.**

### What is Redis?
**Redis** (Remote Dictionary Server) is an open-source, in-memory data structure store. Unlike MongoDB, which writes data to the disk to ensure it survives a power outage, Redis keeps nearly everything in RAM.
- **Latency**: Accessing a record in MongoDB might take 10-50ms. Accessing a record in Redis typically takes **less than 1ms**.
- **Data Structure**: Redis is a "Key-Value" store. It's basically a giant JavaScript Object `{}` or Python Dictionary that lives in memory and can be accessed by multiple servers.

### Why Cache? (The Cache-Aside Pattern)
In this project, we use the **Cache-Aside** strategy:
1.  **Check Cache**: When a user requests their image gallery, we first ask Redis: *"Do you have the JSON for user 123's images?"*
2.  **Cache Hit**: If Redis says "Yes", we return that data immediately. We just saved 50ms of database work!
3.  **Cache Miss**: If Redis says "No", we go to MongoDB. Once we get the data from Mongo, we **simultaneously** send it to the user AND "cache" it in Redis so it's ready for next time.

---

## 🏗️ Lesson 2: Object Storage (S3/MinIO)

### The "Blob" Problem
Imagine you have 10,000 users, and each uploads 10 high-resolution vacation photos (5MB each). 
- 10,000 users × 10 images × 5MB = **500GB of data.**

If you store these 500GB of binary "Blobs" inside MongoDB:
- Your database backups become impossible to manage.
- Your RAM (which MongoDB uses for indexes) gets crowded by useless binary data.
- Scaling becomes difficult because your database server now needs massive hard drives.

### The Solution: S3 (Simple Storage Service)
**Object Storage** like AWS S3 (or our local equivalent, **MinIO**) is designed to store "Flat" files. It doesn't care about relationships; it just gives you a "Bucket" to throw files into.
- **Buckets**: Think of these as top-level folders (e.g., `learning-uploads`).
- **Keys**: The unique path to the file (e.g., `uploads/17000000-my-cat.jpg`).
- **Separation of Concerns**: We store the **metadata** (filename, size, user ID, and the image's URL) in MongoDB, but the **actual bytes** of the image stay in the Object Storage.

---

## 🌪️ Lesson 3: Cache Invalidation (The Hardest Part)

There are only two hard things in Computer Science: cache invalidation and naming things.

If we cache the image gallery, what happens when a user uploads a **new** image?
- If we don't do anything, the user will refresh the page, the API will see the **Cache Hit**, and return the *old* list. The new image will seem to have "vanished."

To fix this, we implement **Manual Invalidation**:
- Whenever a `POST`, `PUT`, or `DELETE` action happens that modifies the data, we must programmatically **DEL**ete the corresponding key in Redis. This forces the next request to be a **Cache Miss**, fetching the fresh data from MongoDB and re-populating the cache.

---

## 🛠️ Your Task: Implementation

Your goal is to fill out the `// TODO` comments in the backend to make the infrastructure functional.

### 1. The Redis Middleware (`backend/src/middleware/cache.js`)
You will be overriding the `res.json` method. This is a powerful Node.js pattern where you "intercept" the data right before it leaves the server to save a copy in Redis.
- Use `client.get(key)` to check the cache.
- Use `client.setex(key, ttl, value)` to save it. (TTL = Time To Live. We don't want the cache to last forever!).

### 2. The S3 Service (`backend/src/services/s3Service.js`)
You will use the `aws-sdk` to communicate with MinIO.
- Configure the `params` (Bucket, Key, Body, ContentType).
- Use `.promise()` to make the upload awaitable.

### 3. Invalidation (`backend/src/controllers/imageController.js` & `worker.js`)
Find the places where images are created or updated. Use `redis.del(cacheKey)` to "bust" the cache.

---

## 🚀 Launching Phase 4

Start your infrastructure:
```bash
docker compose up -d redis minio
```

Run the tests to see what's broken:
```bash
cd backend
npm test tests/cache.test.js tests/image.test.js
```

By the end of this phase, your app will be lightning-fast and ready to handle thousands of images without breaking the database!
