import winston from 'winston';
import expressWinston from 'express-winston';

export const appLogger = winston.createLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.json(),
});

export const expressLogger = expressWinston.logger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(winston.format.json()),
  meta: true,
  expressFormat: true,
  colorize: process.env.NODE_ENV === 'production' ? false : true,
});

export const expressErrorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(winston.format.json()),
});
