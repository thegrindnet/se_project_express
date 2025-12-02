const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  getUsers,
  getCurrentUser,
  updateUser,
} = require("../controllers/users");

router.use(auth);

router.get("/", getUsers);
router.get("/me", getCurrentUser);

router.patch("/me", updateUser);

module.exports = router;
