import { createSlice } from '@reduxjs/toolkit';

const contactsSlice = createSlice({
  name: 'contacts',
  initialState: {
    employeeContacts: [],
    loading: false,
    error: null,
    currentContacterId: null
  },
  reducers: {
    fetchEmployeeContactsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchEmployeeContactsSuccess: (state, action) => {
      state.loading = false;
      state.employeeContacts = action.payload.contacts;
      state.currentContacterId = action.payload.contacterId;
      state.error = null;
    },
    fetchEmployeeContactsError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.employeeContacts = [];
    },
    clearEmployeeContacts: (state) => {
      state.employeeContacts = [];
      state.currentContacterId = null;
      state.error = null;
    }
  }
});

export const {
  fetchEmployeeContactsStart,
  fetchEmployeeContactsSuccess,
  fetchEmployeeContactsError,
  clearEmployeeContacts
} = contactsSlice.actions;

export default contactsSlice.reducer;