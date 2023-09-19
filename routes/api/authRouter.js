import express from "express";
import authControllers from "../../controllers/authControllers.js";
import * as userSchemas from "../../models/User.js";
import { validateBody } from "../../decorators/index.js";
import { authenticate } from "../../middleware/index.js";

const authRouter = express.Router();
const userSingUpValidate = validateBody(userSchemas.userSingUpSchema);
const userSingInValidate = validateBody(userSchemas.userSingInSchema);
const userUpdatSubscriptionValidate = validateBody(
  userSchemas.userUpdateSubscribptionSchema
);

authRouter.post("/register", userSingUpValidate, authControllers.singUp);
authRouter.post("/login", userSingInValidate, authControllers.singIn);
authRouter.get("/current", authenticate, authControllers.getCurrent);
authRouter.post("/logout", authenticate, authControllers.logout);
authRouter.patch(
  "/",
  authenticate,
  userUpdatSubscriptionValidate,
  authControllers.updateSubscription
);

export default authRouter;
