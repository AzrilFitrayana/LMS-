import express from "express";
import { validateRequest } from "../middleware/validateRequest.js";
import { signupSchema } from "../utils/schema.js";
import { signUpAction } from "../controller/authController.js";

const authRoutes = express.Router();

authRoutes.post('/sign-up', validateRequest(signupSchema), signUpAction);

export default authRoutes;