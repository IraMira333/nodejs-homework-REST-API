import User from "../models/User.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const singUp = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email already exist");
  }
  const newUser = await User.create(req.body);
  res.status(201).json({
    username: newUser.username,
    email: newUser.email,
  });
};

export default {
  singUp: ctrlWrapper(singUp),
};
