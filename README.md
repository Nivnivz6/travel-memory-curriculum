# Phase 4 (Simplified): Caching & Object Storage ⚡️📦

Welcome to Phase 4! We are focusing on two of the most popular tools in modern web infrastructure: **Redis** and **Object Storage (S3)**.

In this phase, we make our application "Architecturally Sound." We aren't just building features—we are learning how to handle speed (Caching) and scale (File Storage).

---

## 📚 Lesson 1: Fast Data (Redis)

### What is Redis?
**Redis** is an "In-Memory Data Store." 
- **The Problem**: Databases like MongoDB store data on the **Disk (SSD)**. Disk is reliable but slow.
- **The Solution**: Redis stores data in **RAM (Memory)**. RAM is incredibly fast!
- **The Concept**: We use Redis as a **Cache**. Instead of hitting the database every time a user refreshes their gallery, we store a copy of the results in Redis and serve it instantly.

### The "Read-Aside" Pattern
This is the simplest caching pattern. It works like this:
1.  **Check Cache**: Look in Redis for the data.
2.  **Hit**: If found, return it immediately (Lightning fast!).
3.  **Miss**: If not found, fetch it from MongoDB as usual.
4.  **Populate**: Before returning the data, save a copy in Redis so the *next* request hits the cache.

---

## 📚 Lesson 2: Big Data (Object Storage)

### Why S3/MinIO?
**Object Storage** (like AWS S3 or our local **MinIO**) is designed to store images, videos, and large files. 
- **Rule #1**: *NEVER* store large image files directly in your database! It makes the database slow, expensive, and hard to back up.
- **The Better Way**: 
  - Store the **Actual Image File** in MinIO.
  - Store just the **URL/Key** pointing to that file in MongoDB.

---

## 🛠️ Your Task: Implementation

Your goal is to complete the Redis and S3 logic by following the `// TODO` comments in the code.

### Step 1: Redis "Read-Aside" Logic
Open `backend/src/controllers/imageController.js`. 
Look at the `getImages` function. You need to:
1.  Try to fetch the images from Redis using the provided `cacheKey`.
2.  If they exist (a "Hit"), parse them from a string back into JSON and return them.
3.  If they don't, fetch from MongoDB and then store the result in Redis using `redis.setex()`.

### Step 2: MinIO S3 Uploads
Open `backend/src/services/s3Service.js`.
You need to implement the actual upload logic using the AWS SDK:
1.  Construct a unique key for the file.
2.  Define the upload `params` (Bucket, Key, Body, ContentType).
3.  Execute the upload and return the resulting Key and URL.

---

## 🚀 Launching Phase 4

1.  **Start Background Services**:
    ```bash
    docker compose up -d redis minio
    ```
2.  **Verify with Tests**:
    Run the specific tests for these features. They will fail initially!
    ```bash
    cd backend
    npm test tests/image.test.js
    ```
3.  **Implementation**: Fill out the `// TODO` comments in `imageController.js` and `s3Service.js`.

Good luck, future Architect! You're learning the tools that power apps like Netflix and Uber.
