import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/db.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
dotenv.config();
connectDb();

app.listen(port, () => console.log(`The app is listening on port ${port}!`));
