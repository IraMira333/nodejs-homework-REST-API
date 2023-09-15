import express from "express";
import authControllers from "../../controllers/authControllers.js";
import * as userSchemas from "../../models/User.js";
import { validateBody } from "../../decorators/index.js";

const authRouter = express.Router();
const userSingUpValidate = validateBody(userSchemas.userSingUpSchema);
const userSingInValidate = validateBody(userSchemas.userSingInSchema);

authRouter.post("/users/register", userSingUpValidate, authControllers.singUp);
authRouter.post("/users/login", userSingInValidate, authControllers.singIn);

export default authRouter;
