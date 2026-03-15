# Process: Comprehensive Full-Stack Learning Project Generation

## Agent Instructions
You are an expert technical instructor. Your goal is to generate a multi-branch Git repository for Windows users running WSL. You must write extremely detailed `README.md` files for each branch. The tests must be cumulative.

## Phase 0: The Master Build (Branch: `main`)
1.  Initialize a local Git repository.
2.  **Backend:** Build the fully functioning API in a `backend/` directory. Must include Node, Express, MongoDB, Redis, RabbitMQ, MinIO, **and JWT User Authentication (bcrypt/jsonwebtoken)**.
3.  **Frontend:** Build a React SPA using Vite in a `frontend/` directory. Must use a modular `src/components/` structure (Login, Register, Upload, Gallery). Enforce Data Isolation (users only see their own images).
4.  **Infrastructure:** Create a `docker-compose.yml` in the root running MongoDB, Redis, RabbitMQ, and MinIO. 
5.  **Testing:** Write Jest/Supertest coverage for backend endpoints using `mongodb-memory-server` and mocking. Write React Testing Library tests for the frontend.
6.  Verify all tests pass.

---

## Phase 1: WSL, Git, & Frontend Basics (Branch: `phase-1`)
1.  **Branching:** Checkout `phase-1` from `main`.
2.  **Code Strip:** * **Backend:** Remove ALL backend logic, leaving only a completely empty `backend/` folder.
    * **Frontend:** Inside `frontend/src/components/`, clear out the logic for the Login, Register, Upload, and Gallery components. Leave the JSX structure, but remove `fetch` calls, JWT token handling, and state hooks (`useState`, `useEffect`). Add `// TODO:` comments.
3.  **Tests:** Keep the frontend React tests intact so they fail. Remove all backend tests.
4.  **Generate `README.md`:** * **WSL Setup:** Exact steps for Windows 11: PowerShell Admin -> `wsl --install` -> Docker Desktop -> WSL2 integration -> VS Code WSL extension -> Clone repo.
    * **The Lesson:** What is a Single Page Application (SPA)? What are React components? How do `useState` and `useEffect` work? How do we store JWTs in `localStorage`? Include links to official React and MDN fetch docs.
    * **The Task:** Wire up the React UI state and build the `fetch` functions to call the (soon-to-exist) API endpoints. Pass the frontend tests.

---

## Phase 2: Express Basics & API Auth (Branch: `phase-2`)
1.  **Branching:** Checkout `phase-2` from `main`.
2.  **Code Strip:** Restore the `backend/` folder from `main`, but remove all DB, cache, storage, queue, and auth routing logic. Leave empty Express routes (including `/register`, `/login`, and `/upload`) with `// TODO:` comments. Remove the JWT verification middleware logic. Ensure `cors` is enabled.
3.  **Tests:** Introduce Express routing and Auth tests (they should fail initially).
4.  **Generate `README.md`:**
    * **The "Magic" Command:** Tell them to run `docker compose up -d db` to get MongoDB ready.
    * **The Lesson:** What is Node.js/Express? What is a REST API? Explain CORS. Explain User Authentication, password hashing (bcrypt), and JSON Web Tokens (JWT).
    * **The Task:** Build the Express routes and the Auth middleware. Once built, open the Phase 1 React app and actually register/login!

---

## Phase 3: The Data Layer & Isolation (Branch: `phase-3`)
1.  **Branching:** Checkout `phase-3` from `main`.
2.  **Code Strip:** Remove Mongoose User and Image schemas. Remove controller logic for saving/fetching data. Add `// TODO:` comments (especially noting that the Image schema needs a `userId` reference).
3.  **Tests:** Keep Phase 2 tests. Add MongoDB CRUD and Data Isolation tests.
4.  **Generate `README.md`:** * **The Lesson:** Document Databases vs SQL. What is an ODM (Mongoose)? Explain Data Isolation—why we tie images to specific user IDs.
    * **The Task:** Define Mongoose models and wire them into the Express routes. Ensure the gallery route only returns images matching the logged-in user's ID.

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