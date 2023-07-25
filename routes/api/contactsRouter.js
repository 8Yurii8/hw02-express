import express from "express";
import contactControllers from "./controllers/controllers.js";

const contactsRouter = express.Router();

contactsRouter.get("/", contactControllers.listContacts);
contactsRouter.get("/:id", contactControllers.getContactById);
contactsRouter.post("/", contactControllers.addContact);
contactsRouter.delete("/:id", contactControllers.removeContact);
contactsRouter.put("/:id", contactControllers.updateContact);

export default contactsRouter;
