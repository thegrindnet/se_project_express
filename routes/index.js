const router = require("express").Router();
const { NotFoundError } = require("../utils/errors/notfound-error");

const userRouter = require("./users");
const clothingItem = require("./clothingItems");
const { createUser, login } = require("../controllers/users");
const {
  loginValidation,
  userInfoBodyValidation,
} = require("../middlewares/validation");

router.use("/users", userRouter);

router.use("/items", clothingItem);

router.post("/signin", loginValidation, login);

router.post("/signup", userInfoBodyValidation, createUser);

router.use((req, res, next) => {
  next(new NotFoundError("Router resource not found"));
});

module.exports = router;
