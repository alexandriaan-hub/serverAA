import express from "express";
import entriesRouter from "./routes/entries.js";
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.js';
import { attachUser } from './middleware/attachUser.js';

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-secret-change-in-production';

await mongoose.connect(
  process.env.MONGODB_URI ||
    "mongodb://dev:devpassword@mongo:27017/devdb?authSource=admin",
);

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => { // unit 9 logger
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(morgan('dev'));
app.use(cookieParser(SESSION_SECRET));
app.use(attachUser);

app.use(authRouter);
app.use("/entries", entriesRouter);

app.get("/hello/:name", (req, res) => {
  const name = req.params.name;
  res.send(`Hello, ${name}!`);
});

app.use((req, res) => {
  res.status(404).send("Page not found.");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something went wrong.");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});// added from a second worktree
