import express from 'express'
import multer from 'multer'
import { deleteCourse, getCategories, getCourse, getCourseById, postCourse, updateCourse } from '../controller/courseController.js'
import { verifyToken } from '../middleware/verifyToken.js'
import { fileStorageCourse, fileFilter } from '../utils/multer.js'

const courseRoutes = express.Router()

const upload = multer({
    storage: fileStorageCourse,
    fileFilter
})

courseRoutes.get('/courses', verifyToken, getCourse)
courseRoutes.get('/courses/:id', verifyToken, getCourseById)
courseRoutes.post('/courses', verifyToken, upload.single('thumbnail'), postCourse)
courseRoutes.put('/courses/:id', verifyToken, upload.single('thumbnail'), updateCourse)
courseRoutes.delete('/courses/:id', verifyToken, deleteCourse)
courseRoutes.get('/categories', verifyToken, getCategories)


export default courseRoutes