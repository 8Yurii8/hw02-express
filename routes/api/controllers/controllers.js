import contactsService from "../../../models/contacts.js";
import HttpError from "../../../helper/HttpError.js";
import { contactAddShema } from "../../../schemas/contactAddShema.js";
import { ctrlWrapper } from "../decorators/ctrlWrapper.js";

const listContacts = async (req, res, next) => {
  const result = await contactsService.listContacts();
  res.json(result);
};

const getContactById = async (req, res, next) => {
  const { id } = req.params;
  const result = await contactsService.getContactById(id);
  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }
  res.json(result);
};

const addContact = async (req, res, next) => {
  const { error } = contactAddShema.validate(req.body);
  if (error) {
    throw HttpError(400, "message: missing required name field");
  }
  const result = await contactsService.addContact(req.body);
  res.status(201).json(result);
};

const removeContact = async (req, res, next) => {
  const { id } = req.params;
  const result = await contactsService.removeContact(id);
  if (!result) {
    throw HttpError(404, { message: "Not found" });
  }
  res.json({ message: "contact deleted" });
};

const updateContact = async (req, res, next) => {
  const { error } = contactAddShema.validate(req.body);
  if (error) {
    throw HttpError(400, { message: "missing fields" });
  }
  const { id } = req.params;
  const result = await contactsService.updateContactById(id, req.body);
  if (!result) {
    throw HttpError(404, { message: "Not found" });
  }
  res.json(result);
};

export default {
  listContacts: ctrlWrapper(listContacts),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  removeContact: ctrlWrapper(removeContact),
  updateContact: ctrlWrapper(updateContact),
};
