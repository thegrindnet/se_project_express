const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getCurrentUser, updateUser } = require("../controllers/users");
const { userUpdateValidation } = require("../middlewares/validation");

router.get("/me", auth, getCurrentUser);

router.patch("/me", userUpdateValidation, auth, updateUser);

module.exports = router;
