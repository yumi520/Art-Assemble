import mongoose from "mongoose";

const UserScehma = new mongoose.Schema(
    {
        userName: {
            type: String,
            require: true,
            min: 3,
            max: 50,
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        picturePath: {
            type: String,
            default: "",
        },
        friends: {
            type: Array,
            default: [],
        },
        impressions: Number,
    }, { timestamps: true }
);

const User = mongoose.model("User", UserScehma);
export default User;