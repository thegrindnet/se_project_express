const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $set: { imageUrl } },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: "Invalid item data" });
        return;
      }
      if (err.name === "DocumentNotFoundError") {
        res.status(404).send({ message: "Item not found" });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).send({ message: "Invalid item ID" });
  }

  return ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      if (!item.owner || item.owner.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .send({ message: "You do not have permission to delete this item" });
      }
      return ClothingItem.findByIdAndDelete(itemId).then(() => {
        res.status(200).send({ data: item });
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError" || err.name === "ValidationError") {
        return res.status(400).send({ message: "Invalid data" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "Item not found" });
      }
      return res.status(500).send({ message: "Error from deleteItem", err });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
};
