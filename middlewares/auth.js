const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

// const { UNAUTHORIZED } = require("../utils/errors");
const { Unauthorized } = require("../utils/errors/unauthorized-error");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new Unauthorized("Authorization required"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new Unauthorized("Authorization required"));
  }

  req.user = payload;
  return next();
};
