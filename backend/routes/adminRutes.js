import express from "express";
import { blockEmployer, unblockEmployer, getBlockedEmployers,getAllUsers,getEmployerJobs } from "../controllers/adminController.js";
import { isAuthenticated, isAuthorized } from "../middleware/auth.js";

const router = express.Router();

// ✅ Only Admins Can Perform These Actions
router.post("/block-employer/:employerId", isAuthenticated, isAuthorized("Admin"), blockEmployer);
router.post("/unblock-employer/:employerId", isAuthenticated, isAuthorized("Admin"), unblockEmployer);
router.get("/employer/:employerId/jobs",isAuthenticated,isAuthorized("Admin"),getEmployerJobs)
router.get("/blocked-employers", isAuthenticated, isAuthorized("Admin"), getBlockedEmployers);
router.get("/users", isAuthenticated, isAuthorized("Admin"), getAllUsers);


export default router;
