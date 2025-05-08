import { catchAsyncErrors } from '../middleware/catchAsyncErrors.js';
import ErrorHandler from "../middleware/error.js";
import { Job } from '../models/jobSchema.js';
import Report from '../models/Report.js';

export const submitReport = catchAsyncErrors(async (req, res, next) => {
  const { jobId } = req.params; // jobId passed in URL
  const { reason } = req.body;

  if (!reason) {
    return next(new ErrorHandler("Reason is required.", 400));
  }

  // Fetch job details (to get job title and company name)
  const jobDetails = await Job.findById(jobId);
  if (!jobDetails) {
    return next(new ErrorHandler("Job not found.", 404));
  }

  const reportData = {
    jobTitle: jobDetails.title,
    companyName: jobDetails.companyName,
    reason,
    employerId: jobDetails.postedBy,
    reportedBy: req.user._id,
    // status will be set to default "Pending"
  };

  const report = await Report.create(reportData);

  res.status(201).json({
    success: true,
    message: "Report submitted successfully.",
    report,
  });
});

export const getAllReports = catchAsyncErrors(async (req, res, next) => {
  const reports = await Report.find()
    .populate("reportedBy", "name email")
    .populate("employerId", "name email");
  
  res.status(200).json({
    success: true,
    reports,
  });
});

export const updateReportStatus = catchAsyncErrors(async (req, res, next) => {
  const { reportId } = req.params;
  const { status } = req.body;
  
  // Validate status value
  const validStatuses = ["Pending", "Reviewed", "Action Taken"];
  if (!validStatuses.includes(status)) {
    return next(new ErrorHandler("Invalid status. Valid statuses are: " + validStatuses.join(", "), 400));
  }

  const report = await Report.findById(reportId);
  if (!report) {
    return next(new ErrorHandler("Report not found.", 404));
  }

  report.status = status;
  await report.save();

  res.status(200).json({
    success: true,
    message: "Report status updated successfully.",
    report,
  });
});

export const deleteReport = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // Check if report exists
  const report = await Report.findById(id);
  if (!report) {
    return next(new ErrorHandler("Report not found.", 404));
  }

  // Verify admin privileges
  if (req.user.role !== "Admin") {
    return next(
      new ErrorHandler("You are not authorized to delete reports.", 403)
    );
  }

  // Delete the report
  await Report.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Report deleted successfully.",
  });
});

export const getMyReports = catchAsyncErrors(async (req, res, next) => {
  // Get reports where reportedBy matches the logged-in user's ID
  const reports = await Report.find({ reportedBy: req.user._id })
    .sort({ createdAt: -1 }); // Sort by newest first

  if (reports.length === 0) {
    return res.status(200).json({
      success: true,
      message: "You haven't reported any jobs yet.",
      reports: []
    });
  }

  res.status(200).json({
    success: true,
    message: "Your reported jobs retrieved successfully.",
    reports
  });
});