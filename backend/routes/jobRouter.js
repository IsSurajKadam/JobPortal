import express from "express"
import { isAuthenticated, isAuthorized } from "../middleware/auth.js"
import { postJob,getAllJobs,getMyJobs,deleteJob,getSingleJob,deleteExpiredJobs } from "../controllers/jobController.js"
const router=express.Router()

router.post("/post",isAuthenticated,isAuthorized("Employer"),postJob)
router.get("/getall",getAllJobs)
router.get("/getmyjobs",isAuthenticated,isAuthorized("Employer"),getMyJobs)
router.delete("/delete/:id",isAuthenticated,isAuthorized("Employer"),deleteJob)
router.get("/get/:id",isAuthenticated,getSingleJob)
router.delete("/delete",deleteExpiredJobs);

export default router