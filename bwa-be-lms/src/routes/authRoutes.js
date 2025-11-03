import express from "express";
import { validateRequest } from "../middleware/validateRequest.js";
import { signinSchema, signupSchema } from "../utils/schema.js";
import { signInAction, signUpAction } from "../controller/authController.js";

const authRoutes = express.Router();

authRoutes.post('/sign-up', validateRequest(signupSchema), signUpAction);
authRoutes.post('/sign-in', validateRequest(signinSchema), signInAction);

export default authRoutes;