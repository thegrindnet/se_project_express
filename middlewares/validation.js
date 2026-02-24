const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const clothingItemBodyValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name must be at most 30 characters long",
    }),

    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": "Image URL is required",
      "string.uri": "Image URL must be a valid URL",
    }),
  }),
});

const userInfoBodyValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name must be at most 30 characters long",
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": "Avatar URL is required",
      "string.uri": "Avatar URL must be a valid URL",
    }),
    email: Joi.string().required().email().messages({
      "string.empty": "Email is required",
      "string.email": "Email must be a valid email address",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required",
    }),
  }),
});

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": "Email is required",
      "string.email": "Email must be a valid email address",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required",
    }),
  }),
});

const isValidation = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().required().hex().length(24).messages({
      "string.empty": "ID is required",
      "string.hex": "ID must be a hexadecimal string",
      "string.length": "ID must be 24 characters long",
    }),
  }),
});

const userUpdateValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name must be at most 30 characters long",
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": "Avatar URL is required",
      "string.uri": "Avatar URL must be a valid URL",
    }),
  }),
});

module.exports = {
  clothingItemBodyValidation,
  userInfoBodyValidation,
  loginValidation,
  isValidation,
  userUpdateValidation,
};
