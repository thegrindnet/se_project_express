const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const mainRouter = require("./routes/index");
const { createUser, login } = require("./controllers/users");
const auth = require("./middlewares/auth");

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// app.use((req, res, next) => {
//   req.user = {
//     _id: "6901a25e9a1cb1de7d3dc99c",
//   };
//   next();
// });

// const routes = require("./routes");

app.use(express.json());
app.use(cors());

app.post("/signup", createUser);
app.post("/signin", login);

app.use(auth);

app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
