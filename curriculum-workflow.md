# Process: Comprehensive Full-Stack Learning Project Generation

## Agent Instructions
You are an expert technical instructor. Your goal is to generate a multi-branch Git repository for Windows users running WSL. You must write extremely detailed `README.md` files for each branch. The tests must be cumulative.

## Phase 0: The Master Build (Branch: `main`)
1.  Initialize a local Git repository.
2.  **Backend:** Build the fully functioning API (Node, Express, MongoDB, Redis, RabbitMQ, MinIO) in a `backend/` directory.
3.  **Frontend:** Build a React SPA using Vite in a `frontend/` directory with UI for uploading and viewing images.
4.  **Infrastructure:** Create a `docker-compose.yml` in the root running MongoDB, Redis, RabbitMQ, and MinIO. 
5.  **Testing:** Write Jest/Supertest coverage for backend endpoints using `mongodb-memory-server` and mocking.
6.  Verify all tests pass.

---

## Phase 1: WSL, Git, & Frontend Basics (Branch: `phase-1`)
1.  **Branching:** Checkout `phase-1` from `main`.
2.  **Code Strip:** * **Backend:** Remove ALL backend logic, leaving only a completely empty `backend/` folder.
    * **Frontend:** Inside `frontend/`, clear out the React component logic. Leave the JSX structure, but remove `fetch` calls and state hooks (`useState`, `useEffect`). Add `// TODO:` comments.
3.  **Tests:** Remove all backend tests.
4.  **Generate `README.md`:** * **WSL Setup:** Exact steps for Windows 11: PowerShell Admin -> `wsl --install` -> Docker Desktop -> WSL2 integration -> VS Code WSL extension -> Clone repo.
    * **The Lesson:** What is a Single Page Application (SPA)? What are React components? How do `useState` and `useEffect` work?
    * **The Task:** Wire up the React UI state. Write the `fetch` functions to call `http://localhost:3000/api/images` (even though the backend doesn't exist yet, it prepares them for Phase 2).

---

## Phase 2: Express Basics & API Integration (Branch: `phase-2`)
1.  **Branching:** Checkout `phase-2` from `main`.
2.  **Code Strip:** Restore the `backend/` folder from `main`, but remove all DB, cache, storage, and queue logic. Leave empty Express routes with `// TODO:` comments. Ensure `cors` is enabled.
3.  **Tests:** Introduce basic Express routing and HTTP status code tests.
4.  **Generate `README.md`:**
    * **The "Magic" Database Command:** Tell them to run `docker compose up -d db` to get their database ready in the background.
    * **The Lesson:** What is Node.js? What is Express? What is a REST API? Explain CORS and why the frontend needs permission to talk to the backend.
    * **The Task:** Build the Express routes. Once built, open the Phase 1 React app and click "Upload"—watch it successfully hit the new Express backend!

---

## Phase 3: The Data Layer (Branch: `phase-3`)
1.  **Branching:** Checkout `phase-3` from `main`.
2.  **Code Strip:** Remove Mongoose schemas and controller logic. Add `// TODO:` comments.
3.  **Tests:** Keep Phase 2 tests. Add MongoDB CRUD tests.
4.  **Generate `README.md`:** * **The Lesson:** Document Databases vs SQL. What is an ODM (Mongoose)? 
    * **The Task:** Define Mongoose models and wire them into the Express routes. Now the React frontend will actually save data persistently!

---

## Phase 4: Demystifying Docker (Branch: `phase-4`)
1.  **Branching:** Checkout `phase-4` from `main`.
2.  **Code Strip:** Delete the backend `Dockerfile` contents. Remove the Node.js service from `docker-compose.yml`. Add `// TODO:` comments.
3.  **Tests:** Keep previous tests. Add an infrastructure build test.
4.  **Generate `README.md`:**
    * **The Lesson:** Containers vs VMs. What does a `Dockerfile` do? Docker networks.
    * **The Task:** Write the backend `Dockerfile`. Add the backend to `docker-compose.yml`. Run `docker compose up --build`.

---

## Phase 5: Caching & Object Storage (Branch: `phase-5`)
1.  **Branching:** Checkout `phase-5` from `main`.
2.  **Code Strip:** Remove Redis caching and MinIO S3 upload logic. Add `// TODO:` comments.
3.  **Tests:** Keep previous tests. Add Redis and MinIO tests.
4.  **Generate `README.md`:**
    * **The Lesson:** RAM vs Disk storage. Redis as a cache. Object Storage (S3/MinIO) for image files.
    * **The Task:** Implement Redis caching and the S3 SDK upload function. Run `docker compose up -d redis minio`.

---

## Phase 6: Message Brokers & Microservices (Branch: `phase-6`)
1.  **Branching:** Checkout `phase-6` from `main`.
2.  **Code Strip:** Remove the RabbitMQ publisher logic in Express and the consumer logic in the worker. Add `// TODO:` comments.
3.  **Tests:** Include ALL tests. Add queue mocked tests.
4.  **Generate `README.md`:**
    * **The Lesson:** Message Brokers (RabbitMQ), Queues, Pub/Sub model, and decoupling background workers.
    * **The Task:** Publish a "New Image" message to RabbitMQ. Write the worker service to process it. Run `docker compose up -d rabbitmq`.