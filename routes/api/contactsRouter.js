import express from "express";
import {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} from "./controllers/controllers.js";

const contactsRouter = express.Router();

contactsRouter.get("/", listContacts);
contactsRouter.get("/:id", getContactById);
contactsRouter.post("/", addContact);
contactsRouter.delete("/:id", removeContact);
contactsRouter.put("/:id", updateContact);

export default contactsRouter;
