//import contactsService from "../models/contacts.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import Contact from "../models/Contact.js";

const getAll = async (req, res) => {
  const allContacts = await Contact.find();
  res.status(200).json(allContacts);
};

// const getById = async (req, res) => {
//   const { id } = req.params;
//   const contactById = await contactsService.getContactById(id);
//   if (!contactById) {
//     throw HttpError(404, `Contact with id=${id} not found`);
//   }
//   res.status(200).json(contactById);
// };

const add = async (req, res) => {
  const addedContact = await Contact.create(req.body);
  res.status(201).json(addedContact);
};

// const removeById = async (req, res) => {
//   const { id } = req.params;
//   const result = await contactsService.removeContact(id);
//   if (!result) {
//     throw HttpError(404, `Contact with id=${id} not found`);
//   }
//   res.status(200).json({ message: "contact deleted" });
// };

// const updateById = async (req, res) => {
//   const { id } = req.params;
//   const result = await contactsService.updateContact(id, req.body);
//   if (!result) {
//     throw HttpError(404, `Contact with id=${id} not found`);
//   }
//   res.status(200).json(result);
// };

export default {
  getAll: ctrlWrapper(getAll),
  // add: ctrlWrapper(add),
  // getById: ctrlWrapper(getById),
  // removeById: ctrlWrapper(removeById),
  // updateById: ctrlWrapper(updateById),
};
