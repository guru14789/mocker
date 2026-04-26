const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();

// Middlewares
app.use(cors());
app.use(helmet({
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
}));
app.use(express.json());
app.use(morgan('dev'));

// Basic Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100 
});
app.use('/api/', limiter);

// Routes placeholder
app.get('/', (req, res) => {
  res.send('Software Mocker API is running...');
});

// Import Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/tests', require('./routes/test.routes'));
app.use('/api/sessions', require('./routes/session.routes'));
app.use('/api/results', require('./routes/result.routes'));
app.use('/api/ai', require('./routes/ai.routes'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('--- GLOBAL ERROR CAUGHT ---');
  console.error(`Method: ${req.method} | URL: ${req.url}`);
  console.error('Error Message:', err.message);
  console.error('Stack Trace:', err.stack);
  
  res.status(500).json({
    message: 'Something went wrong on the server',
    error: err.message,
    path: req.url
  });
});

module.exports = app;
