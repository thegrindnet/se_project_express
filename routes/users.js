const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getCurrentUser, updateUser } = require("../controllers/users");

router.use(auth);

router.get("/me", getCurrentUser);

router.get("/me", updateUser);

module.exports = router;
