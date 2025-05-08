import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    loading: false,
    users: [],
    blockedEmployers: [],
    employerJobs: [],
    error: null,
    message: null,
  },
  reducers: {
    requestStart(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    requestFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message=null
    },
    blockEmployerSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    unblockEmployerSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    getBlockedEmployersSuccess(state, action) {
      state.loading = false;
      state.blockedEmployers = action.payload;
    },
    getAllUsersSuccess(state, action) {
      state.loading = false;
      state.users = action.payload;
    },
    requestForEmployerJobs(state) {
      state.loading = true;
      state.employerJobs = [];
      state.error = null;
    },
    successForEmployerJobs(state, action) {
      console.log("success reducer:",action.payload)
      state.loading = false;
      state.employerJobs = action.payload;
      state.error = null;
    },
    failureForEmployerJobs(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearErrors(state) {
      state.error = null;
    },
    clearMessage(state)
    {
      state.message=null
    }

  },
});

export const { 
  requestStart, requestFailed, blockEmployerSuccess, unblockEmployerSuccess, requestForEmployerJobs,successForEmployerJobs,
  getBlockedEmployersSuccess, getAllUsersSuccess,   
   failureForEmployerJobs, clearErrors ,clearMessage
} = adminSlice.actions;

// **Block Employer**
export const blockEmployer = (employerId, durationInDays) => async (dispatch) => {
  dispatch(requestStart());
  try {
    const { data } = await axios.post(
      `http://localhost:8000/api/v1/admin/block-employer/${employerId}`,
      { durationInDays },
      { withCredentials: true }
    );
    dispatch(blockEmployerSuccess(data.message));
  } catch (error) {
    dispatch(requestFailed(error.response?.data?.message || "Failed to block employer"));
  }
};

// **Unblock Employer**
export const unblockEmployer = (employerId) => async (dispatch) => {
  dispatch(requestStart());
  try {
    const { data } = await axios.post(
      `http://localhost:8000/api/v1/admin/unblock-employer/${employerId}`,
      {},
      { withCredentials: true }
    );
    dispatch(unblockEmployerSuccess(data.message));
  } catch (error) {
    dispatch(requestFailed(error.response?.data?.message || "Failed to unblock employer"));
  }
};

// **Fetch Blocked Employers**
export const getBlockedEmployers = () => async (dispatch) => {
  dispatch(requestStart());
  try {
    const { data } = await axios.get("http://localhost:8000/api/v1/admin/blocked-employers", {
      withCredentials: true,
    });

    dispatch(getBlockedEmployersSuccess(data.blockedEmployers));
  } catch (error) {
    dispatch(requestFailed(error.response?.data?.message || "Failed to fetch blocked employers"));
  }
};

// **Fetch All Users**
export const getAllUsers = () => async (dispatch) => {
  dispatch(requestStart());
  try {
    const { data } = await axios.get("http://localhost:8000/api/v1/admin/users", {
      withCredentials: true,
    });
    dispatch(getAllUsersSuccess(data.users));
  } catch (error) {
    dispatch(requestFailed(error.response?.data?.message || "Failed to fetch users"));
  }
};

// **Fetch Employer Jobs**
export const getEmployerJobs = (employerId) => async (dispatch) => {
  dispatch(requestForEmployerJobs());
  try {

    const response = await axios.get(
      `http://localhost:8000/api/v1/admin/employer/${employerId}/jobs`,
      { withCredentials: true }
    );
    console.log("data: ",response.data)
    dispatch(successForEmployerJobs(response.data.myJobs));
  } catch (error) {
    dispatch(failureForEmployerJobs(error.response?.data?.message || "Failed to fetch employer jobs"));
  }
};

// **Clear Errors**
export const clearAdminErrors = () => (dispatch) => {
  dispatch(clearErrors());
};

export default adminSlice.reducer;
