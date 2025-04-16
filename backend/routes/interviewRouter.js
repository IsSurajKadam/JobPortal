import express from "express";
import { isAuthenticated, isAuthorized } from "../middleware/auth.js";
import {
  scheduleInterview,
  getUserInterviews,
  updateInterviewStatus,
  deleteInterview,
} from "../controllers/interviewController.js";

const router = express.Router();

// 📝 Schedule interview (Employer only)
router.post("/schedule/:applicationId/:jobId/:candidateId",isAuthenticated,isAuthorized("Employer"), scheduleInterview);

router.post("/test/:jobId/:candidateId", (req, res) => {
  res.json({ message: "Test route works!", params: req.params });
});


// 📅 Get all interviews for employer
router.get("/myInterviews/:userId",isAuthenticated, getUserInterviews);

// 📅 Get all interviews for job seeker
router.get("/jobseeker/getall", isAuthenticated, isAuthorized("Job Seeker"), getUserInterviews);

// ✅ Update interview status (Employer only)
router.post("/status/:id", isAuthenticated, isAuthorized("Employer"), updateInterviewStatus);

// 🗑️ Delete interview (Employer only)
router.delete("/delete/:id", isAuthenticated, isAuthorized("Employer"), deleteInterview);

export default router;
