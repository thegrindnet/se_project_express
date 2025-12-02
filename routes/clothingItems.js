const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  createItem,
  getItems,
  deleteItem,
  addLike,
  removeLike,
} = require("../controllers/clothingItems");

// CRUD
router.use(auth);
// Create
router.post("/", createItem);
// Read
router.get("/", getItems);
// Update

// Delete
router.delete("/:itemId", deleteItem);
// Like
router.put("/:itemId/likes", addLike);
// Dislike
router.delete("/:itemId/likes", removeLike);
module.exports = router;
