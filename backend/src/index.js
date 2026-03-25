const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const minioClient = require('./config/minio');

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

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});