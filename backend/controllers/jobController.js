import { catchAsyncErrors } from '../middleware/catchAsyncErrors.js';
import ErrorHandler from "../middleware/error.js";
import { Job } from "../models/jobSchema.js";
import { Interview } from '../models/Interview.js';
import {Application} from '../models/applicationSchema.js'



export const postJob = catchAsyncErrors(async (req, res, next) => {
  const {
    title,
    jobType,
    location,
    companyName,
    introduction,
    responsibilities,
    qualifications,
    offers,
    salary,
    hiringMultipleCandidates,
    personalWebsiteTitle,
    personalWebsiteUrl,
    jobNiche,
    validityPeriod,
    
  } = req.body;

  console.log("job post: ",req.body)

  // Validate required fields
  if (
    !title || !jobType || !location || !companyName || !introduction ||
    !responsibilities || !qualifications || !salary || !jobNiche || !validityPeriod
  ) {
    return next(new ErrorHandler("Please provide full job details.", 400));
  }

 
  if (hiringMultipleCandidates && !["Yes", "No"].includes(hiringMultipleCandidates)) {
    return next(new ErrorHandler("Invalid value for hiringMultipleCandidates.", 400));
  }

  


  // Function to calculate expiry date based on validity period
  const calculateExpireDate = (validity) => {
    let expiryDate = new Date();
    if (validity === "3-month") {
      expiryDate.setMonth(expiryDate.getMonth() + 3);
    } else if (validity === "6-month") {
      expiryDate.setMonth(expiryDate.getMonth() + 6);
    } else if (validity === "1-year") {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    } else {
      return null;
    }
    return expiryDate;
  };

  const expiryDate = calculateExpireDate(validityPeriod);
  if (!expiryDate) {
    return next(new ErrorHandler("Invalid job validity period.", 400));
  }

  const postedBy = req.user._id;

  const job = await Job.create({
    title,
    jobType,
    location,
    companyName,
    introduction,
    responsibilities,
    qualifications,
    offers,
    salary,
    hiringMultipleCandidates: hiringMultipleCandidates || "No",
    personalWebsite: {
      title: personalWebsiteTitle,
      url: personalWebsiteUrl,
    },
    jobNiche,
    expiryDate,
    postedBy,
   
  });

  res.status(201).json({
    success: true,
    message: "Job posted successfully.",
    job,
  });
});



export const getAllJobs = catchAsyncErrors(async (req, res, next) => {
  const { city, niche, searchKeyword } = req.query;
  const query = {};
  if (city) {
    query.location = city;
  }
  if (niche) {
    query.jobNiche = niche;
  }
  if (searchKeyword) {
    query.$or = [
      { title: { $regex: searchKeyword, $options: "i" } },
      { companyName: { $regex: searchKeyword, $options: "i" } },
      { introduction: { $regex: searchKeyword, $options: "i" } },
      {location:{$regex:searchKeyword,$options:"i"}},
      {jobNiche:{$regex:searchKeyword,$options:"i"}}
    ];
  }
  const jobs = await Job.find(query);
  res.status(200).json({
    success: true,
    jobs,
    count: jobs.length,
  });
});
export const deleteJob=catchAsyncErrors(async(req,res,next)=>
{
  const {id}=req.params;
  const job=await Job.findById(id);

  if(!job)
  {
    return next(new ErrorHandler("Ooops ! Job not found",400))

  }
  await job.deleteOne();
  res.status(200).json({
    success:true,
    message:"Job deleted.."
  })
})
export const getSingleJob=catchAsyncErrors(async(req,res,next)=>
{
  const {id}=req.params;
  const job=await Job.findById(id);

  if(!job)
  {
    return next(new ErrorHandler("Job not found",400))

  }
  res.status(200).json({
    success:true,
    job
  })
})
export const getMyJobs=catchAsyncErrors(async(req,res,next)=>
{
const myJobs=await Job.find({postedBy:req.user._id})
res.status(200).json({
  success:true,
  myJobs
})
})

export const deleteExpiredJobs = async (req, res) => {
  const currentDate = new Date();

  try {
    // Find expired jobs
    const expiredJobs = await Job.find({ expiryDate: { $lte: currentDate } });

    if (expiredJobs.length === 0) {
      return res.status(200).json({ success: true, message: "No expired jobs found." });
    }

    for (const job of expiredJobs) {
      const jobId = job._id;

      // Delete applications linked to this job
      await Application.deleteMany({ "jobInfo.jobId": jobId });

      // Delete interviews linked to this job
      await Interview.deleteMany({ jobId });

      // Delete job from database
      await Job.findByIdAndDelete(jobId);

      console.log(`Deleted job: ${jobId}, along with related applications and interviews.`);
    }

    return res.status(200).json({
      success: true,
      message: `Deleted ${expiredJobs.length} expired job(s) along with related applications and interviews.`,
    });
  } catch (error) {
    console.error("Error deleting expired jobs:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};