const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const minioClient = require('./config/minio');
const authRoutes = require('./routes/auth');
const imagesRoutes = require('./routes/images');
const analyticsRoutes = require('./routes/analytics');

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

app.listen(port, () => {
  console.log(`Server running on port ${port}!`);
});

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use('/api/auth', authRoutes);
app.use('/api/images', imagesRoutes);
app.use('/api/analytics', analyticsRoutes);