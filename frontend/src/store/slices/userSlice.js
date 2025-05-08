import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    isAuthenticated: false,
    user: {},
    savedJobs: [],
    error: null,
    message: null,
  },
  reducers: {
    registerRequest(state) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
      state.message = null;
    },
    registerSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.error = null;
      state.message = action.payload.message;
    },
    registerFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = action.payload;
      state.message = null;
    },
    loginRequest(state) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
      state.message = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.savedJobs = action.payload.user.savedJobs || [];
      state.error = null;
      state.message = action.payload.message;
    },
    loginFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = action.payload;
      state.message = null;
    },
    fetchUserRequest(state) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
    },
    fetchUserSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.savedJobs = action.payload.savedJobs || [];
      state.error = null;
    },
    fetchUserFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = action.payload;
    },
    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.user = {};
      state.savedJobs = [];
      state.error = null;
    },
    logoutFailed(state, action) {
      state.error = action.payload;
    },
    saveJobSuccess(state, action) {
      state.savedJobs.push(action.payload);
    },
    unsaveJobSuccess(state, action) {
      state.savedJobs = state.savedJobs.filter((id) => id !== action.payload);
    },
    saveJobFailed(state, action) {
      state.error = action.payload;
    },
    unsaveJobFailed(state, action) {
      state.error = action.payload;
    },
    getSavedJobsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    getSavedJobsSuccess(state, action) {
      state.loading = false;
      state.savedJobs = action.payload;
      state.error = null;
    },
    getSavedJobsFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearAllErrors(state) {
      state.error = null;
    },
  },
});

export const getSavedJobs = () => async (dispatch) => {
  dispatch(userSlice.actions.getSavedJobsRequest());
  try {
    const response = await axios.get("http://localhost:8000/api/v1/user/saved-jobs", {
      withCredentials: true,
    });
    dispatch(userSlice.actions.getSavedJobsSuccess(response.data.savedJobs));
  } catch (error) {
    dispatch(userSlice.actions.getSavedJobsFailed(error.response.data.message));
  }
};

export const saveJob = (jobId) => async (dispatch) => {
  try {
    const response = await axios.post(
      `http://localhost:8000/api/v1/user/save-job/${jobId}`,
      {},
      { withCredentials: true }
    );
    dispatch(userSlice.actions.saveJobSuccess(jobId));
  } catch (error) {
    dispatch(userSlice.actions.saveJobFailed(error.response.data.message));
  }
};

export const unsaveJob = (jobId) => async (dispatch) => {
  try {
    const response = await axios.delete(
      `http://localhost:8000/api/v1/user/unsave-job/${jobId}`,
      { withCredentials: true }
    );
    dispatch(userSlice.actions.unsaveJobSuccess(jobId));
  } catch (error) {
    dispatch(userSlice.actions.unsaveJobFailed(error.response.data.message));
  }
};

export const register = (data) => async (dispatch) => {
  dispatch(userSlice.actions.registerRequest());
  try {
    const response = await axios.post(
      "http://localhost:8000/api/v1/user/register",
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    dispatch(userSlice.actions.registerSuccess(response.data));
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.registerFailed(error.response.data.message));
  }
};

export const login = (data) => async (dispatch) => {
  dispatch(userSlice.actions.loginRequest());
  try {
    const response = await axios.post(
      "http://localhost:8000/api/v1/user/login",
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    dispatch(userSlice.actions.loginSuccess(response.data));
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.loginFailed(error.response.data.message));
  }
};

export const getUser = () => async (dispatch) => {
  dispatch(userSlice.actions.fetchUserRequest());
  try {
    const response = await axios.get("http://localhost:8000/api/v1/user/me", {
      withCredentials: true,
    });
    dispatch(userSlice.actions.fetchUserSuccess(response.data.user));
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.fetchUserFailed(error.response.data.message));
  }
};

export const logout = () => async (dispatch) => {
  try {
    await axios.get("http://localhost:8000/api/v1/user/logout", {
      withCredentials: true,
    });
    dispatch(userSlice.actions.logoutSuccess());
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.logoutFailed(error.response.data.message));
  }
};

export const clearAllUserErrors = () => (dispatch) => {
  dispatch(userSlice.actions.clearAllErrors());
};

export default userSlice.reducer;
