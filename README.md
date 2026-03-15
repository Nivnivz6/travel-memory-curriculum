# Travel Memory App — The Master Build (Phase 0)

Welcome to the definitive, complete architecture of the Travel Memory App! This branch (`main`) contains the fully solved, fully implemented Full-Stack application.

## Architecture Overview
This application demonstrates a production-grade architecture scaled down for local development:
- **Frontend:** React SPA built with Vite.
- **Backend API:** Node.js & Express REST API.
- **Primary Database:** MongoDB (Document Store).
- **Cache:** Redis (In-memory Key-Value Store).
- **Object Storage:** MinIO (Local S3-compatible storage for image files).
- **Message Broker:** RabbitMQ.
- **Background Worker:** A Node.js worker service that processes messages out-of-band.

---

## 🚀 Getting Started

To run this complete architecture on your local machine, follow these exact steps.

### Prerequisites
1. **Windows Subsystem for Linux (WSL)** installed.
2. **Docker Desktop** installed and integrated with your WSL distribution.
3. **Node.js** installed within your Ubuntu/WSL environment (v18+ recommended).

### 1. Spin up the Infrastructure
This project relies on four separate background services. We use Docker Compose to spin them all up instantly without needing to install the software directly on your machine.

Open an Ubuntu terminal in this project root and run:
```bash
docker compose up -d
```
*Note: This will download and start MongoDB, Redis, RabbitMQ, and MinIO. It also automatically creates the `learning-uploads` bucket with a public read policy so images can be viewed.*

### 2. Install Dependencies
You need to install npm packages for both the backend and the frontend.

**Install Backend Dependencies:**
```bash
cd backend
npm install
```

**Install Frontend Dependencies:**
```bash
cd ../frontend
npm install
```

### 3. Start the Backend Services
The backend consists of two running processes: the API Server and the Background Worker.

Open a new terminal, navigate to the `backend/` directory, and start the API server:
```bash
cd backend
npm run dev
```

Open *another* new terminal, navigate to the `backend/` directory, and start the RabbitMQ worker:
```bash
cd backend
npm run worker
```

### 4. Start the Frontend Application
Open a final terminal, navigate to the `frontend/` directory, and start the React app:
```bash
cd frontend
npm run dev
```

### 5. View the App!
Navigate to `http://localhost:5173/` in your browser. 
You can now select an image, upload it, and watch the Full-Stack magic happen!
1. The frontend sends the image to the backend via POST `/api/images/upload`.
2. The backend uploads the file stream directly to MinIO.
3. The backend saves the MinIO URL to MongoDB.
4. The backend fires a "process-image" message to RabbitMQ.
5. The backend immediately responds `201 Created` to the frontend.
6. The frontend fetches the updated gallery grid from the backend (which reads from MongoDB/Redis).
7. In the background, the Worker consumes the RabbitMQ message and finalizes the processing.

---

## 🧪 Testing
The backend contains a comprehensive Jest test suite using `mongodb-memory-server` and mocked AWS/AMQP interfaces to ensure you can run tests rapidly cleanly without needing the Docker infrastructure running.

To verify the backend:
```bash
cd backend
npm test
```
