import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { sendEmail } from "../utils/sendEmail.js";

dotenv.config();

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existed = await User.findOne({ email });

    if (existed)
      return res.status(400).json({ message: "Email is already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const verifyToken = crypto.randomBytes(32).toString("hex");

    const newUser = {
      username,
      email,
      password: hashedPassword,
      emailVerifyToken: verifyToken,
    };

    const user = await User.create(newUser);

    const verifyLink = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;

await sendEmail({
  to: user.email,
  subject: "Verify your email address",
  html: `
  <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f3f4f6; padding: 40px;">
    <div style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 32px; text-align: center;">
      
      <div style="margin-bottom: 24px;">
        <div style="
          width: 56px;
          height: 56px;
          margin: 0 auto;
          border-radius: 50%;
          background-color: #dcfce7;
          color: #16a34a;
          font-size: 28px;
          line-height: 56px;
        ">
          ✓
        </div>
      </div>

      <h2 style="color: #111827; margin-bottom: 12px;">
        Verify your email
      </h2>

      <p style="color: #4b5563; font-size: 15px; margin-bottom: 24px;">
        Thanks for creating an account.  
        Please confirm your email address by clicking the button below.
      </p>

      <a
        href="${verifyLink}"
        style="
          display: inline-block;
          background-color: #16a34a;
          color: #ffffff;
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          margin-bottom: 24px;
        "
      >
        Verify Email
      </a>

      <p style="color: #6b7280; font-size: 13px; margin-top: 24px;">
        If you didn’t create this account, you can safely ignore this email.
      </p>

      <p style="color: #9ca3af; font-size: 12px; margin-top: 16px;">
        This link will expire in 15 minutes.
      </p>
    </div>
  </div>
  `,
});


    res.status(201).json({
      message: "Registration successful. Please verify your email.",
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

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first",
      });
    }

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

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! forgot password

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await sendEmail({
      to: user.email,
      subject: "Reset your password",
      html: `
     <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
    <h2>Password Reset Request</h2>
    <p>Hello,</p>
    <p>You requested a password reset. Click the button below to reset your password:</p>
    <a href="${resetUrl}" 
       style="
         display: inline-block;
         padding: 12px 24px;
         font-size: 16px;
         color: white;
         background-color: #007bff;
         text-decoration: none;
         border-radius: 5px;
       ">
       Reset Password
    </a>
    <p>This link will expire in 10 minutes.</p>
    <hr>
    <p style="font-size:12px; color:gray;">
      If you did not request this, you can ignore this email.
    </p>
  </div>`,
    });

    res.json({ message: "Password reset email sent" });
    console.log("ssended");
  } catch (error) {
    console.log("Forgot Password error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! forgot password

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

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const { old_password, new_password, confirm_password } = req.body;

    if (new_password !== confirm_password)
      return res
        .status(400)
        .json({ message: "New password and confirm password do not match" });

    const isMatch = await bcrypt.compare(old_password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect" });

    const hashedPassword = await bcrypt.hash(new_password, 10);

    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({ emailVerifyToken: token });

  if (!user)
    return res.status(400).json({ message: "Invalid or expired token" });

  user.isVerified = true;
  user.emailVerifyToken = undefined;

  await user.save();

  res.json({ message: "Email verified successfully" });
};
