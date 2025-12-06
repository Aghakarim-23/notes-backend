import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

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
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login is successfull",
      user: {
        id: user._id,
        username: user.username,
        email: email,
        role: user.role,
      },
      token: accessToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token)
      return res.status(401).json({ message: "Refresh token missing" });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({
      accessToken: newAccessToken,
      message: "New access token created",
    });
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    const resetUrl = `https://agas-notes-app.netlify.app/reset-password/${resetToken}`;
    // const resetUrl = `https://agas-notes-app.netlify.app/reset-password/${resetToken}`

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      to: user.email,
      subject: "Reset your password",
      html: `
        <h3>Password Reset Request</h3>
        <p>Please click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 10 minutes.</p>
      `,
    });

    res.json({ message: "Password reset email sent" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyResetToken = async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    res.json({ message: "Token is valid" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req,res) => {
    const {token} = req.params;
    const {password} = req.body;
    console.log("Token:", token);       // token database-də olanla eyni olmalıdır
  console.log("Password:", password)
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: {$gt: Date.now()}
    })

    console.log("User", user)

    if (!user)
    return res.status(400).json({ message: "Invalid or expired token" });

    const hashedPassword = await bcrypt.hash(password,10)

    console.log(hashedPassword)

    user.password = hashedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;


    await user.save();

    res.json({ message: "Password has been reset successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}
