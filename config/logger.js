const { createLogger, transports, format, level } = require("winston");
const { MongoDB } = require("winston-mongodb");
// Logger create
const logger = createLogger({
  level: "error",
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.MongoDB({
      db: process.env.MONGO_URL,
      collection: "logs",
      level: "error",
      options: { useUnifiedTopology: true },
    }),
    new transports.Console({
      format: format.simple(), // Also log to the console
    }),
  ],
});

module.exports = logger;
