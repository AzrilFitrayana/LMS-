import courseModel from "../models/courseModel.js";
import userModel from "../models/userModel.js";

export const getOverviewController = async (req, res) => {
  try {
    //total course
    const totalCourse = await courseModel
      .find({
        manager: req.user._id,
      })
      .countDocuments();

    //total student
    const course = await courseModel.find({
      manager: req.user._id,
    });

    const totalStudent = course.reduce((acc, curr) => {
      return acc + curr.student.length;
    }, 0);

    //total video
    const courseVideo = await courseModel
      .find({
        manager: req.user._id,
      })
      .populate({
        path: "details",
        select: "name type",
        match: {
          type: "video",
        },
      });

    const totalVideo = courseVideo.reduce((acc, curr) => {
      return acc + curr.details.length;
    }, 0);

    //total text
    const courseText = await courseModel
      .find({
        manager: req.user._id,
      })
      .populate({
        path: "details",
        select: "name type",
        match: {
          type: "text",
        },
      });

    const totalText = courseText.reduce((acc, curr) => {
      return acc + curr.details.length;
    }, 0);

    //latest course
    const coursesList = await courseModel
      .find({
        manager: req.user._id,
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

    const imageCourseUrl = process.env.APP_URL + "/uploads/courses/";

    const latestCourse = coursesList.map((item) => {
      return {
        ...item.toObject(),
        thumbnail_url: imageCourseUrl + item.thumbnail,
      };
    });

    //latest student
    const studentsList = await userModel
      .find({
        role: "student",
        manager: req.user._id,
      })
      .select("name course foto");

    const fotoUrl = process.env.APP_URL + "/uploads/students/";

    const latestStudent = studentsList.map((std) => {
      return {
        ...std.toObject(),
        foto_url: fotoUrl + std.foto,
      };
    });

    return res.status(200).json({
      message: "overview success",
      data: {
        totalCourse,
        totalStudent,
        totalVideo,
        totalText,
        courses: latestCourse,
        students: latestStudent,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
