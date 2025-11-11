import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const verifyToken = async (req, res, next) => {
  const secretKey = process.env.SECRET_KEY ?? "";

  if (req.headers?.authorization?.split(" ")[0] === "JWT") { //apakah ada teks JWT
    const decode = jwt.verify(
      req.headers?.authorization?.split(" ")[1], //Memisahkan berdasarkan spasi dan Mengambil bagian kedua setelah dipisah
      secretKey
    );

    const user = await userModel.findById(
      decode.data.id,
      "_id name email role"
    );

    if (!user) {
      return res.status(400).json({
        message: "Token expired",
      });
    }

    req.user = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } else {
    return res.status(400).json({
      message: "Unauthorization",
    });
  }
};
