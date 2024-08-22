import bcrypt from "bcryptjs"
import _ from "lodash"

import userModel from "../models/auth.model.js"
import generateTokenAndSetCookie from "../utils/token.js"

export const signup = async (req, res) => {

    const { fullName, username, password, confirm, gender } = req.body

    if (password !== confirm) {
        return res.status(400).json({ message: "Password did't match" })
    }

    try {
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        const user = await userModel({
            fullName,
            username,
            password: hashPassword,
            gender
        })
        const result = await user.save()
        generateTokenAndSetCookie(result, res)
        res.status(201).json(_.pick(result, ["fullName", "username", "gender", "_id"]))
    } catch (error) {
        console.log(error.message)
        res.status(400).json({ message: "something went wrong - check console" })
    }
}

export const login = async (req, res) => {
    const { username, password } = req.body
    try {
        const user = await userModel.findOne({ username })
        const matched = await bcrypt.compare(password, user?.password || "")
        if (user && matched) {
            generateTokenAndSetCookie(user, res)
            return res.status(200).json(_.pick(user, ["fullName", "username", "gender", "_id"]))
        }
        res.status(400).json({ message: "Invalid username or password" })
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({ message: "something went wrong - check console" })
    }
}

export const logout = (req, res) => {
    res.cookie("jwt", "", { maxAge: 0 })
    res.status(200).json({ message: "Logout Successfully" })
}