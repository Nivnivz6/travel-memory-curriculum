# Phase 4: Caching & Object Storage ⚡️📦

In this phase, we move beyond basic CRUD operations and delve into **Performance** and **Scalability**. We will solve two major infrastructure challenges:
1. **Caching with Redis**: Reduce database load by storing frequent query results in memory.
2. **Object Storage with MinIO (S3)**: Store binary image files in a dedicated storage service instead of the database.

---

## 📚 The Lesson: RAM vs. Disk

### 1. The Speed Gap
Data in your computer lives in two main places:
- **Disk (HDD/SSD)**: Where MongoDB stores your documents. It is persistent (permanent) but relatively slow because it requires physical or electronic seeking.
- **RAM (Memory)**: Where **Redis** stores data. It is volatile (lost if power goes out) but incredibly fast (nanoseconds vs. milliseconds).

### 2. Why Redis? (In-Memory Caching)
When a user visits their image gallery, the backend queries MongoDB. If they refresh the page 10 times, the backend hits the database 10 times. 
By using **Redis as a cache**, we can:
1. Check Redis for the "Gallery Data".
2. If found (a **Cache Hit**), return it instantly.
3. If not found (a **Cache Miss**), query MongoDB, return the data, and then **SET** that data in Redis so the next request is a Hit!

### 3. Object Storage (S3/MinIO) vs. Databases
A common mistake is storing actual image files (blobs) directly inside a database like MongoDB. This makes the database bloated, slow, and expensive to back up.
**The Industry Standard Approach:**
- **MinIO/S3**: Stores the actual `.jpg` or `.png` binary file.
- **MongoDB**: Stores only the **metadata** (the URL/Key) pointing to that file.

---

## 🛠️ The Task: Implement Caching & Storage

Your goal is to fill out the `// TODO` comments in the backend to make the infrastructure functional.

### Prerequisites
Make sure your background services are running:
```bash
docker compose up -d redis minio
```

### Step 1: Redis Caching Middleware
Open `backend/src/middleware/cache.js`. 
You need to implement the logic to:
1. Generate a unique cache key based on the request URL and user ID.
2. Check if a value exists in Redis.
3. If missing, capture the response and store it in Redis using `client.setex()` (with a TTL like 3600 seconds).

### Step 2: Cache Invalidation
Open `backend/src/controllers/imageController.js` and `backend/src/worker.js`.
Caching is great, but if a user uploads a new image, the cache is now **stale** (it lacks the new image). 
1. In the `uploadImage` controller, add logic to **DEL**ete the cache key for that user.
2. In the `worker.js`, ensure the cache is also cleared after the image status changes to 'processed'.

### Step 3: MinIO S3 Uploads
Open `backend/src/services/s3Service.js`.
We need to actually send the file buffer to MinIO. 
1. Use the `s3.upload()` method from the AWS SDK.
2. Pass the `Bucket`, `Key`, `Body`, and `ContentType`.
3. Return the `Key` and `Location` (URL) so MongoDB can save them.

---

## 🧪 Verification

To check if your implementation is correct, run the targeted test suite:
```bash
cd backend
npm test tests/cache.test.js tests/image.test.js
```

If everything passes, restart your app and try uploading an image. Notice how the first load takes a moment, but subsequent refreshes of the gallery are near-instant thanks to Redis!
