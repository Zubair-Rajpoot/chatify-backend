import User from "../models/auth.model.js";

export const getUsers = async (req, res) => {
  try {
    const id = req.user._id;

    const users = await User.find({ _id: { $ne: id } });
    if (!users) return res.status(200).json([]);

    res.status(200).json(users);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
