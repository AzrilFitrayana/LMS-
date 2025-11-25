import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import courseModel from "../models/courseModel.js";
import { mutateStudentSchema } from "../utils/schema.js";

export const getStudent = async (req, res) => {
  try {
    const students = await userModel.find({
      role: "student",
      manager: req.user._id,
    });
    // .select("name course foto");

    const fotoUrl = process.env.APP_URL + "/uploads/students/";

    const response = students.map((std) => {
      return {
        ...std.toObject(),
        foto_url: fotoUrl + std.foto,
      };
    });

    return res.status(200).json({
      message: "Get Student Success",
      data: response,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const postStudent = async (req, res) => {
  try {
    const body = req.body;

    const parse = mutateStudentSchema.safeParse(body);

    if (!parse.success) {
      const errorMessage = parse.error.issues.map((err) => err.message);

      // hapus gambar
      if (req?.file?.path && fs.existsSync(req?.file?.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(400).json({
        message: "Error Validation",
        data: null,
        errors: errorMessage,
      });
    }

    const hashPassword = await bcrypt.hash(body.password, 12);

    const student = new userModel({
      name: parse.data.name,
      email: parse.data.email,
      password: hashPassword,
      foto: req.file?.filename,
      manager: req.user?._id,
      role: "student",
    });

    const response = await student.save();

    return res.status(200).json({
      message: "Post student success",
      data: response,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const putStudent = async (req, res) => {
  try {
    const body = req.body;
    const { id } = req.params;

    const parse = mutateStudentSchema
      .partial({ password: true })
      .safeParse(body);

    if (!parse.success) {
      const errorMessage = parse.error.issues.map((err) => err.message);

      // hapus gambar
      if (req?.file?.path && fs.existsSync(req?.file?.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(400).json({
        message: "Error Validation",
        data: null,
        errors: errorMessage,
      });
    }

    const student = await userModel.findById(id);

    const hashPassword = parse.data?.password
      ? await bcrypt.hash(parse.data.password, 12)
      : student.password;

    await userModel.findByIdAndUpdate(id, {
      name: parse.data.name,
      email: parse.data.email,
      password: hashPassword,
      foto: req?.file ? req.file?.filename : student.foto,
    });

    // Jika ada file baru yang diupload DAN user sebelumnya punya foto
    if (req?.file && student.foto) {
      const oldPath = path.join("public/uploads/students/", student.foto);

      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    return res.status(200).json({
      message: "Put student success",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    await courseModel.findOneAndUpdate(
      {
        student: { $in: id },
      },
      {
        $pull: {
          student: id,
        },
      }
    );

    const studentImage = await userModel.findById(id);

    const dirname = path.resolve();
    // console.log("dirname", dirname);
    // dirname D:\bwa\LMS-BWA\bwa-be-lms

    const filePath = path.join(
      dirname,
      "public/uploads/students",
      studentImage.foto
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    const student = await userModel.findByIdAndDelete(id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json({
      message: "Delete student success",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
