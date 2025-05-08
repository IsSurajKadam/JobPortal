import express from 'express'
import { getUser, login, logout, register, updatePassword, updateProfile ,saveJob,unsaveJob,getSavedJobs} from '../controllers/userController.js'
import { isAuthenticated } from '../middleware/auth.js';
const router=express.Router()
router.post("/save-job/:jobId", isAuthenticated, saveJob);
router.delete("/unsave-job/:jobId", isAuthenticated, unsaveJob);
router.get("/saved-jobs",isAuthenticated,getSavedJobs)
router.post("/register",register);
router.post("/login",login);
router.get("/logout",isAuthenticated,logout)
router.get("/me",isAuthenticated,getUser)
router.put("/update/profile",isAuthenticated,updateProfile)
router.put("/update/password",isAuthenticated,updatePassword)



export default router