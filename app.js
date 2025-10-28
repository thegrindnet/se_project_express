// On Video 7: User Controllers
const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const { PORT = 3001 } = process.env;
const app = express();

app.use("/", mainRouter);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
