const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getCurrentUser } = require("../controllers/users");

router.use(auth);
// router.get("/", getUsers);
router.get("/me", getCurrentUser);
// router.post("/", createUser);

module.exports = router;
