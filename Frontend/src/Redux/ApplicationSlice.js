import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
  name: "application",
  initialState: {
    applicants: {
      applications: []  // Match the expected structure
    }
  }, 
  reducers: {
    setAllApplicants: (state, action) => {
      state.applicants = {
        applications: action.payload.applications || []
      };
    },
    updateApplicantStatus: (state, action) => {
      const { applicationId, status, progress } = action.payload;
      const application = state.applicants.applications.find(
        app => app._id === applicationId
      );
      if (application) {
        application.status = status;
        if (progress) {
          application.progress = progress;
        }
      }
    },
  },
});

export const { setAllApplicants, updateApplicantStatus } = applicationSlice.actions;

export default applicationSlice.reducer;