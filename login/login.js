"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = require("./user");
var bcrypt = require("bcrypt");
var express_1 = require("express");
var axios_1 = require("axios");
var logger_1 = require("./logger");
//import { loggerStream } from './logger';
var cors = require("cors");
var promClient = require("prom-client");
var express_rate_limit_1 = require("express-rate-limit");
var app = (0, express_1.default)();
app.use(cors());
app.use(express_1.default.json());
var isDev = true; // should add this to .env
// Helper function to log messages to the console if isDev is true
var debugLog = function (level, message, meta) {
    if (isDev) {
        console.log("[".concat(level.toUpperCase(), "] ").concat(message), meta || '');
    }
};
function checkIP(ipAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.get("http://localhost:3001/check-ip?ip=".concat(ipAddress))];
                case 1:
                    response = _a.sent();
                    console.log('Response:', response.data);
                    return [2 /*return*/, response.data.isBlocked];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error:', error_1.response ? error_1.response.data : error_1.message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Prometheus metrics
var requestDuration = new promClient.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'code'],
});
// Rate limiter setup
var limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later',
    handler: function (req, res) {
        var logMessage = 'Rate limit exceeded';
        var meta = { ip: req.ip };
        logger_1.default.warn(logMessage, meta);
        debugLog('warn', logMessage, meta);
        res.status(429).json({ error: 'Too many requests, please try again later' });
    },
});
// Apply rate limiter to all requests
app.use(limiter);
// Log incoming requests
app.use(function (req, res, next) {
    var logMessage = "Incoming request: ".concat(req.method, " ").concat(req.originalUrl);
    logger_1.default.info(logMessage);
    debugLog('info', logMessage);
    next();
});
app.post('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var end, route, _a, username, password, ip, logMessage, isBlocked, user, logMessage, match, logMessage, logMessage, error_2, logMessage;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                end = requestDuration.startTimer();
                route = '/login';
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                _a = req.body, username = _a.username, password = _a.password, ip = _a.ip;
                // Input validation
                if (!username || !password) {
                    logMessage = 'Username or password not provided';
                    logger_1.default.warn(logMessage);
                    debugLog('warn', logMessage);
                    end({ method: 'POST', route: route, code: 400 });
                    return [2 /*return*/, res.status(400).json({ error: 'Username and password are required' })];
                }
                return [4 /*yield*/, checkIP(ip)];
            case 2:
                isBlocked = _b.sent();
                return [4 /*yield*/, (0, user_1.findUser)(username)];
            case 3:
                user = _b.sent();
                // User not found
                if (!user) {
                    logMessage = "Authentication failed for username: ".concat(username);
                    logger_1.default.warn(logMessage);
                    debugLog('warn', logMessage);
                    end({ method: 'POST', route: route, code: 401 });
                    return [2 /*return*/, res.status(401).json({ error: 'Invalid username or password' })];
                }
                return [4 /*yield*/, bcrypt.compare(password, user.password)];
            case 4:
                match = _b.sent();
                if (match && !isBlocked) {
                    logMessage = "User authenticated: ".concat(username);
                    logger_1.default.info(logMessage);
                    debugLog('info', logMessage);
                    end({ method: 'POST', route: route, code: 200 });
                    return [2 /*return*/, res.status(200).json({ message: 'Authentication successful' })];
                }
                else {
                    logMessage = "Authentication failed for username: ".concat(username);
                    logger_1.default.warn(logMessage);
                    debugLog('warn', logMessage + "and blockList status is: ".concat(isBlocked));
                    end({ method: 'POST', route: route, code: 401 });
                    return [2 /*return*/, res.status(401).json({ error: 'Invalid username or password' })];
                }
                return [3 /*break*/, 6];
            case 5:
                error_2 = _b.sent();
                logMessage = 'Error during authentication';
                logger_1.default.error(logMessage, error_2);
                debugLog('error', logMessage, error_2);
                end({ method: 'POST', route: route, code: 500 });
                return [2 /*return*/, res.status(500).json({ error: 'Internal server error' })];
            case 6: return [2 /*return*/];
        }
    });
}); });
// Middleware for 404 handling
app.use(function (req, res) {
    var logMessage = "404 Not Found - ".concat(req.originalUrl);
    res.status(404).json({ error: 'Not Found' });
    logger_1.default.warn(logMessage);
    debugLog('warn', logMessage);
});
// Error handling middleware
app.use(function (err, req, res, next) {
    var logMessage = 'Unhandled error';
    logger_1.default.error(logMessage, err);
    debugLog('error', logMessage, err);
    res.status(500).json({ error: 'Internal server error' });
});
var PORT = process.env.PORT || 3002;
app.listen(PORT, function () {
    var logMessage = "Server running on port ".concat(PORT);
    logger_1.default.info(logMessage);
    debugLog('info', logMessage);
});
module.exports = app;
