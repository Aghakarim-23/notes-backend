import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existed = await User.findOne({ email });

    if (existed)
      return res.status(400).json({ message: "Email is already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      username,
      email,
      password: hashedPassword,
    };

    const user = await User.create(newUser);


    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        username,
        email,
      },
    });
  } catch (error) {
    console.error("Error happened:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User is not found" });

    const isMathced = await bcrypt.compare(password, user.password);
    if (!isMathced)
      return res.status(400).json({ message: "Password is inccorect" });



     const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    

    res.status(200).json({
      message: "Login is successfull",
      user: {
        id: user._id,
        username: user.username,
        email: email,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
