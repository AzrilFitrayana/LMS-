import courseModel from "../models/courseModel.js";
import categoryModel from "../models/categoryModel.js";
import { mutateCourseSchema } from "../utils/schema.js";
import fs from "fs";
import userModel from "../models/userModel.js";
import path from "path";

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
      thumbnail: req.file ? req.file?.filename : oldCourse.thumbnail,
      manager: req.user._id,
    });

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
