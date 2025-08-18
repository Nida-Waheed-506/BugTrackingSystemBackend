const express = require("express");
const app = express();
require("dotenv").config();
require("./models/association");
const { db } = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// routes import
const { userRouter } = require("./routes/user");
const { projectRouter } = require("./routes/project");
const { bugRouter } = require("./routes/bug");
const { authRouter } = require("./routes/auth");

// +++++++++++++++++++ imports end ++++++++++++++++++++++++++++++++++++++
app.use(
  cors({
    origin: process.env.LOCAL_HOST,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use(cookieParser());
app.use("/", userRouter);
app.use("/", authRouter);
app.use("/", projectRouter);
app.use("/", bugRouter);

const startServer = async () => {
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");

    await db.sync({ force: false, alter: false, logging: false });
    console.log("All models were synchronized successfully.");

    app.listen(process.env.SERVER_PORT, () => {
      console.log(`Server is running on port `);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();
