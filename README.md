# Phase 4: The Art of Caching & Object Storage ⚡️📦

Welcome to your most critical engineering lesson. In this phase, we transition from building "features" to building **Systems**. You aren't just a coder anymore; you are becoming an **Architect**.

Professional applications like Netflix, Twitter, or Uber do not just fetch data from a database. They use multiple layers of storage to achieve sub-second response times. Today, we master **Redis** and **MinIO**.

---

## 🏛️ Part 1: What is Redis? (The Speed Layer)

### The Hardware Reality
To understand Redis, you must understand where your computer puts data:
- **Disk (HDD/SSD)**: This matches your "Long-term Memory." It's vast, persistent (survives a reboot), but physically "heavy" to access. MongoDB lives here.
- **RAM (Memory)**: This is your "Short-term / Working Memory." It's incredibly fast but limited in size. **Redis lives here.**

| Feature | MongoDB (Disk) | Redis (RAM) |
| :--- | :--- | :--- |
| **Speed** | Slow (10ms - 100ms) | Extreme (< 1ms) |
| **Persistence** | Permanent | Volatile (by default) |
| **Data Model** | Documents / Schemas | Key-Value Pairs |
| **Analogy** | A library with millions of books. | A sticky note on your monitor with 10 facts. |

### Redis: The "Key-Value" Superpower
Redis is a **NoSQL Key-Value Store**. It doesn't have tables or complex relationships. It maps a `key` (a unique string) to a `value` (JSON, strings, lists, etc.).

**Example:**
- `Key`: `user_profile:123`
- `Value`: `{"username": "traveler01", "avatar": "blue_sky.jpg"}`

---

## 🌪️ Part 2: The Logic of Caching

### Why do we Cache?
1. **Reduce Latency**: Users hate waiting. Caching turns a 200ms API call into a 5ms API call.
2. **Offload the Database**: MongoDB is expensive and power-hungry. If 1,000,000 people look at the same "Today's Trending Images," hitting MongoDB 1,000,000 times will crash your server. Caching allows you to hit MongoDB **once** and serve the result 999,999 times from memory.

### The "Cache-Aside" Pattern (Implementation Strategy)
This is the industry-standard pattern we are implementing today. It follows 3 rules:

1. **The Request**: A user asks for data.
2. **The Cache Look-up**: 
   - Check Redis: *"Do you have this?"*
   - **Cache Hit**: Redis has it. Return it immediately. (Total time: 1ms).
   - **Cache Miss**: Redis doesn't have it. (Total time: 1ms).
3. **The Database Fallback**:
   - If a Miss, query MongoDB. (Total time: 50ms).
   - **Populate Cache**: Save the MongoDB result into Redis so the *next* user gets a Hit.
   - Return data to the user.

---

## 🧨 Part 3: Cache Invalidation (The Danger Zone)

If you cache data, you eventually run into the **"Stale Data"** problem.
- You cache the image gallery.
- The user deletes an image.
- The user refreshes the page.
- **ERROR**: The cache still has the old list! The deleted image is still visible!

### How to Fix Stale Data:
1. **TTL (Time To Live)**: Every cache entry must have an expiration date (e.g., 1 hour). Even if we forget to update the cache, it will eventually "expire" and force a fresh fetch from the DB.
2. **Explicit Deletion (Busting)**: Whenever you modify data (POST, PUT, DELETE), your code must explicitly run `redis.del(key)`.

---

## 💻 Part 4: Implementation Example (Express Middleware)

In this phase, you are building a **Reusable Middleware**. This is a functional programming pattern where you can "wrap" any route to enable caching.

### Step-by-Step implementation Walkthrough:

#### 1. Constructing the Key
We need a unique key so User A doesn't see User B's images.
```javascript
const key = `images:${req.user._id}:${req.originalUrl}`;
```

#### 2. The Retrieval (The "Look-up")
```javascript
const cachedData = await client.get(key);
if (cachedData) {
  return res.json(JSON.parse(cachedData)); // PARSE string back to JSON
}
```

#### 3. The Interception (The "Populate")
How do we save data into Redis if the controller hasn't run yet? We **intercept** the `res.json` function!
```javascript
const originalJson = res.json.bind(res); // Save the original function

res.json = (data) => {
  // Before we send the response to the user, save it to Redis!
  client.setex(key, 3600, JSON.stringify(data)); // STRINGIFY data to string
  return originalJson(data); // Send the response as normal
};
```

---

## 🛠️ Your Mission: Phase 4 Challenge

Your branch is currently "broken." Redis caching is stripped out, and S3 uploads are failing.

### 1. Identify the Files
- `backend/src/middleware/cache.js`: The "brain" of our caching logic.
- `backend/src/services/s3Service.js`: The "bridge" to MinIO (Object Storage).
- `backend/src/controllers/imageController.js`: Where we "Bust" the cache.

### 2. Run the Infrastructure
You cannot use Redis if it's not running! Use Compose:
```bash
docker compose up -d redis minio
```

### 3. Verify with Tests
Run the targeted tests using Jest. They will fail, showing you exactly where your code is missing logic.
```bash
cd backend
npm test tests/cache.test.js
```

### 4. Implementation Task
Follow the `// TODO` comments in the files. Read the hints carefully—they provide the exact methods (`get`, `setex`, `del`) you need to succeed.

---

## 🚀 Pro-Tip: Object Storage (MinIO)
While caching makes the app fast, **Object Storage** makes the app scalable.
- **DO NOT** store image bytes in MongoDB.
- **DO** store image bytes in MinIO.
- **DO** store the URL returned by MinIO in MongoDB.

Good luck, Architect. The system is in your hands.
