import winston from 'winston';

const enumerate_error_format = winston.format(info => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      enumerate_error_format(),
       winston.format.colorize(),
      winston.format.splat(),
      winston.format.printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`),
  ),
  transports: [
    new winston.transports.File({
      filename: './logs/warn.log',
      level: 'warn',
    }),
    new winston.transports.File({
      filename: './logs/debug.log',
      level: 'debug',
    }),
    new winston.transports.File({
      filename: './logs/error.log',
      level: 'error',
    }),
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
  ],
});
