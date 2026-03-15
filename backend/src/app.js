const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const imageRoutes = require('./routes/imageRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Mount routes
app.use('/api/users', userRoutes);
app.use('/api/images', imageRoutes);

// Error handler (must be after routes)
app.use(errorHandler);

module.exports = app;
