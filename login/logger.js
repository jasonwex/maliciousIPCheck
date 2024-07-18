"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var winston_1 = require("winston");
var stream_1 = require("stream");
var options = {
    file: {
        level: 'info',
        filename: "./logs/app.log",
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};
var logger = (0, winston_1.createLogger)({
    format: winston_1.format.combine(winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.format.errors({ stack: true }), winston_1.format.splat(), winston_1.format.json()),
    transports: [
        new winston_1.transports.File(options.file),
        new winston_1.transports.Console(options.console)
    ],
    exitOnError: false,
});
var LoggerStream = /** @class */ (function (_super) {
    __extends(LoggerStream, _super);
    function LoggerStream(logger) {
        var _this = _super.call(this) || this;
        _this.logger = logger;
        return _this;
    }
    LoggerStream.prototype._write = function (chunk, encoding, callback) {
        if (typeof chunk === 'string') {
            this.logger.info(chunk);
        }
        else {
            this.logger.info(chunk.toString());
        }
        callback();
    };
    return LoggerStream;
}(stream_1.Writable));
var loggerStream = new LoggerStream(logger);
// Export logger as the default export
exports.default = logger;
// Export loggerStream as a named export
//export { loggerStream };
