import fs from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import User from "../models/User.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const avatarPath = path.resolve("public", "avatars");

const singUp = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email already exist");
  }
  const avatarURL = gravatar.url(email, { s: "100", r: "x", d: "retro" }, true);
  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });
  res.status(201).json({
    user: {
      username: newUser.username,
      email: newUser.email,
      subscription: "starter",
      avatarURL,
    },
  });
};

const singIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }
  const { _id: id } = user;
  const payload = {
    id,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "23h",
  });
  await User.findByIdAndUpdate(id, { token });
  res
    .status(200)
    .json({ token, user: { email, subscription: user.subscription } });
};

const getCurrent = (req, res) => {
  const { username, email } = req.user;

  res.status(200).json({ username, email, subscription: user.subscription });
};

const logout = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json({
    message: `"Logout success"`,
  });
};

const updateSubscription = async (req, res) => {
  const { _id, username, email } = req.user;
  const { subscription } = req.body;
  await User.findByIdAndUpdate(_id, { subscription });
  res.status(200).json({ username, email, subscription });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  console.log(req.user.email);
  const { path: oldPath, filename } = req.file;
  const newAvatarPath = path.join(avatarPath, filename);
  console.log(avatarPath);
  await fs.rename(oldPath, newAvatarPath);
  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.status(200).json({ avatarURL });
};

export default {
  singUp: ctrlWrapper(singUp),
  singIn: ctrlWrapper(singIn),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
