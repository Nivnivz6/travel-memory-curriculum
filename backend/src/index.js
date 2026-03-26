const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const minioClient = require('./config/minio');
const userAuthRoutes = require('./routes/auth');

// Load environment variables
dotenv.config();
const app = express();

// Connect to mongoose
connectDB();

const port = process.env.PORT;

// Example usage: listing buckets
(async () => {
  const bucketsList = await minioClient.listBuckets();
  console.log(
    `Buckets List: ${bucketsList.map((bucket) => bucket.name).join(",	")}`
  );
})();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use('/api', userAuthRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}!`);
});