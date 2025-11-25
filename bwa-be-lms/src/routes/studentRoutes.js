import express from "express";
import multer from "multer";
import { fileFilter } from "../utils/multer.js";
import { fileStorage } from "../utils/multer.js";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  deleteStudent,
  getStudent,
  getStudentById,
  postStudent,
  putStudent,
} from "../controller/studentController.js";

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

studentRoutes.put(
  "/students/:id",
  verifyToken,
  upload.single("avatar"),
  putStudent
);

studentRoutes.delete("/students/:id", verifyToken, deleteStudent);

studentRoutes.get("/students/:id", verifyToken, getStudentById);

export default studentRoutes;
