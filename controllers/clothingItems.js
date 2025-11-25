const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");

const {
  DEFAULT_ERROR,
  INVALID_REQUEST,
  NOT_FOUND,
  FORBIDDEN,
} = require("../utils/errors");

const { OK, CREATED } = require("../utils/successStatuses");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  if (!name || !weather || !imageUrl) {
    return res
      .status(INVALID_REQUEST)
      .send({ message: "name, weather, and imageUrl are required" });
  }

  const owner = req.user._id;
  return ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(CREATED).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(INVALID_REQUEST).send({ message: "Invalid data" });
      }
      if (err.name === "CastError") {
        return res.status(INVALID_REQUEST).send({ message: "Invalid item ID" });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(OK).send(items);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(INVALID_REQUEST).send({ message: "Invalid item ID" });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(INVALID_REQUEST).send({ message: "Invalid item ID" });
  }

  return ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      if (!item.owner || item.owner.toString() !== req.user._id.toString()) {
        return res
          .status(FORBIDDEN)
          .send({ message: "You do not have permission to delete this item" });
      }
      return ClothingItem.findByIdAndDelete(itemId).then(() => {
        res.status(OK).send({ data: item });
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError" || err.name === "ValidationError") {
        return res.status(INVALID_REQUEST).send({ message: "Invalid data" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const addLike = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(INVALID_REQUEST).send({ message: "Invalid item ID" });
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(OK).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      if (err.name === "CastError" || err.name === "ValidationError") {
        return res.status(INVALID_REQUEST).send({ message: "Invalid data" });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const removeLike = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(INVALID_REQUEST).send({ message: "Invalid item ID" });
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(OK).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      if (err.name === "CastError" || err.name === "ValidationError") {
        return res.status(INVALID_REQUEST).send({ message: "Invalid data" });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  addLike,
  removeLike,
};
