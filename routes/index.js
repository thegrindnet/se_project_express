const router = require("express").Router();
const clothingItem = require("./clothingItems");

const { NOT_FOUND } = require("../utils/errors");

router.use("/items", clothingItem);
const userRouter = require("./users");

router.use("/users", userRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Router resource not found" });
});

module.exports = router;
