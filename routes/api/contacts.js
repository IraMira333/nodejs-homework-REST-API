import express from "express";
import contactsControllers from "../../controllers/contactsControllers.js";

const contactsRouter = express.Router();

contactsRouter.get("/", contactsControllers.getAll());

contactsRouter.get("/:id", contactsControllers.getById());

contactsRouter.post("/", contactsControllers.add());

contactsRouter.delete("/:id", contactsControllers.removeById());

contactsRouter.put("/:id", contactsControllers.updateById());

export default contactsRouter;
