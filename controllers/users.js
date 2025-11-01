const User = require("../models/user");
const {
  DEFAULT_ERROR,
  INVALID_REQUEST,
  NOT_FOUND,
  CREATED,
} = require("../utils/errors");

// GET /users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(DEFAULT_ERROR)
        .send({ message: "An error occured on the server" });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => {
      res.status(CREATED).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(INVALID_REQUEST).send({ message: err.message });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: "An error occured on the server" });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(INVALID_REQUEST).send({ message: err.message });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: "An error occured on the server" });
    });
};

module.exports = {
  getUsers,
  createUser,
  getUser,
};
