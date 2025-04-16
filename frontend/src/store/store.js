import { configureStore } from "@reduxjs/toolkit";
import jobReducer from "./slices/jobSlice";
import userReducer from "./slices/userSlice";
import applicationReducer from "./slices/applicationSlice";
import updateProfileReducer from "./slices/updateProfileSlice";
import interviewReducer from "./slices/interviewSlice";
import skillAssessmentReducer from "./slices/skillAssessmentsSlice" 
import adminSliceReducer from "./slices/adminSlice"// ✅ Import interview slice
import reportSliceReducer from "./slices/reportSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    jobs: jobReducer,
    applications: applicationReducer,
    updateProfile: updateProfileReducer,
    interviews: interviewReducer,
    skillAssessments:skillAssessmentReducer, 
    admin:adminSliceReducer ,
    report:reportSliceReducer
  },
});

export default store;
