import mongoose from "mongoose";
import categoryModel from "./categoryModel.js";
import courseDetailModel from "./courseDetailModel.js";
import userModel from "./userModel.js";

const courseModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  tagline: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  student: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  details: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseDetail",
    },
  ],
});

// middleware untuk delete data yang berelasi
courseModel.post("findOneAndDelete", async (doc) => {
  if (doc) {
    await categoryModel.findByIdAndUpdate(doc.category, {
      //one to one
      $pull: {
        course: doc._id,
      },
    });

    await courseDetailModel.deleteMany({
      //one to many
      course: doc._id,
    });

    doc.student?.map(async (std) => {
      //many to many
      await userModel.findByIdAndUpdate(std._id, {
        $pull: {
          course: doc._id,
        },
      });
    });
  }
});

export default mongoose.model("Course", courseModel);
