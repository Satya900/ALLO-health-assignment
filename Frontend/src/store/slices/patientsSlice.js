import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  patients: [],
  selectedPatient: null,
  loading: false,
  error: null,
  searchQuery: '',
  filters: {
    gender: '',
    ageRange: '',
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

const patientsSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    setPatientsLoading: (state, action) => {
      state.loading = action.payload;
    },
    setPatientsError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setPatients: (state, action) => {
      state.patients = action.payload;
      state.loading = false;
      state.error = null;
    },
    addPatient: (state, action) => {
      state.patients.unshift(action.payload);
    },
    updatePatient: (state, action) => {
      const index = state.patients.findIndex(p => p._id === action.payload._id);
      if (index !== -1) {
        state.patients[index] = action.payload;
      }
      if (state.selectedPatient?._id === action.payload._id) {
        state.selectedPatient = action.payload;
      }
    },
    removePatient: (state, action) => {
      state.patients = state.patients.filter(p => p._id !== action.payload);
      if (state.selectedPatient?._id === action.payload) {
        state.selectedPatient = null;
      }
    },
    setSelectedPatient: (state, action) => {
      state.selectedPatient = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearPatientsError: (state) => {
      state.error = null;
    },
    resetPatientsState: () => initialState,
  },
});

export const {
  setPatientsLoading,
  setPatientsError,
  setPatients,
  addPatient,
  updatePatient,
  removePatient,
  setSelectedPatient,
  setSearchQuery,
  setFilters,
  setPagination,
  clearPatientsError,
  resetPatientsState,
} = patientsSlice.actions;

// Basic selectors
export const selectPatients = (state) => state.patients.patients;
export const selectSelectedPatient = (state) => state.patients.selectedPatient;
export const selectPatientsLoading = (state) => state.patients.loading;
export const selectPatientsError = (state) => state.patients.error;
export const selectPatientsSearchQuery = (state) => state.patients.searchQuery;
export const selectPatientsFilters = (state) => state.patients.filters;
export const selectPatientsPagination = (state) => state.patients.pagination;

// Memoized selectors
export const selectFilteredPatients = createSelector(
  [selectPatients, selectPatientsSearchQuery, selectPatientsFilters],
  (patients, searchQuery, filters) => {
    return patients.filter(patient => {
      const matchesSearch = !searchQuery || 
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.phone.includes(searchQuery);
      
      const matchesGender = !filters.gender || patient.gender === filters.gender;
      
      const matchesAge = !filters.ageRange || (() => {
        const age = patient.age;
        switch (filters.ageRange) {
          case 'child': return age < 18;
          case 'adult': return age >= 18 && age < 65;
          case 'senior': return age >= 65;
          default: return true;
        }
      })();
      
      return matchesSearch && matchesGender && matchesAge;
    });
  }
);

export default patientsSlice.reducer;