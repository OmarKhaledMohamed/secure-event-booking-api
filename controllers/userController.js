import { getCurrentUser } from "../services/userService.js";

export const getMe = async (req, res, next) => {
  try {
    const user = await getCurrentUser(req.user);

    res.status(200).json({
      success: true,
      message: "User data retrieved successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
