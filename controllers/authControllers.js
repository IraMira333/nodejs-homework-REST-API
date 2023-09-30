import fs from "fs/promises";
import "dotenv/config";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import Jimp from "jimp";
import nanoid from "nanoid";
import User from "../models/User.js";
import { HttpError, sendEmail } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const avatarPath = path.resolve("public", "avatars");
const { BASE_URL, JWT_SECRET } = process.env;

const singUp = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email already exist");
  }
  const avatarURL = gravatar.url(email, { s: "100", r: "x", d: "retro" }, true);
  const hashPassword = await bcrypt.hash(password, 10);

  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a tagret="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click to verificate</a>`,
  };
  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      username: newUser.username,
      email: newUser.email,
      subscription: "starter",
      avatarURL,
    },
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });

  res.status(200).json({ message: "Verification successful" });
};

const singIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  if (!user.verify) {
    throw HttpError(401, "Email not verify");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }
  const { _id: id } = user;
  const payload = {
    id,
  };

  const token = jwt.sign(payload, JWT_SECRET, {
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
  const { path: oldPath, filename } = req.file;
  const newAvatarName = `${req.user.email}_${filename}`;
  const newAvatarPath = path.join(avatarPath, newAvatarName);

  Jimp.read(oldPath)
    .then((image) => {
      return image.resize(250, 250).write(newAvatarPath); // resize
    })
    .catch((err) => {
      console.error(err);
    });

  await fs.unlink(oldPath);
  const avatarURL = path.join("avatars", newAvatarName);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.status(200).json({ avatarURL });
};

export default {
  singUp: ctrlWrapper(singUp),
  verify: ctrlWrapper(verify),
  singIn: ctrlWrapper(singIn),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
