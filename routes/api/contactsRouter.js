import express from "express";
import contactControllers from "./controllers/controllers.js";
import { isValidId } from "../../middlewares/middlewares.js";
import {
  contactUpdateFavoriteShema,
  contactAddShema,
} from "../../schemas/contactAddShema.js";
import { validateBody } from "./decorators/validateBody.js";
const contactsRouter = express.Router();

contactsRouter.get("/", contactControllers.listContacts);
contactsRouter.get("/:id", isValidId, contactControllers.getContactById);
contactsRouter.post(
  "/",
  validateBody(contactAddShema),
  contactControllers.addContact
);
contactsRouter.delete("/:id", isValidId, contactControllers.removeContact);
contactsRouter.put("/:id", isValidId, contactControllers.updateContact);
contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  validateBody(contactUpdateFavoriteShema),
  contactControllers.updateFavorite
);
export default contactsRouter;
