const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const { BadRequestError } = require("../utils/errors/badrequest-error");
const { NotFoundError } = require("../utils/errors/notfound-error");
const { ForbiddenError } = require("../utils/errors/forbidden-error");
const { InternalError } = require("../utils/errors/internal-error");

const { OK, CREATED } = require("../utils/successStatuses");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  if (!name || !weather || !imageUrl) {
    return next(
      new BadRequestError("name, weather, and imageUrl are required")
    );
  }

  const owner = req.user._id;
  return ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(CREATED).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
      }
      return next(err);
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(OK).send(items);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
      }
      return next(new InternalError("An error has occurred on the server"));
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(BadRequestError("Invalid item ID"));
  }

  return ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Item not found"));
      }
      if (!item.owner || item.owner.toString() !== req.user._id.toString()) {
        return next(
          new ForbiddenError("You do not have permission to delete this item")
        );
      }
      return ClothingItem.findByIdAndDelete(itemId).then(() => {
        res.status(OK).send({ data: item });
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError" || err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      }
      return next(new InternalError("An error has occurred on the server"));
    });
};

const addLike = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(BadRequestError("Invalid item ID"));
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
        next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError" || err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      }
      return next(new InternalError("An error has occurred on the server"));
    });
};

const removeLike = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("Invalid item ID"));
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
        next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError" || err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      }
      return next(new InternalError("An error has occurred on the server"));
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  addLike,
  removeLike,
};
