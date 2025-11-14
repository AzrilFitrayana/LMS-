import { deleteCourse, getCategories, getCourse, getCourseById, postContentCourse, postCourse, updateCourse } from '../controller/courseController.js'
import { validateRequest } from "../middleware/validateRequest.js";
import { fileStorageCourse, fileFilter } from '../utils/multer.js'
import { verifyToken } from '../middleware/verifyToken.js'
import { mutateContentSchema } from '../utils/schema.js';
import express from 'express'
import multer from 'multer'

const courseRoutes = express.Router()

const upload = multer({
    storage: fileStorageCourse,
    fileFilter
})

//courses
courseRoutes.get('/courses', verifyToken, getCourse)
courseRoutes.get('/courses/:id', verifyToken, getCourseById)
courseRoutes.post('/courses', verifyToken, upload.single('thumbnail'), postCourse)
courseRoutes.put('/courses/:id', verifyToken, upload.single('thumbnail'), updateCourse)
courseRoutes.delete('/courses/:id', verifyToken, deleteCourse)
courseRoutes.get('/categories', verifyToken, getCategories)

//content
courseRoutes.post('/courses/contents', verifyToken, validateRequest(mutateContentSchema), postContentCourse);


export default courseRoutes