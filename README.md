# Phase 4 (Architectural Mastery): Caching & Object Storage ⚡️📦

Welcome to Phase 4. This is where we stop just "making it work" and start "making it scale." You are about to learn the infrastructure secrets that keep apps like Netflix, Twitter, and Spotify running at lightning speed for millions of users.

---

## 📚 Lesson 1: The Fast Path (Redis & In-Memory Caching)

### 1. The Physical Reality: RAM vs. Disk
To understand why we use Redis, you must understand your computer's "Storage Hierarchy":
- **Disk (HDD/SSD)**: This is where MongoDB lives. It stores data on physical/electronic platters. It is **persistent** (permanent) but **slow** because it takes time to find and read data. Access time is usually measured in **milliseconds (ms)**.
- **RAM (Memory)**: This is where **Redis** lives. It is **volatile** (data is lost if the power goes out) but **extremely fast**. Access time is measured in **nanoseconds (ns)**.

> [!TIP]
> Reading from Redis is often **50x to 100x faster** than reading from MongoDB!

### 2. What is Redis?
Redis is a **Key-Value Store**. It doesn't have tables, rows, or complex relationships. It just maps a unique **Key** (like a name) to a **Value** (like a piece of data). 
In this project, we use it as a **"Read-Aside" Cache**.

### 3. The "Read-Aside" Implementation Pattern
This is the pattern you will implement today. It involves three distinct steps:
1. **Check**: Does Redis have the data? (A "Cache Hit")
2. **Retrieve**: If not (a "Cache Miss"), go to MongoDB.
3. **Populate**: Save the MongoDB result into Redis so the *next* request is a "Hit."

### 4. Serialization (JSON stringify/parse)
Redis only understands bytes and strings. It doesn't know what a "JavaScript Object" is.
- **Saving**: You must `JSON.stringify()` your data before `SET`-ing it in Redis.
- **Reading**: You must `JSON.parse()` the string back into an object after `GET`-ing it.

---

## 📚 Lesson 2: The Storage Path (Object Storage / S3)

### 1. The "Blob" Problem
As an instructor, I've seen many juniors try to store actual image files inside MongoDB. **Don't do it.** 
Binary data (Blobs) makes a database:
- **Huge**: Backups take hours instead of seconds.
- **Slow**: MongoDB has to load huge chunks of data into its memory just to find a simple record.
- **Fragile**: Single record limits (16MB in Mongo) can break your app.

### 2. The Solution: Object Storage (MinIO/S3)
**Object Storage** is a specialized file system for the cloud. It doesn't use "folders" in the traditional sense; it uses **Buckets** and **Keys**.
- **Bucket**: Your top-level container (e.g., `learning-uploads`).
- **Key**: The unique path/name of the file (e.g., `uploads/1700-landscape.jpg`).
- **Separation of Concerns**: We store the **file bytes** in MinIO and only store the **URL/Key** in MongoDB. This keeps MongoDB fast and lean.

### 3. Content-Types
When you upload to S3, you must tell it the **ContentType** (e.g., `image/jpeg`). If you don't, the browser won't know how to render the file when a user visits the URL, and it might just download the file instead of showing it!

---

## 🛠️ Your Mission: Implementation Challenge

### Step 1: Redis "Read-Aside"
Open `backend/src/controllers/imageController.js`. Find the `getImages` function. 
Implement the logic to check Redis first. If it's a "Miss," fetch from the DB and populate the cache.

### Step 2: Structured S3 Practice
Open `backend/src/services/s3Service.js`. 
We have broken the `uploadFile` function into several logical checkpoints for you:
1. **Generation**: Create a unique key using a timestamp.
2. **Configuration**: Construct the `params` object required by the AWS SDK.
3. **Execution**: Fire the `.upload()` and wait for the response.
4. **Integration**: Return the data needed by the controller.

---

## 🚀 Pro-Tip: Cache Invalidation
We have already provided the "Invalidation" code in `uploadImage` and `worker.js`. 
**Why?** Because if a user uploads a new image, the "old" list of images stored in Redis is now **STALE** (out of date). By deleting the key in Redis, we force the next request to go to MongoDB and get the fresh list!

Launch your stack and start the challenge:
```bash
docker compose up -d redis minio
cd backend
npm test tests/image.test.js
```
