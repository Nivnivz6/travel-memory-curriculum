# Phase 3: Demystifying Docker 🐳

Welcome to Phase 3! In the previous phases, you built the frontend and the core backend logic. However, you were likely running each service (Database, Cache, API, Worker) in separate terminal windows, and you had to install software like Node.js directly on your machine.

In this phase, we are going to **Containerize** our application. We will use Docker to wrap our software in a self-hosting environment that runs identically on any machine—whether it's your colleague's laptop or a production server in the cloud.

---

## 📚 The Lesson: Containers & Infrastructure-as-Code

### 1. Containers vs. Virtual Machines (VMs)
Before Docker, if you wanted to isolate an application, you would use a **Virtual Machine**. 
- **VMs** include a full Guest Operating System (like a whole second copy of Linux or Windows), which makes them slow to start and heavy on resources (GBs of RAM).
- **Containers** share the host machine's Operating System kernel. They are "chroot on steroids"—extremely lightweight, starting in seconds, and using only MBs of RAM.

### 2. Images vs. Containers
- **Image**: A blue-print. It's a read-only template (like a Class in OOP) that contains your code, libraries, and environment variables.
- **Container**: A running instance of an image (like an Object in OOP). You can start 10 containers from the same 1 image.

### 3. The Dockerfile: Our Recipe
A `Dockerfile` is a text file that contains the instructions to build an image. Common keywords include:
- `FROM`: The starting point (usually a base OS or language runtime).
- `WORKDIR`: Sets the "home" folder inside the container.
- `COPY`: Pulls files from your machine into the container.
- `RUN`: Executes commands (like `npm install`) during the build process.
- `CMD`: The final command that runs when the container starts.

### 4. Docker Compose & Networking
Managing 5 different containers manually is a nightmare. **Docker Compose** allows us to define our entire architecture in a single YAML file. 
When you run containers via Compose, Docker automatically creates a **Virtual Network**. Containers can talk to each other using their service names as hostnames! 
- Instead of `localhost:27017`, your backend will connect to `db:27017`.

---

## 🛠️ The Task: Containerize the Stack

Your goal is to get the entire Full-Stack application running with a single command: `docker compose up --build`.

### Step 1: Write the Dockerfile
Navigate to `backend/Dockerfile`. It is currently just a list of TODOs. 
Fill it out to build a Node.js image that:
1. Uses `node:18-alpine`.
2. Sets `/app` as the workdir.
3. Copies your `package.json` and installs dependencies.
4. Copies your source code.
5. Starts the server.

### Step 2: Update Docker Compose
Open the `docker-compose.yml` file in the root directory. You will notice the `db`, `redis`, `rabbitmq`, and `minio` services are already there, but the **Backend API** is missing!
1. Add a service named `api`.
2. Configure it to `build: ./backend`.
3. Map port `3000:3000`.
4. Add the necessary environment variables (copy them from your `.env`).
   - **CRITICAL**: Update your connection strings! Instead of `localhost`, use the service names defined in the YAML (e.g., `REDIS_URL=redis://redis:6379`).

### Step 3: Verify with our Test Script
We've provided a helper script to check if your infrastructure configuration is valid. Run it from the root:
```bash
bash test-docker.sh
```

---

## 🚀 Final Launch

Once your Dockerfile is ready and Compose is wired up, launch the entire stack:
```bash
docker compose up --build
```

If successful, navigate to `http://localhost:5173/` (start your frontend locally for now, or dockerize it too if you're feeling adventurous!). You should be able to upload images, and the backend will process them entirely inside Docker containers!
