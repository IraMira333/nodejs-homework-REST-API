import express from "express";
import contactsControllers from "../../controllers/contactsControllers.js";
import contactValidation from "../../middleware/validation/contactValidation.js";

const contactsRouter = express.Router();

contactsRouter.get("/", contactsControllers.getAll);

contactsRouter.get("/:id", contactsControllers.getById);

contactsRouter.post(
  "/",
  contactValidation.contactValidate,
  contactsControllers.add
);

contactsRouter.delete("/:id", contactsControllers.removeById);

contactsRouter.put(
  "/:id",
  contactValidation.contactValidate,
  contactsControllers.updateById
);

export default contactsRouter;
