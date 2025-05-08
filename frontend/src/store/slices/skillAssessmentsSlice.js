import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const skillAssessmentSlice = createSlice({
  name: "skillAssessments",
  initialState: {
    skillAssessments: [],
    singleSkillAssessment: {},
    submissionResult: null,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    requestForAllSkillAssessments(state) {
      state.loading = true;
      state.error = null;
    },
    successForAllSkillAssessments(state, action) {
      state.loading = false;
      state.skillAssessments = action.payload;
    },
    failureForAllSkillAssessments(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    requestForSingleSkillAssessment(state) {
      state.loading = true;
      state.error = null;
    },
    successForSingleSkillAssessment(state, action) {
      state.loading = false;
      state.singleSkillAssessment = action.payload;
    },
    failureForSingleSkillAssessment(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    requestForSubmitSkillAssessment(state) {
      state.loading = true;
      state.error = null;
    },
    successForSubmitSkillAssessment(state, action) {
      state.loading = false;
      state.submissionResult = action.payload;
    },
    failureForSubmitSkillAssessment(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    requestForPostSkillAssessment(state) {
      state.loading = true;
      state.error = null;
    },
    successForPostSkillAssessment(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    failureForPostSkillAssessment(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    requestForDeleteSkillAssessment(state) {
      state.loading = true;
      state.error = null;
    },
    successForDeleteSkillAssessment(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    failureForDeleteSkillAssessment(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearAllErrors(state) {
      state.error = null;
    },
    resetSkillAssessmentSlice(state) {
      state.loading = false;
      state.error = null;
      state.message = null;
      state.submissionResult = null;
      state.skillAssessments = [];
      state.singleSkillAssessment = {};
    },
  },
});

// **Thunks**
export const fetchSkillAssessments = () => async (dispatch) => {
  try {
    dispatch(skillAssessmentSlice.actions.requestForAllSkillAssessments());
    const response = await axios.get("http://localhost:8000/api/v1/skill-assessments/", { withCredentials: true });
    dispatch(skillAssessmentSlice.actions.successForAllSkillAssessments(response.data.skillAssessments));
  } catch (error) {
    dispatch(skillAssessmentSlice.actions.failureForAllSkillAssessments(error.response.data.message));
  }
};

export const fetchSingleSkillAssessment = (id) => async (dispatch) => {
  dispatch(skillAssessmentSlice.actions.requestForSingleSkillAssessment());
  try {
    const response = await axios.get(`http://localhost:8000/api/v1/skill-assessment/${id}`, { withCredentials: true });
    dispatch(skillAssessmentSlice.actions.successForSingleSkillAssessment(response.data.skillAssessment));
  } catch (error) {
    dispatch(skillAssessmentSlice.actions.failureForSingleSkillAssessment(error.response.data.message));
  }
};

export const submitSkillAssessment = (data) => async (dispatch) => {
  dispatch(skillAssessmentSlice.actions.requestForSubmitSkillAssessment());
  try {
    const response = await axios.post("http://localhost:8000/api/v1/skill-assessment/submit", data, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    dispatch(skillAssessmentSlice.actions.successForSubmitSkillAssessment(response.data));
  } catch (error) {
    dispatch(skillAssessmentSlice.actions.failureForSubmitSkillAssessment(error.response.data.message));
  }
};

export const postSkillAssessment = (data) => async (dispatch) => {
  dispatch(skillAssessmentSlice.actions.requestForPostSkillAssessment());
  try {
    const response = await axios.post("http://localhost:8000/api/v1/skill-assessments/register", data, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    dispatch(skillAssessmentSlice.actions.successForPostSkillAssessment(response.data.message));
  } catch (error) {
    dispatch(skillAssessmentSlice.actions.failureForPostSkillAssessment(error.response.data.message));
  }
};

export const deleteSkillAssessment = (id) => async (dispatch) => {
  dispatch(skillAssessmentSlice.actions.requestForDeleteSkillAssessment());
  try {
    const response = await axios.delete(`http://localhost:8000/api/v1/skill-assessment/delete/${id}`, { withCredentials: true });
    dispatch(skillAssessmentSlice.actions.successForDeleteSkillAssessment(response.data.message));
  } catch (error) {
    dispatch(skillAssessmentSlice.actions.failureForDeleteSkillAssessment(error.response.data.message));
  }
};

export const clearAllSkillAssessmentErrors = () => (dispatch) => {
  dispatch(skillAssessmentSlice.actions.clearAllErrors());
};

export const resetSkillAssessmentSlice = () => (dispatch) => {
  dispatch(skillAssessmentSlice.actions.resetSkillAssessmentSlice());
};

export default skillAssessmentSlice.reducer;
