const { findUser } = require('./user');
const bcrypt = require('bcrypt');
const express = require('express');
const axios = require('axios');
const logger = require('./logger');
const cors = require('cors');
const promClient = require('prom-client');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(cors());
app.use(express.json());

const isDev = true; // should add this to .env

// Helper function to log messages to the console if isDev is true
const debugLog = (level, message, meta) => {
  if (isDev) {
    console.log(`[${level.toUpperCase()}] ${message}`, meta || '');
  }
};

async function checkIP(ipAddress) {
  try {
    const response = await axios.get(`http://localhost:3001/check-ip?ip=${ipAddress}`);
    console.log('Response:', response.data);
    return response.data.isBlocked;
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}


// Prometheus metrics
const requestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
});

// Rate limiter setup
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later',
  handler: (req, res) => {
    const logMessage = 'Rate limit exceeded';
    const meta = { ip: req.ip };
    logger.warn(logMessage, meta);
    debugLog('warn', logMessage, meta);
    res.status(429).json({ error: 'Too many requests, please try again later' });
  },
});

// Apply rate limiter to all requests
app.use(limiter);

// Log incoming requests
app.use((req, res, next) => {
  const logMessage = `Incoming request: ${req.method} ${req.originalUrl}`;
  logger.info(logMessage);
  debugLog('info', logMessage);
  next();
});

app.post('/login', async (req, res) => {
  const end = requestDuration.startTimer();
  const route = '/login';

  try {
    const { username, password, ip } = req.body;

    // Input validation
    if (!username || !password) {
      const logMessage = 'Username or password not provided';
      logger.warn(logMessage);
      debugLog('warn', logMessage);
      end({ method: 'POST', route, code: 400 });
      return res.status(400).json({ error: 'Username and password are required' });
    }


    let isBlocked = await checkIP(ip);


    const user = await findUser(username);

    // User not found
    if (!user) {
      const logMessage = `Authentication failed for username: ${username}`;
      logger.warn(logMessage);
      debugLog('warn', logMessage);
      end({ method: 'POST', route, code: 401 });
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Compare password hash asynchronously
    const match = await bcrypt.compare(password, user.password);

    if (match && !isBlocked) {
      const logMessage = `User authenticated: ${username}`;
      logger.info(logMessage);
      debugLog('info', logMessage);
      end({ method: 'POST', route, code: 200 });
      return res.status(200).json({ message: 'Authentication successful' });
    } else {

      const logMessage = `Authentication failed for username: ${username}`;
      logger.warn(logMessage);
      debugLog('warn', logMessage + `and blockList status is: ${isBlocked}`);
      end({ method: 'POST', route, code: 401 });
      return res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    const logMessage = 'Error during authentication';
    logger.error(logMessage, error);
    debugLog('error', logMessage, error);
    end({ method: 'POST', route, code: 500 });
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Middleware for 404 handling
app.use((req, res) => {
  const logMessage = `404 Not Found - ${req.originalUrl}`;
  res.status(404).json({ error: 'Not Found' });
  logger.warn(logMessage);
  debugLog('warn', logMessage);
});

// Error handling middleware
app.use((err, req, res, next) => {
  const logMessage = 'Unhandled error';
  logger.error(logMessage, err);
  debugLog('error', logMessage, err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  const logMessage = `Server running on port ${PORT}`;
  logger.info(logMessage);
  debugLog('info', logMessage);
});

module.exports = app;
