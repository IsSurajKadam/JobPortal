import express from "express"
import { isAuthenticated, isAuthorized } from "../middleware/auth.js"
import { deleteApplicaton, employerGetAllApplication, jobSeekerGetAllApplication, postApplication, updateStatus,getApplicationById } from "../controllers/applicationCotroller.js"
const router=express.Router()
router.post("/post/:id",isAuthenticated,isAuthorized("Job Seeker"),postApplication)
router.get("/employer/getall",isAuthenticated,isAuthorized("Employer"),employerGetAllApplication)
router.get("/jobseeker/getall",isAuthenticated,isAuthorized("Job Seeker"),jobSeekerGetAllApplication)
router.delete("/delete/:id",isAuthenticated,deleteApplicaton)
router.post("/status/:id",isAuthenticated,isAuthorized("Employer"),updateStatus)
router.get("/application/:id", isAuthenticated, isAuthorized("Employer"), getApplicationById);
export default router