import Joi from "joi";

const userRegisterShema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const userEmailShema = Joi.object({
  email: Joi.string().required(),
});
export default { userRegisterShema, userEmailShema };
