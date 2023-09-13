import express from "express";
import authControllers from "../../controllers/authControllers.js";
import * as userSchemas from "../../models/User.js";
import { validateBody } from "../../decorators/index.js";

const authRouter = express.Router();
const userSingUpValidate = validateBody(userSchemas.userSingUpSchema);

authRouter.post("/singup", userSingUpValidate, authControllers.singUp);

export default authRouter;
