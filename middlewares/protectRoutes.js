import jwt from "jsonwebtoken";
import Joi from "joi";
import User from "../models/auth.model.js";

export const protectRoutes = (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    // console.log("token: ", token)
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }
    const decoded = jwt.verify(token, process.env.SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }
    // console.log(decoded)
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "Internal Issue in Middleware - check console" });
  }
};

const schema = Joi.object({
  fullName: Joi.string().trim().min(3).max(30).required(),
  username: Joi.string().alphanum().trim().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{8,30}$")),
  confirm: Joi.ref("password"),
  gender: Joi.string().valid("male", "female"),
});

export const checkUserExistance = async (req, res, next) => {
  const { fullName, username, password, confirm, gender } = req.body;
  const { error, value } = schema.validate({
    fullName,
    username,
    password,
    confirm,
    gender,
  });
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  try {
    const user = await User.findOne({ username: value.username });
    if (user) {
      return res.status(400).json({ error: "User already exist" });
    }
    next();
  } catch (error) {
    console.log("error in checkUserExistance Middleware - " + error.message);
    res.status(500).json({ error: "Internal Server Error - Check Console" });
  }
};
