import Joi from "joi";

export const contactAddShema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});

export const contactUpdateFavoriteShema = Joi.object({
  favorite: Joi.boolean().required(),
});
