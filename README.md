# Travel Memory App — The Master Build (Phase 0) 

## Architecture Overview
This application demonstrates a production-grade architecture scaled down for local development:
- **Frontend:** React SPA built with Vite.
- **Backend API:** Node.js & Express REST API.
- **Primary Database:** MongoDB (Document Store).
- **Cache:** Redis (In-memory Key-Value Store).
- **Object Storage:** MinIO (Local S3-compatible storage for image files).
- **Message Broker:** RabbitMQ.
- **Background Worker:** A Node.js worker service that processes messages out-of-band.

## 📚 The Lesson Concepts (Master Build)
Here is a combined overview of the core technologies you will learn by studying this branch:


### 1. React — Components, Hooks & Data Fetching
**React SPAs** render a single HTML page and use a **Virtual DOM** to swap components instantly, avoiding slow page reloads. We translate clean HTML/CSS into a reusable component tree and manage UI data using hooks.

- `useState` — local state for controlled inputs and UI toggles
- `useEffect` / `useRef` — side effects, DOM access, and cleanup
- `useContext` / `useReducer` — shared state and complex state machines
- `useMemo` / `useCallback` — performance optimization and stable references
- **Custom Hooks** — reusable logic extracted from components (e.g. `useDebounce`, `useLocalStorage`)
- **TanStack Query** — the standard for server-state: fetching, caching, mutations, and cache invalidation without manual `useEffect` fetch patterns


### 2. Node.js, Express, MongoDB & S3
**Node.js** executes JavaScript on the server. **Express.js** provides routing to build a REST API (GET, POST, PUT, DELETE). We use **Mongoose** (ODM) to enforce schema structure on top of MongoDB's flexible JSON-like documents, and **AWS S3 / MinIO** for binary file storage.


For file uploads, React requests a **pre-signed URL** from Express, then uploads directly to S3/MinIO — keeping large binary data off your API server. We protect routes using JWTs (`Authorization: Bearer <token>`) and ensure **data isolation** by scoping all queries to `req.user._id`.


### 3. Docker & Docker Compose
**Docker** packages each service (React, Express, MongoDB, Redis, RabbitMQ, MinIO) into an isolated **container** with its own dependencies, so the app runs identically on every machine. **Docker Compose** orchestrates all containers from a single `compose.yml` file.

Key concepts: service networking (containers talk by service name, not `localhost`), volume mounts for data persistence, and environment variable injection via `.env` files.


### 4. Redis — Caching & Session Storage
**Redis** is an in-memory key-value store used to make repeated operations fast. We apply the **cache-aside pattern**: check Redis first; if the data is missing (cache miss), fetch from MongoDB and store it in Redis with a TTL.

Cache **invalidation on mutation** is equally important — when a task is updated or deleted, we delete its Redis key so stale data is never served.


### 5. RabbitMQ — Async Messaging
**RabbitMQ** is a message broker that decouples services using a **Producer → Exchange → Queue → Consumer** topology. Instead of doing slow or unreliable work (emails, notifications, processing) synchronously inside an API request, we publish a message and let a worker handle it independently.

We also cover **dead-letter queues (DLQ)** to handle failed messages gracefully without data loss.

## 🚀 Getting Started

To run this complete architecture on your local machine, follow these exact steps.

### Prerequisites
1. **Windows Subsystem for Linux (WSL)** installed.
2. **Docker** and **Docker Compose** installed on WSL.
3. **Node.js** installed within your WSL environment + **Mode Version manager (NVM)** with node version 24.14v and above.

