const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  createItem,
  getItems,
  deleteItem,
  addLike,
  removeLike,
} = require("../controllers/clothingItems");

const {
  clothingItemBodyValidation,
  isValidation,
} = require("../middlewares/validation");

router.post("/", clothingItemBodyValidation, auth, createItem);

router.get("/", getItems);

router.delete("/:itemId", isValidation, auth, deleteItem);

router.put("/:itemId/likes", isValidation, auth, addLike);

router.delete("/:itemId/likes", isValidation, auth, removeLike);
module.exports = router;
