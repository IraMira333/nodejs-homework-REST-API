import { Schema, model } from "mongoose";
import Joi from "joi";

import { handleSaveError, runValidateAtUpdate } from "./hooks.js";

const subscriptionList = ["starter", "pro", "business"];
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
  {
    username: { type: String, required: [true, "Set name for contact"] },
    email: {
      type: String,
      match: emailRegex,
      unique: true,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      minlength: 8,
      required: [true, "Set password for user"],
    },
    subscription: {
      type: String,
      enum: subscriptionList,
      default: "starter",
    },
    avatarURL: String,
    token: String,
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleSaveError);
userSchema.pre("findOneAndUpdate", runValidateAtUpdate);
userSchema.post("findOneAndUpdate", handleSaveError);

export const userSingUpSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(8).required(),
  subscription: Joi.string().valid(...subscriptionList),
});

export const userSingInSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(8).required(),
});

export const userVerifySchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
});

export const userUpdateSubscribptionSchema = Joi.object({
  subscription: Joi.string()
    .valid(...subscriptionList)
    .required(),
});

const User = model("user", userSchema);

export default User;
