import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getStudent } from "../controller/studentController.js";

const studentRoutes = express.Router();

studentRoutes.get("/students", verifyToken, getStudent);

export default studentRoutes;
