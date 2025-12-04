import { User } from "../models/User.js";

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    if (users.length === 0) {
      res.status(404).json("Users not found");
    }
    res.status(200).json({
      data: {
        count: users.length,
        users,
      },
    });
  } catch (error) {
    console.error(error);``
    res.status(500).json({ message: "Server error" });
  }
};
