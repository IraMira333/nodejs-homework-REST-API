import { Schema, model } from "mongoose";
import { handleSaveError } from "./hooks.js";

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
    require: true,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

contactSchema.post("save", handleSaveError);

const Contact = model("contact", contactSchema);

export default Contact;
