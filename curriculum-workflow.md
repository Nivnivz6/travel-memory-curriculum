# Process: Comprehensive Backend Learning Project Generation

## Agent Instructions
You are an expert technical instructor. Your goal is to generate a multi-branch Git repository for Windows users running WSL. You must write extremely detailed `README.md` files for each branch. The tests must be cumulative (Phase 2 includes Phase 1 tests, etc.).

## Phase 0: The Master Build (Branch: `main`)
1.  Initialize a local Git repository.
2.  Build the complete, fully functioning Image Upload API (Node, Express, MongoDB, Redis, RabbitMQ, MinIO S3).
3.  **Infrastructure:** Create a comprehensive `docker-compose.yml` that runs MongoDB, Redis, RabbitMQ, AND MinIO (configured as a local S3 replacement). 
4.  **Testing:** Write comprehensive Jest/Supertest coverage for all endpoints. Use `mongodb-memory-server` for database tests. Configure the AWS SDK in the tests to point to the local MinIO endpoint instead of the real AWS cloud.
5.  Verify all tests pass.

---

## Phase 1: WSL, Git, & Express Basics (Branch: `phase-1`)
1.  **Branching:** Checkout `phase-1` from `main`.
2.  **Code Strip:** Remove all DB, cache, storage, and queue logic. Leave empty Express routes with `// TODO:` comments specifying required HTTP methods, endpoints, and status codes.
3.  **Tests:** Keep ONLY the basic Express routing and HTTP status code tests.
4.  **Generate `README.md`:** Write a massive, beginner-friendly guide covering:
    * **WSL Setup (Crucial):** Exact steps for Windows 11: Open PowerShell as Admin -> Run `wsl --install` -> Install Docker Desktop -> Enable WSL2 integration in Docker settings -> Install VS Code -> Install "WSL" VS Code extension -> Open Ubuntu terminal and clone the repo.
    * **The "Magic" Database Command:** Explain that they don't need to know Docker yet. Give them the exact command: `docker compose up -d db` and explain it simply runs MongoDB in the background so they don't have to install it on Windows.
    * **The Lesson:** What is Node.js? What is Express? What is a REST API? What are HTTP status codes (200, 201, 400, 404, 500)?
    * **The Task:** How to run `npm install`, how to run `npm run test:watch`, and instructions to make the Phase 1 tests pass.

---

## Phase 2: The Data Layer (Branch: `phase-2`)
1.  **Branching:** Checkout `phase-2` from `main`.
2.  **Code Strip:** Remove Mongoose schemas and controller logic for saving/fetching data. Replace with `// TODO:` comments.
3.  **Tests:** Keep Phase 1 tests. Add MongoDB CRUD tests (create user, fetch image metadata).
4.  **Generate `README.md`:** * **The Lesson:** What is a Document Database? How is NoSQL (MongoDB) different from SQL (Postgres)? What is an ODM (Mongoose) and why do we use schemas in a schemaless database?
    * **The Task:** Instructions on how to define the Mongoose models and wire them into the Express routes to pass the Phase 2 tests. Remind them to ensure their `docker compose up -d db` is still running.

---

## Phase 3: Demystifying Docker (Branch: `phase-3`)
1.  **Branching:** Checkout `phase-3` from `main`.
2.  **Code Strip:** Delete the `Dockerfile` contents. Open the `docker-compose.yml` and remove the Node.js `api` service (leave MongoDB running). Replace with `// TODO:` comments.
3.  **Tests:** Keep previous tests. Add a shell script test that verifies the `Dockerfile` builds successfully.
4.  **Generate `README.md`:**
    * **The Lesson:** "Remember that magic command from Phase 1? Here is how it works." Explain Containers vs. Virtual Machines. Explain Images vs. Containers. Explain what a `Dockerfile` does step-by-step (`FROM`, `WORKDIR`, `COPY`, `RUN`, `CMD`). Explain Docker networks and how the Node container will talk to the Mongo container.
    * **The Task:** Write the `Dockerfile` for the Node application. Add the Node application back into the `docker-compose.yml`. Run `docker compose up --build` to launch the *entire* stack at once.

---

## Phase 4: Caching & Object Storage (Branch: `phase-4`)
1.  **Branching:** Checkout `phase-4` from `main`.
2.  **Code Strip:** Remove Redis caching middleware. Remove the AWS S3 SDK upload logic that points to MinIO. Replace with `// TODO:` comments.
3.  **Tests:** Keep previous tests. Add tests for Redis cache-hits and MinIO S3 uploads.
4.  **Generate `README.md`:**
    * **The Lesson:** Why is reading from a database slow? Introduce RAM vs. Disk storage. Explain Redis as an in-memory key-value store. Next, explain Object Storage (S3). Explain how MinIO gives us a local S3-compatible environment to practice with. Why do we save image URLs in MongoDB but the actual image file in S3/MinIO?
    * **The Task:** Implement a Redis cache for a high-traffic `GET` route. Implement the S3 SDK upload function pointing to the local MinIO URL. Instruct them to run `docker compose up -d redis minio` to add the cache and storage to their background services.

---

## Phase 5: Message Brokers & Microservices (Branch: `phase-5`)
1.  **Branching:** Checkout `phase-5` from `main`.
2.  **Code Strip:** Remove the RabbitMQ publisher logic in the Express API. Remove the consumer/processing logic in the background worker service. Replace with `// TODO:` comments.
3.  **Tests:** Include ALL tests. Add mocked queue publishing/consuming tests.
4.  **Generate `README.md`:**
    * **The Lesson:** What happens if an image takes 10 seconds to process? The user waits 10 seconds. Introduce Message Brokers (RabbitMQ), Queues, and the Pub/Sub model. Explain decoupling and background workers.
    * **The Task:** Make the Express API publish a "New Image" message to RabbitMQ and immediately return a `200 OK`. Write the worker service that listens to the queue, "processes" the image, and updates MongoDB. Instruct them to spin up the final piece of infrastructure: `docker compose up -d rabbitmq`.