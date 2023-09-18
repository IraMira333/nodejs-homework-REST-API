import express from "express";
import contactsControllers from "../../controllers/contactsControllers.js";
import contactValidation from "../../middleware/contactValidation.js";
import { isValidId, authenticate } from "../../middleware/index.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

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
  contactsControllers.updateById
);

export default contactsRouter;
