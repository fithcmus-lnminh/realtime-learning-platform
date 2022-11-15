const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./config/db");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
dotenv.config();
connectDb();

app.listen(port, () => console.log(`The app is listening on port ${port}!`));
