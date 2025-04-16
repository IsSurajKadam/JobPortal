import { catchAsyncErrors } from '../middleware/catchAsyncErrors.js';
import ErrorHandler from "../middleware/error.js";
import { User } from "../models/userSchema.js";
import {Job} from "../models/jobSchema.js"
import { v2 as cloudinary } from "cloudinary";
import { sendToken } from '../utils/jwtToken.js';


export const register = catchAsyncErrors(async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      password,
      role,
      firstNiche,
      secondNiche,
      thirdNiche,
      coverLetter,
      secretKey
    } = req.body;

    if (!name || !email || !phone || !address || !password || !role) {
      return next(new ErrorHandler("All fields are required.", 400));
    }

    if (role === "Job Seeker" && (!firstNiche || !secondNiche || !thirdNiche)) {
      return next(
        new ErrorHandler("Please provide your preferred job niches.", 400)
      );
    }
    if (role === "Admin") {
      if (secretKey !== process.env.ADMIN_SECRET_KEY) {
        return next(new ErrorHandler("Your key is invalide", 403));
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler("Email is already registered.", 400));
    }

    const userData = {
      name,
      email,
      phone,
      address,
      password,
      role,
      isAdmin: role === "Admin",
      niches: {
        firstNiche,
        secondNiche,
        thirdNiche,
      },
      coverLetter,
    };

    if (req.files && req.files.resume) {
      const { resume } = req.files;
      if (resume) {
        try {
          const cloudinaryResponse = await cloudinary.uploader.upload(
            resume.tempFilePath,
            { folder: "Job Portal" }
          );
          if (!cloudinaryResponse || cloudinaryResponse.error) {
            return next(
              new ErrorHandler("Failed to upload resume to cloud.", 500)
            );
          }
          userData.resume = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
          };
        } catch (error) {
          return next(new ErrorHandler("Failed to upload resume", 500));
        }
      }
    }

    const user = await User.create(userData);
    sendToken(user,201,res,"user Registered")


  } catch (error) {
    next(error);
  }
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { role, email, password } = req.body;

  if (!role || !email || !password) {
    return next(new ErrorHandler("Email, Password, and Role are required", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  // Check if the password matches
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  // Check if the user's role matches the provided role
  if (user.role !== role) {
    return next(new ErrorHandler("Invalid user role", 400));
  }

  user.checkUnblockStatus();
  await user.save()

  if (user.isBlocked) {
    return next(new ErrorHandler("Your account is temporarily blocked. Please try again later.", 403));
  }

  // Special case for Admin login - Ensure only real admins can log in
  if (role === "Admin" && !user.isAdmin) {
    return next(new ErrorHandler("Unauthorized access. You are not an admin.", 403));
  }

  sendToken(user, 200, res, "User login successfully");
});


export const logout =catchAsyncErrors(async(req,res,next)=>
{
  res.status(200).cookie("token","",{
    expires:new Date(0),
    httpOnly:true,
    path:"/"
  }).json({
    success:true,
    message:"user logout successfully"
  })
})

export const getUser=catchAsyncErrors(async (req,res,next)=>
{
  const user=req.user
  res.status(200).json(
    {
      success:true,
      user,
    }
  )
})

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  let newUserData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
  };

  if (req.user.role === "Job Seeker") {
    newUserData.coverLetter = req.body.coverLetter; // Ensure cover letter is included

    newUserData.niches = {
      firstNiche: req.body.firstNiche,
      secondNiche: req.body.secondNiche,
      thirdNiche: req.body.thirdNiche,
    };

    const { firstNiche, secondNiche, thirdNiche } = newUserData.niches;

    if (!firstNiche || !secondNiche || !thirdNiche) {
      return next(new ErrorHandler("Please provide your preferred job niches", 400));
    }
  }

  if (req.files && req.user.role === "Job Seeker") {
    const resume = req.files.resume;
    if (resume) {
      const currentResumeId = req.user.resume?.public_id;
      if (currentResumeId) {
        await cloudinary.uploader.destroy(currentResumeId);
      }
      const newResume = await cloudinary.uploader.upload(resume.tempFilePath, {
        folder: "Job Portal",
      });
      newUserData.resume = {
        public_id: newResume.public_id,
        url: newResume.secure_url,
      };
    }
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
    message: "Profile updated",
  });
});


export const updatePassword=catchAsyncErrors(async(req,res,next)=>
{
  const user=await User.findById(req.user.id).select("+password")

  const isPasswordMatched=await user.comparePassword(req.body.oldPassword)

  if(!isPasswordMatched)
  {
    return next(new ErrorHandler("Old Password is incorrect",400))

  }
  if(req.body.newPassword !== req.body.confirmPassword)
  {
    return next(new ErrorHandler("New Password and confirm password do not match"),400)
  }

  user.password=req.body.newPassword
  await user.save()

  sendToken(user,200,res,"password updated successfully")
})

export const saveJob = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const { jobId } = req.params;

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (user.savedJobs.includes(jobId)) {
    return next(new ErrorHandler("Job already saved", 400));
  }

  user.savedJobs.push(jobId);
  await user.save();

  res.status(200).json({ success: true, message: "Job saved successfully" });
});

export const unsaveJob = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const { jobId } = req.params;

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  user.savedJobs = user.savedJobs.filter((id) => id.toString() !== jobId);
  await user.save();

  res.status(200).json({ success: true, message: "Job removed from saved jobs" });
});




export const getSavedJobs = async (req, res) => {
  try {
    // Find the logged-in user and populate savedJobs with full job details
    const user = await User.findById(req.user.id).populate({
      path: "savedJobs",
      model: Job, // Explicitly specify the Job model
      select: "title companyName introduction location salary jobType jobPostedOn", // Select required fields
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      savedJobs: user.savedJobs, // Returns full job details
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
