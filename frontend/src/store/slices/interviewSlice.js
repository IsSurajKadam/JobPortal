// interviewSlice.js
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const interviewSlice = createSlice({
  name: "interviews",
  initialState: {
    interviews: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    requestStart(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    requestSuccess(state, action) {
      state.loading = false;
      state.interviews = action.payload;
    },
    requestFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    successMessage(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    clearErrors(state) {
      state.error = null;
    },
    resetInterviewSlice(state) {
      state.loading = false;
      state.error = null;
      state.message = null;
      state.interviews = [];
    },
    updateInterviewStatusInRedux(state, action) {
      const { id, status } = action.payload;
      state.interviews = state.interviews.map((interview) =>
        interview._id === id ? { ...interview, status } : interview
      );
    },
    deleteInterviewInRedux(state, action) {
      state.interviews = state.interviews.filter(
        (interview) => interview._id !== action.payload
      );
    },
  },
});

// 📅 Schedule Interview (Employer only)
export const scheduleInterview = (applicationId, jobId, candidateId, data) => async (dispatch) => {
  dispatch(interviewSlice.actions.requestStart());
  try {
    const response = await axios.post(
      `http://localhost:8000/api/v1/interview/schedule/${applicationId}/${jobId}/${candidateId}`,
      data,
      { withCredentials: true }
    );

    dispatch(interviewSlice.actions.successMessage(response.data.message));
  } catch (error) {
    dispatch(
      interviewSlice.actions.requestFailure(
        error.response?.data?.message || "Failed to schedule interview"
      )
    );
  }
};

// 📅 Fetch All Interviews for Specific User (Employer or Job Seeker)
export const fetchUserInterviews = (userId) => async (dispatch) => {
  dispatch(interviewSlice.actions.requestStart());
  try {
    const response = await axios.get(
      `http://localhost:8000/api/v1/interview/myInterviews/${userId}`,
      { withCredentials: true }
    );
    dispatch(interviewSlice.actions.requestSuccess(response.data.interviews));
  } catch (error) {
    dispatch(
      interviewSlice.actions.requestFailure(
        error.response?.data?.message || "Failed to fetch user interviews"
      )
    );
  }
};

// ✅ Update Interview Status (Employer only)
export const updateInterviewStatus = (id, status) => async (dispatch) => {
  dispatch(interviewSlice.actions.requestStart());

  try {
    const response = await axios.post(
      `http://localhost:8000/api/v1/interview/status/${id}`,
      { status },
      { withCredentials: true }
    );

    // ✅ Update Redux only after successful API call
    dispatch(interviewSlice.actions.updateInterviewStatusInRedux({ id, status }));
    dispatch(interviewSlice.actions.successMessage(response.data.message));
  } catch (error) {
    dispatch(
      interviewSlice.actions.requestFailure(
        error.response?.data?.message || "Failed to update interview status"
      )
    );
  }
};

// 🗑️ Delete Interview (Employer only)
export const deleteInterview = (id) => async (dispatch) => {
  dispatch(interviewSlice.actions.requestStart());
  try {
    await axios.delete(
      `http://localhost:8000/api/v1/interview/delete/${id}`,
      { withCredentials: true }
    );

    dispatch(interviewSlice.actions.deleteInterviewInRedux(id));
    dispatch(interviewSlice.actions.successMessage("Interview deleted successfully."));
  } catch (error) {
    dispatch(
      interviewSlice.actions.requestFailure(
        error.response?.data?.message || "Failed to delete interview"
      )
    );
  }
};

export const clearInterviewErrors = () => (dispatch) => {
  dispatch(interviewSlice.actions.clearErrors());
};

export const resetInterviewSlice = () => (dispatch) => {
  dispatch(interviewSlice.actions.resetInterviewSlice());
};

export default interviewSlice.reducer;
