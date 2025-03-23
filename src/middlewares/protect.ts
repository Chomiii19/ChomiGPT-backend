import { JwtPayload } from "jsonwebtoken";
import User from "../models/userModel";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import verifyToken from "../utils/verifyToken";

const protect = catchAsync(async (req, res, next) => {
  const token = req.cookies.authToken;

  if (token) {
    const decodedToken = verifyToken(token);
    const user = await User.findById((decodedToken as JwtPayload).id);

    if (!user)
      return next(
        new AppError("The user belonging with this token doesn't exist", 404)
      );

    req.user = user;
  } else {
    req.user = undefined;
  }

  next();
});

export default protect;
