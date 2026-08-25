import bcrypt from "bcryptjs";
import User from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error = new Error("Email already exists");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};

export const refreshAccessToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    if (decoded.type !== "refresh") {
      const error = new Error("Invalid refresh token");
      error.statusCode = 401;
      throw error;
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      const error = new Error("User no longer exists");
      error.statusCode = 401;
      throw error;
    }

    const accessToken = generateAccessToken(user._id);

    return {
      accessToken,
    };
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      error.statusCode = 401;
      error.message = "Refresh token expired";
    }

    if (error.name === "JsonWebTokenError") {
      error.statusCode = 401;
      error.message = "Invalid refresh token";
    }

    throw error;
  }
};
