import express from "express";
import contactsControllers from "../../controllers/contactsControllers.js";
import contactValidation from "../../middleware/validation/contactValidation.js";
import isValidId from "../../middleware/isValidId.js";

const contactsRouter = express.Router();

contactsRouter.get("/", contactsControllers.getAll);

contactsRouter.get("/:id", isValidId, contactsControllers.getById);

contactsRouter.post(
  "/",
  contactValidation.contactValidate,
  contactsControllers.add
);

contactsRouter.delete("/:id", isValidId, contactsControllers.removeById);

contactsRouter.put(
  "/:id",
  isValidId,
  contactValidation.contactValidate,
  contactsControllers.updateById
);
contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  contactValidation.contactFavoritValidate,
  contactsControllers.updateStatusContact
);

export default contactsRouter;
