import winston from 'winston';
import expressWinston from 'express-winston';
import {isProduction} from './utility/isProduction';

function winstonFormat(label: string) {
  if (isProduction) return winston.format.json();
  else
    return winston.format.combine(
      winston.format.colorize(),
      winston.format.label({label: label}),
      winston.format.timestamp(),
      winston.format.printf(({level, message, label, timestamp}) => {
        return `${timestamp} [${label}] ${level}: ${message}`;
      }),
      winston.format.metadata()
    );
}

export const appLogger = winston.createLogger({
  level: isProduction ? 'info' : 'debug',
  transports: [new winston.transports.Console()],
  format: winstonFormat('rabbitmq-http-auth-backend'),
});

export const expressLogger = expressWinston.logger({
  transports: [new winston.transports.Console()],
  format: winstonFormat('express'),
  meta: true,
  expressFormat: true,
  colorize: isProduction ? false : true,
});

export const expressErrorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.Console()],
  format: winstonFormat('express-error'),
});
