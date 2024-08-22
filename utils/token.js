import jwt from "jsonwebtoken"

const generateTokenAndSetCookie = (user, res) => {
    const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: "15d" })
    res.cookie("jwt", token, { expiresIn: new Date(Date.now()) + 900000, httpOnly: true })
}

export default generateTokenAndSetCookie