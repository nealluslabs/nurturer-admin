import { createSlice } from '@reduxjs/toolkit';

const cronlogsSlice = createSlice({
  name: 'cronlogs',
  initialState: {
    cronlogs: [],
    currentLogDetails: [],
    loading: false,
    error: null,
    currentLogId: null
  },
  reducers: {
    fetchCronLogsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCronLogsSuccess: (state, action) => {
      state.loading = false;
      state.cronlogs = action.payload;
      state.error = null;
    },
    fetchCronLogsError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.cronlogs = [];
    },
    fetchCronLogDetailsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCronLogDetailsSuccess: (state, action) => {
      state.loading = false;
      state.currentLogDetails = action.payload.contacts;
      state.currentLogId = action.payload.logId;
      state.error = null;
    },
    fetchCronLogDetailsError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.currentLogDetails = [];
    },
    clearCronLogDetails: (state) => {
      state.currentLogDetails = [];
      state.currentLogId = null;
      state.error = null;
    }
  }
});

export const {
  fetchCronLogsStart,
  fetchCronLogsSuccess,
  fetchCronLogsError,
  fetchCronLogDetailsStart,
  fetchCronLogDetailsSuccess,
  fetchCronLogDetailsError,
  clearCronLogDetails
} = cronlogsSlice.actions;

export default cronlogsSlice.reducer;