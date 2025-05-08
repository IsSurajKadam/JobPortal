import express from "express";
import { isAuthenticated,isAuthorized } from "../middleware/auth.js";
import { submitReport,getAllReports,updateReportStatus,getMyReports,deleteReport } from "../controllers/reportController.js";

const router = express.Router();
router.get("/reports",isAuthenticated,isAuthorized("Admin"),getAllReports)
router.delete("/reports/:id",isAuthenticated,isAuthorized("Admin"),deleteReport)
router.get("/reports/me",isAuthenticated,isAuthorized("Job Seeker"),getMyReports)
router.put("/reports/:reportId",isAuthenticated,isAuthorized("Admin"),updateReportStatus)
router.post("/report/:jobId", isAuthenticated,isAuthorized("Job Seeker"), submitReport);

export default router;
