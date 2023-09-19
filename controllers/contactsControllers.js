import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import Contact from "../models/Contact.js";

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  if ("favorite" in req.query) {
    const { favorite } = req.query;
    console.log(favorite);
    const contactByFavorite = await Contact.find({ owner, favorite }).exec();

    if (!contactByFavorite) {
      throw HttpError(404, `No such contacts found`);
    }
    res.status(200).json(contactByFavorite);
  }

  const { page = 1, limit = 10 } = req.query;
  console.log(req.query);
  const skip = (page - 1) * limit;
  const allContacts = await Contact.find({ owner }, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "name email");
  res.status(200).json(allContacts);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const contactById = await Contact.findById(id);
  // const { _id: owner } = req.user;
  // const contactById = await Contact.findOne({ _id: id, owner });
  if (!contactById) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }
  res.status(200).json(contactById);
};

const add = async (req, res) => {
  const { _id: owner } = req.user;
  const addedContact = await Contact.create({ ...req.body, owner });
  res.status(201).json(addedContact);
};

const removeById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndDelete(id);
  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }
  res.status(200).json({ message: "contact deleted" });
};

const updateById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }
  res.status(200).json(result);
};

export default {
  getAll: ctrlWrapper(getAll),
  add: ctrlWrapper(add),
  getById: ctrlWrapper(getById),
  removeById: ctrlWrapper(removeById),
  updateById: ctrlWrapper(updateById),
};
