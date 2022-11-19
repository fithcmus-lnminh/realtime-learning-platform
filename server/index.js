const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDb = require("./config/db");
const { errorHandler } = require("./middlewares/error");
const authRouter = require("./routes/auth.route");
const OAuth2Router = require("./routes/oauth2.route");
const userRouter = require("./routes/user.route");
const passport = require("passport");
const session = require("express-session");

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
const port = process.env.PORT || 5000;

app.use(express.json());
dotenv.config();
connectDb();

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

require("./config/passport");

app.use("/api/auth", authRouter);
app.use("/auth/google", OAuth2Router);
app.use("/api/user", userRouter);

app.use(errorHandler);

app.listen(port, () => console.log(`The app is listening on port ${port}!`));
