# Phase 4 (Architectural Mastery): Caching & Object Storage ⚡️📦

Welcome to Phase 4. This is where we stop just "making it work" and start "making it scale." You are about to learn the infrastructure secrets that keep apps like Netflix, Twitter, and Spotify running at lightning speed for millions of users.

---

## 📚 Lesson: The Fast Path (Redis & In-Memory Caching)

### 1. The Physical Reality: RAM vs. Disk
To understand why we use Redis, you must understand your computer's "Storage Hierarchy":
- **Disk (HDD/SSD)**: This is where MongoDB lives. It stores data on physical/electronic platters. It is **persistent** (permanent) but **slow** because it takes time to find and read data. Access time is usually measured in **milliseconds (ms)**.
- **RAM (Memory)**: This is where **Redis** lives. It is **volatile** (data is lost if the power goes out) but **extremely fast**. Access time is measured in **nanoseconds (ns)**.

> TIP:
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

### Step 1: Add Redis
Using the official `redis` npm package, add Redis to the backend and implement a **Read-Aside cache** in your backend. The goal is to cache the image list so repeated reads can be served from Redis instead of hitting MongoDB every time.

### Step 2: Invalidate the Relevant Cache on New Upload
When a new image is uploaded, invalidate the relevant cache entry so users do not receive stale data. This means the next read should miss the cache, fetch fresh data from MongoDB, and then repopulate Redis with the updated result.
>   Refer to the `Redis JSON` documentation to ensure you're using the most appropriate command for your use case

---

## 🔗 Resources & References
For RedisJSON usage and command examples, read the official Redis documentation:
https://redis.io/docs/latest/operate/oss_and_stack/stack-with-enterprise/json/commands/ 
