const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
// const {
//   DEFAULT_ERROR,
//   INVALID_REQUEST,
//   NOT_FOUND,
//   CONFLICT,
//   UNAUTHORIZED,
//   DUPLICATE_ERROR,
// } = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");
const { OK, CREATED } = require("../utils/successStatuses");

const { BadRequestError } = require("../utils/errors/badrequest-error");
const { ConflictError } = require("../utils/errors/conflict-error");
const { NotFoundError } = require("../utils/errors/notfound-error");
const { UnauthorizedError } = require("../utils/errors/unauthorized-error");
const { InternalError } = require("../utils/errors/internal-error");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email) {
    return next(new BadRequestError("The email field is required"));
    // return res
    //   .status(INVALID_REQUEST)
    //   .send({ message: "The email field is required" });
  }

  if (!password) {
    return next(new BadRequestError("The password field is required"));
    // return res
    //   .status(INVALID_REQUEST)
    //   .send({ message: "The password field is required" });
  }

  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return next(new ConflictError("A user with this email already exists"));
        // return res
        //   .status(CONFLICT)
        //   .send({ message: "A user with this email already exists" });
      }

      return bcrypt
        .hash(password, 10)
        .then((hash) => User.create({ name, avatar, email, password: hash }))
        .then((user) =>
          res.status(CREATED).send({
            name: user.name,
            email: user.email,
            avatar: user.avatar,
          })
        );
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(
          new BadRequestError("User creation failed due to invalid input")
        );
        // return res
        //   .status(INVALID_REQUEST)
        //   .send({ message: "User creation failed due to invalid input" });
      }
      if (err.code === "DuplicateError") {
        return next(new ConflictError("A user with this email already exists"));
        // return res
        //   .status(CONFLICT)
        //   .send({ message: "A user with this email already exists" });
      }
      return next(new InternalError("An error has occurred on the server"));
      // return res
      //   .status(DEFAULT_ERROR)
      //   .send({ message: "An error has occurred on the server" });
    });
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail()
    .then((user) => {
      res.status(OK).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
        // return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return next(
          new BadRequestError("Invalid data provided for user update")
        );
        // return res
        //   .status(INVALID_REQUEST)
        //   .send({ message: "Invalid data provided for user update" });
      }
      return next(new InternalError("An error occured on the server"));
      // return res
      //   .status(DEFAULT_ERROR)
      //   .send({ message: "An error has occurred on the server" });
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new BadRequestError("The password and email fields are required")
    );
    // return res
    //   .status(INVALID_REQUEST)
    //   .send({ message: "The password and email fields are required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(OK).send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError("Incorrect email or password"));
        // return res
        //   .status(UNAUTHORIZED)
        //   .send({ message: "Incorrect email or password" });
      }
      return next(new InternalError("An error has occurred on the server"));
      // return res
      //   .status(DEFAULT_ERROR)
      //   .send({ message: "An error has occurred on the server" });
    });
};

const updateUser = (req, res, next) => {
  const { _id } = req.user;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    _id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
        // return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      if (err.name === "ValidationError" || err.name === "CastError") {
        return next(
          new BadRequestError("Invalid data provided for user update")
        );
        // return res
        //   .status(INVALID_REQUEST)
        //   .send({ message: "Invalid data provided for user update" });
      }
      return next(new InternalError("An error occured on the server"));
      // return res
      //   .status(DEFAULT_ERROR)
      //   .send({ message: "An error occured on the server" });
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  login,
  updateUser,
};
