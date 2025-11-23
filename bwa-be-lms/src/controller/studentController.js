import userModel from "../models/userModel.js";

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
