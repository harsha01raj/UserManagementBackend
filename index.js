const express = require("express");
const connection = require("./config/db.js");
require("dotenv").config();
const morgan = require("morgan");
const logger = require("./config/logger.js");
const limiter = require("./middleware/rateLimiter.js");
const router = require("./routes/authRoutes.js");
const auth = require("./middleware/authMiddleware.js");
const TaskRouter = require("./routes/taskRoutes.js");
const userRouter = require("./routes/userRoutes.js");
const cors = require("cors");
const PORT = process.env.PORT || 5000;

const app = express();

app.use(
  cors({
    origin: "*", 
  })
);
app.use(express.json());
app.use(
  morgan("combined", {
    stream: {
      write: (message) => {
        logger.error(message.trim());
      },
    },
  })
);

app.use("/auth", router);
//err-handling middleware
app.use("/user", auth, userRouter);
app.use("/task", auth, TaskRouter);
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send("Something broke!");
});
//sample output
app.get("/", (req, res) => {
  res.status(200).json({ Message: "Server is working fine." });
});

app.listen(PORT, async () => {
  try {
    await connection;
    console.log(`Server is running on port ${PORT}`);
    console.log("Server is successfully connected to the database");
  } catch (error) {
    console.log(error);
  }
});
