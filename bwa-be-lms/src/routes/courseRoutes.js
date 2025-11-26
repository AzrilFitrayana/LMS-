import {
  deleteContentCourse,
  deleteCourse,
  deleteStudentToCourse,
  getCategories,
  getCourse,
  getCourseById,
  getDetailContentCourse,
  getStudentByCourseId,
  postContentCourse,
  postCourse,
  postStudentToCourse,
  updateContentCourse,
  updateCourse,
} from "../controller/courseController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { fileStorageCourse, fileFilter } from "../utils/multer.js";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  mutateContentSchema,
  mutateStudentToCourseSchema,
} from "../utils/schema.js";
import express from "express";
import multer from "multer";

const courseRoutes = express.Router();

const upload = multer({
  storage: fileStorageCourse,
  fileFilter,
});

//courses
courseRoutes.get("/courses", verifyToken, getCourse);
courseRoutes.get("/courses/:id", verifyToken, getCourseById);
courseRoutes.post(
  "/courses",
  verifyToken,
  upload.single("thumbnail"),
  postCourse
);
courseRoutes.put(
  "/courses/:id",
  verifyToken,
  upload.single("thumbnail"),
  updateCourse
);
courseRoutes.delete("/courses/:id", verifyToken, deleteCourse);
courseRoutes.get("/categories", verifyToken, getCategories);

//content
courseRoutes.post(
  "/courses/contents",
  verifyToken,
  validateRequest(mutateContentSchema),
  postContentCourse
);
courseRoutes.put(
  "/courses/contents/:id",
  verifyToken,
  validateRequest(mutateContentSchema),
  updateContentCourse
);
courseRoutes.delete("/courses/contents/:id", verifyToken, deleteContentCourse);
courseRoutes.get("/courses/contents/:id", verifyToken, getDetailContentCourse);

// student
courseRoutes.get(`/courses/students/:id`, verifyToken, getStudentByCourseId);
courseRoutes.post(
  `/courses/students/:id`,
  verifyToken,
  validateRequest(mutateStudentToCourseSchema),
  postStudentToCourse
);
courseRoutes.put(
  `/courses/students/:id`,
  verifyToken,
  validateRequest(mutateStudentToCourseSchema),
  deleteStudentToCourse
);

export default courseRoutes;
