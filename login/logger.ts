import { createLogger, format, transports, Logger } from 'winston';
import { Writable } from 'stream';

const options = {
  file: {
    level: 'info',
    filename: `./logs/app.log`,
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

const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.File(options.file),
    new transports.Console(options.console)
  ],
  exitOnError: false,
});

class LoggerStream extends Writable {
  constructor(private logger: Logger) {
    super();
  }

  _write(chunk: any, encoding: string, callback: (error?: Error | null) => void): void {
    if (typeof chunk === 'string') {
      this.logger.info(chunk);
    } else {
      this.logger.info(chunk.toString());
    }
    callback();
  }
}

const loggerStream = new LoggerStream(logger);

// Export logger as the default export
export default logger;

// Export loggerStream as a named export
//export { loggerStream };
