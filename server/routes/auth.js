import express from "express";
import { login } from "../controllers/auth.js";


const router = express.Router();

//this becomes auth/login because it gets called from
router.post("/login", login);

export default router;