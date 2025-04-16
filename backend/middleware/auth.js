import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import jwt from 'jsonwebtoken'
import ErrorHandler from "./error.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("User is not authenticated", 401)); // Added status code
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY); // ✅ JWT_KEY should be correct
    req.user = await User.findById(decoded.id);             // Attach user to req

    if (!req.user) {
      return next(new ErrorHandler("User not found", 404));
    }
  
    next(); // Continue to next middleware
  } catch (err) {
    return next(new ErrorHandler("Invalid token", 401)); // Handles token errors
  }
});


export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) { // Added null check
      return next(
        new ErrorHandler(`${req.user?.role || "User"} not allowed to access this resource.`, 403)
      );
    }
    
    next();
  };
};
