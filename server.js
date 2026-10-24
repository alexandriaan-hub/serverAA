import express from "express";
import entriesRouter from "./routes/entries.js";
import morgan from "morgan";
import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT || 3000;

await mongoose.connect(
  process.env.MONGODB_URI ||
    "mongodb://dev:devpassword@mongo:27017/devdb?authSource=admin",
);

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// unit 9 logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(morgan("dev"));

app.use("/entries", entriesRouter);

// 2 functs below are unit 7 home exercise
app.get("/random-post", async (req, res) => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");
  const post = await response.json();
  res.status(200).json(post);
});

const events = [{ title: "Career fair" }, { title: "Hackathon kickoff" }];

app.get("/events", (req, res) => {
  res.render("events", { events });
});

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
});
// step one
// step two
// step three
// checkpoint 1
