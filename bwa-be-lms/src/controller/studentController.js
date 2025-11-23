import fs from "fs";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import { mutateStudentSchema } from "../utils/schema.js";

export const getStudent = async (req, res) => {
  try {
    const students = await userModel.find({
      role: "student",
      manager: req.user._id,
    });

    return res.status(200).json({
      message: "Get Student Success",
      data: students,
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
