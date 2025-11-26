import courseDetailModel from "../models/courseDetailModel.js";
import { mutateCourseSchema } from "../utils/schema.js";
import categoryModel from "../models/categoryModel.js";
import courseModel from "../models/courseModel.js";
import userModel from "../models/userModel.js";
import path from "path";
import fs from "fs";

const uploadDir = "public/uploads/courses";

export const getCourse = async (req, res) => {
  //   console.log(req);

  try {
    const courses = await courseModel
      .find({
        manager: req.user?._id,
      })
      .select("name thumbnail")
      .populate({
        path: "category",
        select: "name -_id",
      })
      .populate({
        path: "student",
        select: "name",
      });

    const imageUrl = process.env.APP_URL + "/uploads/courses/";

    const response = courses.map((item) => {
      return {
        ...item.toObject(),
        thumbnail_url: imageUrl + item.thumbnail,
        total_students: item.student.length,
      };
    });

    return res.json({
      message: "Get Course Success",
      data: response,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "internal server error",
    });
  }
};

export const postCourse = async (req, res) => {
  try {
    const body = req.body;

    // console.log(body);

    const parse = mutateCourseSchema.safeParse(body);

    if (!parse.success) {
      const errorMessage = parse.error.issues.map((err) => err.message);

      //hapus gambar
      // req.file.path ==> akses file yang sudah di uploaded
      if (req?.file?.path && fs.existsSync(req?.file?.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(500).json({
        message: "Error Validation",
        data: null,
        errors: errorMessage,
      });
    }

    const category = await categoryModel.findById(parse.data.categoryId);

    if (!category) {
      return res.status(500).json({
        message: "Category ID Not Found",
      });
    }

    const course = new courseModel({
      name: parse.data.name,
      category: category._id,
      tagline: parse.data.tagline,
      description: parse.data.description,
      thumbnail: req.file?.filename,
      manager: req.user._id,
    });

    await course.save();

    await categoryModel.findByIdAndUpdate(
      category._id,
      {
        $push: {
          course: course._id,
        },
      },
      { new: true }
    );

    await userModel.findByIdAndUpdate(
      req.user?._id,
      {
        course: course._id,
      },
      { new: true }
    );

    return res.json({
      message: "Create Course Success",
    });
  } catch (error) {
    if (req?.file?.path && fs.existsSync(req?.file?.path)) {
      fs.unlinkSync(req.file.path);
      console.log(error);
      return res.status(500).json({
        message: "internal server error",
      });
    } else {
      console.log(error);
      return res.status(500).json({
        message: "internal server error",
      });
    }
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const { preview } = req.query;
    const imageUrl = process.env.APP_URL + "/uploads/courses/";

    const course = await courseModel
      .findById(id)
      .populate({
        path: "category",
        select: "name -_id",
      })
      .populate({
        path: "details",
        select: preview === "true" ? "title type youtubeId text" : "title type",
      });

    return res.json({
      message: "Get course detail success",
      data: {
        ...course.toObject(),
        thumbnail_url: imageUrl + course.thumbnail,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "internal server error",
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const body = req.body;
    const courseId = req.params.id;

    const parse = mutateCourseSchema.safeParse(body);

    if (!parse.success) {
      const errorMessage = parse.error.issues.map((err) => err.message);

      //hapus gambar
      // req.file.path ==> akses file yang sudah di uploaded
      if (req?.file?.path && fs.existsSync(req?.file?.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(500).json({
        message: "Error Validation",
        data: null,
        errors: errorMessage,
      });
    }

    const category = await categoryModel.findById(parse.data.categoryId);
    const oldCourse = await courseModel.findById(courseId);
    // console.log(oldCourse.thumbnail);

    const newThumbnail = req.file ? req.file?.filename : oldCourse.thumbnail;
    // console.log(newThumbnail);

    if (!category) {
      return res.status(500).json({
        message: "Category ID Not Found",
      });
    }

    await courseModel.findByIdAndUpdate(courseId, {
      name: parse.data.name,
      category: category._id,
      tagline: parse.data.tagline,
      description: parse.data.description,
      thumbnail: newThumbnail,
      manager: req.user._id,
    });

    // hapus gambar sebelumnya
    if (req.file && newThumbnail !== oldCourse.thumbnail) {
      const oldPath = path.join(uploadDir, oldCourse.thumbnail);
      // console.log(uploadDir)
      // console.log(oldPath)
      // console.log(fs.existsSync(oldPath))

      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    return res.json({
      message: "Update Course Success",
    });
  } catch (error) {
    if (req?.file?.path && fs.existsSync(req?.file?.path)) {
      fs.unlinkSync(req.file.path);
      console.log(error);
      return res.status(500).json({
        message: "internal server error",
      });
    } else {
      console.log(error);
      return res.status(500).json({
        message: "internal server error",
      });
    }
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await courseModel.findById(id);

    const dirname = path.resolve();

    const filePath = path.join(
      dirname,
      "public/uploads/courses",
      course.thumbnail
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await courseModel.findByIdAndDelete(id);

    return res.json({
      message: "Delete course success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find();

    return res.json({
      message: "Get Categories Success",
      data: categories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "internal server error",
    });
  }
};

//Content Course

export const postContentCourse = async (req, res) => {
  try {
    const body = req.body;

    const course = await courseModel.findById(body.courseId);

    const content = new courseDetailModel({
      title: body.title,
      type: body.type,
      course: course._id,
      text: body.text,
      youtubeId: body.youtubeId,
    });

    await courseModel.findByIdAndUpdate(
      course._id,
      {
        $push: {
          details: content._id,
        },
      },
      { new: true }
    );

    await content.save();

    return res.status(200).json({
      message: "Create content success",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateContentCourse = async (req, res) => {
  try {
    const body = req.body;
    const contentId = req.params.id;

    const course = await courseModel.findById(body.courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    await courseDetailModel.findByIdAndUpdate(
      contentId,
      {
        title: body.title,
        type: body.type,
        course: course._id,
        text: body.text,
        youtubeId: body.youtubeId,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Update content success",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteContentCourse = async (req, res) => {
  try {
    const { id } = req.params;

    await courseDetailModel.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Delete content success",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getDetailContentCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await courseDetailModel.findById(id);

    return res.status(200).json({
      data: content,
      message: "Get detail content course",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Student

export const getStudentByCourseId = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await courseModel.findById(id).select("name").populate({
      path: "student",
      select: "name email photo",
    });

    // console.log(course);

    return res.status(200).json({
      message: "Get student by course success",
      data: course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
