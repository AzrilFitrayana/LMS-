import mongoose from "mongoose";

const userModel = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        foto: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['manager', 'student'],
            default: 'manager'
        },
        course: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course'
            }
        ],
        manager: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    }
)

export default mongoose.model('User', userModel);