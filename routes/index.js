const router = require("express").Router();
const { NotFoundError } = require("../utils/errors/notfound-error");

const userRouter = require("./users");
const clothingItem = require("./clothingItems");
// const auth = require("../middlewares/auth");

// const { NOT_FOUND } = require("../utils/errors");

// router.use(auth);

router.use("/items", clothingItem);

router.use("/users", userRouter);

router.use((req, res, next) => {
  next(new NotFoundError("Router resource not found"));
  // res.status(NOT_FOUND).send({ message: "Router resource not found" });
});

module.exports = router;
