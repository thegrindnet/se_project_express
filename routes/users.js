const router = require("express").Router();
const auth = require("../middlewares/auth");
// const { getUsers, createUser, getUser } = require("../controllers/users");

router.use(auth);
// router.get("/", getUsers);
// router.get("/:userId", getUser);
// router.post("/", createUser);

module.exports = router;
