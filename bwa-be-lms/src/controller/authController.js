import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";

export const signUpAction = async (req, res) => {
    try {
        const body = req.body; //name, email, password

        const hashPassword = await bcrypt.hash(body.password, 12)

        const user = new userModel({
            name: body.name,
            email: body.email,
            password: hashPassword,
            foto: 'default.jpg',
            role: 'manager',
        });

        // action payment gateway midtrans

        await user.save();

        return res.json({
            message: 'success',
            data: {
                midtrans_payment_url: 'https://google.com'
            } 
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'internal server error'
        })
    }
}