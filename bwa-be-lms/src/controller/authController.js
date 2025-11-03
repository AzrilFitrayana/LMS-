import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transactionModel from "../models/transactionModel.js";

export const signUpAction = async (req, res) => {
  const midtransUrl = process.env.MIDTRANS_URL;
  const midtransAuthString = process.env.MIDTRANS_AUTH_STRING;

  try {
    const body = req.body; //name, email, password

    const hashPassword = await bcrypt.hash(body.password, 12);

    const user = new userModel({
      name: body.name,
      email: body.email,
      password: hashPassword,
      foto: "default.jpg",
      role: "manager",
    });

    // action payment gateway midtrans
    const transaction = new transactionModel({
      user: user._id,
      price: 250000,
    });

    const midtrans = await fetch(midtransUrl, {
      method: "POST",
      body: JSON.stringify({
        transaction_details: {
          order_id: transaction._id.toString(),
          gross_amount: transaction.price,
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          email: user.email,
        },
        callbacks: {
          finish: "http://localhost:5173/manager/success-checkout",
        },
      }),
      headers: {
        "content-type": "application/json",
        authorization: `Basic ${midtransAuthString}`,
      },
    });

    const resMidtrans = await midtrans.json();

    await user.save();
    await transaction.save();

    return res.json({
      message: "success",
      data: {
        midtrans_payment_url: resMidtrans.redirect_url,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "internal server error",
    });
  }
};

export const signInAction = async (req, res) => {
  try {
    const body = req.body; //email, password

    // console.log(body);

    const existingUser = await userModel
      .findOne()
      .where("email")
      .equals(body.email);

    // console.log(existingUser);

    if (!existingUser) {
      res.status(400).json({
        message: "user not found",
      });
    }

    const comparePassword = await bcrypt.compare(
      body.password,
      existingUser.password
    );

    if (!comparePassword) {
      res.status(400).json({
        message: "email and password incorect",
      });
    }

    const isValidUser = await transactionModel.findOne({
      user: existingUser._id,
      status: "success",
    });

    if (existingUser.role !== "student" && !isValidUser) {
      return res.status(400).json({
        message: "user not verified",
      });
    }

    const token = jwt.sign(
      {
        data: {
          id: existingUser._id.toString(),
        },
      },
      process.env.SECRET_KEY,
      { expiresIn: "1 days" }
    );

    return res.json({
      message: "User Login Success",
      data: {
        name: existingUser.name,
        email: existingUser.email,
        token,
        role: existingUser.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
