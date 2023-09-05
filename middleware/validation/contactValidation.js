import contactsSchemas from "../../schemas/contactsSchemas.js";
import { validateBody } from "../../decorators/index.js";

const contactValidate = validateBody(contactsSchemas.contactAddSchema);

export default { contactValidate };
