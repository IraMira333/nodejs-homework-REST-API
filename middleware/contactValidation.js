import * as contactsSchemas from "../models/Contact.js";
import { validateBody } from "../decorators/index.js";

const contactValidate = validateBody(contactsSchemas.contactAddSchema);
const contactFavoritValidate = validateBody(
  contactsSchemas.contactUpdateFavoriteSchema
);

export default { contactValidate, contactFavoritValidate };
