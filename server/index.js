import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";

//route folder of the path/routes for types of features
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/post.js";

//helps set the path when we configure directories
import path from "path";
import { fileURLToPath } from "url";
// import { register } from "module";

import { register } from "./controllers/auth.js";
import { verifyToken } from "./middleware/auth.js";
import { createPost } from "./controllers/posts.js";

import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

// CONFIGURATIONS

//so we can grab the file URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

//set the directory of where we keep our assets
//this is stored locally for now
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));

// FILE STORAGE
//this is on multer's website
//when a file is uploaded, it gets saved in the public/assets folder
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

// ROUTES WITH FILES

//defines a POST route at path /auth/register
//multer middleware that handles file uploads
//argument "picture" is the name of the form field that will hold the file
//when a client sends  form with a file in the field named "picture", 
//multer will handle the file upload
//multer saves the uploaded file to the specified directory and adds info
//about the file to req.file
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

//ROUTES
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);


// MONGOOSE SETUP
const PORT = process.env.PORT || 6001;

console.log('MongoDB connection string:', process.env.MONGO_URL);

mongoose.connect(process.env.MONGO_URL, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    //only add one time
    // User.insertMany(users);
    // Post.insertMany(posts);

}).catch((error) => console.log(`${error} did not connect`));
