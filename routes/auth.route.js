import express from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";
import { checkUserExistance } from "../middlewares/protectRoutes.js";

const router = express.Router();

router.post("/signup", checkUserExistance, signup);

router.post("/login", login);

router.post("/logout", logout);

export default router;
