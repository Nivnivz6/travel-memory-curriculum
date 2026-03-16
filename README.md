# Phase 5: Message Brokers & Microservices 📨⚙️

Welcome to the final phase of the course! You've built a powerful, secured, and cached application. Now, it's time to make it **Resilient** and **Scalable** using the "Microservices" mindset.

---

## 📚 The Lesson: The Event Loop & Background Tasks

### 1. The Bottleneck
Node.js is single-threaded. If you perform a heavy task (like resizing a 50MB image or running an AI model) directly inside your Express route:
- The entire server stops.
- New users cannot log in.
- The UI feels frozen.
- The server might crash if multiple users upload at once.

### 2. The Solution: Asynchronous Processing (Queues)
Instead of processing the image immediately, the API says: *"I saved your image in the DB and MinIO. Now I'm sending a message to the **Queue**. I'll tell you the status is 'pending', and you can go back to browsing!"*

### 3. What is RabbitMQ?
**RabbitMQ** is a Message Broker. Think of it as a post office:
- **The Publisher (API)**: Drops a "Letter" (Message) into the mailbox (Queue).
- **The Queue**: Holds the letters in order.
- **The Consumer (Worker)**: Picks up the letter whenever it's ready, processes it, and throws it away.

### 4. Decoupling
By using a separate `worker.js`, you have decoupled your app. You could even run the API on one server and the Worker on a completely different, high-power server with more GPU/RAM!

---

## 🛠️ Your Task: Wire up the Broker

### Prerequisites
Ensure RabbitMQ is running in Docker:
```bash
docker compose up -d rabbitmq
```

### Step 1: The Publisher
Open `backend/src/services/queueService.js`.
You need to implement the `publishMessage` function:
1. Use `channel.assertQueue()` to make sure the `image-processing` queue exists.
2. Use `channel.sendToQueue()` to send the message. 
    - **Crucial**: RabbitMQ only accepts **Buffers**. Use `Buffer.from(JSON.stringify(message))`.
    - **Pro Tip**: Set `{ persistent: true }` so your message isn't lost if the broker restarts.

### Step 2: The Consumer (Worker)
Open `backend/src/worker.js`.
The worker connects to RabbitMQ and listens for messages. You need to:
1. Parse the incoming message content.
2. Update the MongoDB document status to `processed`.
3. Clear the user's Redis cache (so they see the update!).
4. **The most important part**: Use `channel.ack(msg)` to "Acknowledge" the message. If you don't do this, RabbitMQ will think the worker failed and send the message again!

---

## 🧪 Verification

1.  **Run Publisher Tests**:
    ```bash
    cd backend
    npm test tests/queue.test.js
    ```
2.  **Manual Test**:
    - Start the worker in one terminal: `npm run worker`
    - Upload an image in the UI.
    - Watch your worker terminal! You should see the console logs firing when the message arrives.
    - Refresh your gallery. The image should transition from 'Pending' to 'Processed'!

Congratulations! You've just built a modern, distributed system. 🚀
