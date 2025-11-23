import express from "express";
import multer from "multer";
import { fileFilter } from "../utils/multer.js";
import { fileStorage } from "../utils/multer.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { getStudent, postStudent } from "../controller/studentController.js";

const studentRoutes = express.Router();
const upload = multer({
  storage: fileStorage("students"),
  fileFilter,
});

studentRoutes.get("/students", verifyToken, getStudent);
studentRoutes.post(
  "/students",
  verifyToken,
  upload.single("avatar"),
  postStudent
);

export default studentRoutes;
