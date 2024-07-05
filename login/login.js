const { findUser } = require('./user');
const bcrypt = require('bcrypt');
const express = require('express');
const logger = require('./logger');
const promClient = require('prom-client');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(express.json());

const isDebug = true;

// Helper function to log messages to the console if isDebug is true
const debugLog = (level, message, meta) => {
  if (isDebug) {
    console.log(`[${level.toUpperCase()}] ${message}`, meta || '');
  }
};

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

app.post('/authenticate', async (req, res) => {
  const end = requestDuration.startTimer();
  const route = '/authenticate';

  try {
    const { username, password } = req.body;

    // Input validation
    if (!username || !password) {
      const logMessage = 'Username or password not provided';
      logger.warn(logMessage);
      debugLog('warn', logMessage);
      end({ method: 'POST', route, code: 400 });
      return res.status(400).json({ error: 'Username and password are required' });
    }

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
    const match = await bcrypt.compare(password, user.passwordHash);

    if (match) {
      const logMessage = `User authenticated: ${username}`;
      logger.info(logMessage);
      debugLog('info', logMessage);
      end({ method: 'POST', route, code: 200 });
      return res.status(200).json({ message: 'Authentication successful' });
    } else {
      const logMessage = `Authentication failed for username: ${username}`;
      logger.warn(logMessage);
      debugLog('warn', logMessage);
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
