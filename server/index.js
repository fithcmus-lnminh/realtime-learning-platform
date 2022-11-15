const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./config/db");
const { errorHandler } = require("./middlewares/error");

const authRouter = require("./routes/auth.route");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
dotenv.config();
connectDb();

app.use("/api/auth", authRouter);

app.use(errorHandler);

app.listen(port, () => console.log(`The app is listening on port ${port}!`));
