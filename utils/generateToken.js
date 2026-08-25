import jwt from "jsonwebtoken";

export const generateAccessToken = (userId) => {
  return jwt.sign({ userId, type: "access" }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId, type: "refresh" }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });
};
