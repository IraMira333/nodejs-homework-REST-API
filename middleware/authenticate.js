import jwt from "jsonwebtoken";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import User from "../models/User.js";

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  console.log(process.env.JWT_SECRET);
  const [bearer, token] = authorization.split(" ");
  if (bearer === "Bearer") {
    throw HttpError(401);
  }
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id);
    if (!user) {
      throw HttpError(401);
    }
    next();
  } catch {
    throw HttpError(401);
  }
};
export default ctrlWrapper(authenticate);
