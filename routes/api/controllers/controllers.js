import contactsService from "../../../models/contacts.js";
import HttpError from "../../../helper/HttpError.js";
import { contactAddShema } from "../../../schemas/contactAddShema.js";

export const listContacts = async (req, res, next) => {
  try {
    const result = await contactsService.listContacts();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.getContactById(id);
    if (!result) {
      throw HttpError(404, `Contact with id=${id} not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const addContact = async (req, res, next) => {
  try {
    const { error } = contactAddShema.validate(req.body);

    if (error) {
      throw HttpError(400, "message: missing required name field");
    }
    const result = await contactsService.addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const removeContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.removeContact(id);
    if (!result) {
      throw HttpError(404, { message: "Not found" });
    }
    res.json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};
