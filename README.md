# Phase 4 (Architectural Mastery): Caching & Object Storage ⚡️📦

Welcome to Phase 4. This is where we stop just "making it work" and start "making it scale." You are about to learn the infrastructure secrets that keep apps like Netflix, Twitter, and Spotify running at lightning speed for millions of users.

---

## 📚 Lesson: The Fast Path (Redis & In-Memory Caching)

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

### 4. Redis JSON
Modern Redis supports native JSON storage via the **Redis Stack** image. This means:
- **No `JSON.stringify()`** before saving
- **No `JSON.parse()`** after reading
- Just store and retrieve JavaScript objects directly!

### 🐳 Docker Image: Redis Stack
We use `redis/redis-stack` which includes:
- **Redis 7** - The core database
- **RedisJSON** - Native JSON support (no manual serialization)
- **RedisInsight** - Built-in GUI for exploring your data

Update your `docker-compose.yml` to use:
```yaml
redis:
  image: redis/redis-stack:latest
  container_name: learning-redis
  ports:
    - '6379:6379'
    - '8001:8001'  # RedisInsight UI
```

### 📦 NPM Package
Install the official Redis client:
```bash
npm install redis
```

### 🔍 Using RedisInsight
Once your stack is running, open your browser to:
```
http://localhost:8001
```
This gives you a visual interface to:
- Browse keys
- View/ edit JSON values
- Monitor cache performance

---

## 🛠️ Your Mission: Implementation Challenge

### Step 1: Redis "Read-Aside"
Using the **official `redis` npm package**, implement the Read-Aside pattern in `backend/src/controllers/imageController.js`:
- Use `JSON.GET` to retrieve data directly as objects
- Use `JSON.SET` to store data directly without serialization
- Open RedisInsight at `http://localhost:8001` to visualize your cache!

---

## 🚀 Pro-Tip: Cache Invalidation
We have already provided the "Invalidation" code in `uploadImage` and `worker.js`. 
**Why?** Because if a user uploads a new image, the "old" list of images stored in Redis is now **STALE** (out of date). By deleting the key in Redis, we force the next request to go to MongoDB and get the fresh list!

Launch your stack and start the challenge:
```bash
docker compose up -d redis minio
cd backend
npm install redis
npm test tests/image.test.js
```

Then open RedisInsight to explore your cache:
```
http://localhost:8001