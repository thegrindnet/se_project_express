const router = require("express").Router();

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  addLike,
  removeLike,
} = require("../controllers/clothingItems");

// CRUD

// Create
router.post("/", createItem);
// Read
router.get("/", getItems);
// Update
router.put("/:itemId", updateItem);
// Delete
router.delete("/:itemId", deleteItem);
// Like
router.put("/:itemId/likes", addLike);
// Dislike
router.delete("/:itemId/likes", removeLike);
module.exports = router;
