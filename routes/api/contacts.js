import express from "express";
import Joi from "joi";
import contactsService from "../../models/contacts.js";
import { HttpError } from "../../helpers/index.js";

const contactsRouter = express.Router();

const contactAddSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

contactsRouter.get("/", async (req, res, next) => {
  try {
    const allContacts = await contactsService.listContacts();
    res.status(200).json(allContacts);
  } catch (error) {
    next(error);
  }
});

contactsRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const contactById = await contactsService.getContactById(id);
    if (!contactById) {
      throw HttpError(404, `Contact with id=${id} not found`);
    }
    res.status(200).json(contactById);
  } catch (error) {
    next(error);
  }
});

contactsRouter.post("/", async (req, res, next) => {
  try {
    const { error } = contactAddSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const addedContact = await contactsService.addContact(req.body);
    res.status(201).json(addedContact);
  } catch (error) {
    next(error);
  }
});

contactsRouter.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.removeContact(id);
    if (!result) {
      throw HttpError(404, `Contact with id=${id} not found`);
    }
    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
});

contactsRouter.put("/:id", async (req, res, next) => {
  try {
    const { error } = contactAddSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { id } = req.params;
    const result = await contactsService.updateContact(id, req.body);
    if (!result) {
      throw HttpError(404, `Contact with id=${id} not found`);
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default contactsRouter;
