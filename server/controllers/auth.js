//crypts password
import bcrypt from "bcrypt";
//send a token so the user can use it for auth
import jwt from "jsonwebtoken";

//user model
import User from "../models/User.js";

// REGISTER USER

//calling the mongoose database
//use async

//we get req from the front end
//and we send back the rest
export const register = async (req, res) => {
    try {
        const {
            userName,
            email,
            password,
            friends,
            picturePath,
        } = req.body;

        //password hash
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            userName,
            email,
            password: passwordHash,
            friends,
            picturePath,
        });
        const savedUser = await newUser.save();
        //res so the frontend can recieve the response
        res.status(201).json(savedUser);
        
    } catch (error) {
        res.status(500).json({ error: error.message });

    }

}


//LOGINING IN
export const login = async (req, res) => {
    try {
        //extracts the email and password from frontend
        const { email, password } = req.body;
        //wait to see if any users match the same email
        const user = await User.findOne({ email: email })

        if (!user) {
            return res.status(400).json({ msg: "User does not exist."});
        }

        //compares the pass just sent and the pass in the database
        //uses the same salt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials."})

        }

        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ token, user });

    } catch (err) {
        res.status(500).json({ error: error.message });
    }
}

