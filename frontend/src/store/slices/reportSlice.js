// store/slices/reportSlice.js
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const reportSlice = createSlice({
  name: "report",
  initialState: {
    loading: false,
    report: null,
    error: null,
    message: null,
    reports:[]
  },
  reducers: {
    reportRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    reportSuccess(state, action) {
      state.loading = false;
      state.report = action.payload.report;
      state.message = action.payload.message;
      state.error = null;
    },
    reportFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    getReportsSuccess(state, action) {
      state.loading = false;
      state.reports = action.payload.reports;
      state.message = action.payload.message;
      state.error = null;
    },
    updateReportSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
      state.error = null;
    },

    clearReportErrors(state) {
      state.error = null;
    },
    clearMessage(state) {
      state.message = null;
    },
    resetReportState(state) {
      state.loading = false;
      state.report = null;
      state.reports=[]
      state.message = null;
      state.error = null;
    },
  },
});

export const { reportRequest, reportSuccess, reportFailed, clearReportErrors,getReportsSuccess,updateReportSuccess,resetReportState,clearMessage } = reportSlice.actions;

export const submitReport = ({ jobId, reason }) => async (dispatch) => {
  dispatch(reportRequest());
  try {
    const { data } = await axios.post(
      `https://job-portal-aq95.onrender.com/api/v1/report/${jobId}`,
      { reason },
      { withCredentials: true }
    );
    dispatch(reportSuccess({ report: data.report, message: data.message }));
  } catch (error) {
    dispatch(
      reportFailed(
        error.response?.data?.message || "Failed to submit the report."
      )
    );
  }
};

export const getAllReports = () => async (dispatch) => {
  dispatch(reportRequest());
  try {
    const { data } = await axios.get("https://job-portal-aq95.onrender.com/api/v1/reports", {
      withCredentials: true,
    });
    dispatch(getReportsSuccess({ reports: data.reports, message: data.message }));
  } catch (error) {
    dispatch(reportFailed(error.response?.data?.message || "Failed to fetch reports"));
  }
};
export const updateReportStatus = (reportId, status) => async (dispatch) => {
  dispatch(reportRequest());
  try {
    const { data } = await axios.put(
      `https://job-portal-aq95.onrender.com/api/v1/reports/${reportId}`,
      { status },
      { withCredentials: true }
    );
    dispatch(updateReportSuccess(data.message));
  } catch (error) {
    dispatch(reportFailed(error.response?.data?.message || "Failed to update report status"));
  }
};
export default reportSlice.reducer;
