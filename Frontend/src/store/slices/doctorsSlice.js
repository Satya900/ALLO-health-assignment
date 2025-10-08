import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  doctors: [],
  selectedDoctor: null,
  loading: false,
  error: null,
  filters: {
    specialization: '',
    location: '',
    isActive: null,
  },
};

const doctorsSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    setDoctorsLoading: (state, action) => {
      state.loading = action.payload;
    },
    setDoctorsError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setDoctors: (state, action) => {
      state.doctors = action.payload;
      state.loading = false;
      state.error = null;
    },
    addDoctor: (state, action) => {
      state.doctors.push(action.payload);
    },
    updateDoctor: (state, action) => {
      const index = state.doctors.findIndex(d => d._id === action.payload._id);
      if (index !== -1) {
        state.doctors[index] = action.payload;
      }
      if (state.selectedDoctor?._id === action.payload._id) {
        state.selectedDoctor = action.payload;
      }
    },
    removeDoctor: (state, action) => {
      state.doctors = state.doctors.filter(d => d._id !== action.payload);
      if (state.selectedDoctor?._id === action.payload) {
        state.selectedDoctor = null;
      }
    },
    setSelectedDoctor: (state, action) => {
      state.selectedDoctor = action.payload;
    },
    setDoctorFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    updateDoctorAvailability: (state, action) => {
      const { doctorId, availability } = action.payload;
      const doctor = state.doctors.find(d => d._id === doctorId);
      if (doctor) {
        doctor.availability = availability;
      }
      if (state.selectedDoctor?._id === doctorId) {
        state.selectedDoctor.availability = availability;
      }
    },
    clearDoctorsError: (state) => {
      state.error = null;
    },
    resetDoctorsState: () => initialState,
  },
});

export const {
  setDoctorsLoading,
  setDoctorsError,
  setDoctors,
  addDoctor,
  updateDoctor,
  removeDoctor,
  setSelectedDoctor,
  setDoctorFilters,
  updateDoctorAvailability,
  clearDoctorsError,
  resetDoctorsState,
} = doctorsSlice.actions;

// Basic selectors
export const selectDoctors = (state) => state.doctors.doctors;
export const selectSelectedDoctor = (state) => state.doctors.selectedDoctor;
export const selectDoctorsLoading = (state) => state.doctors.loading;
export const selectDoctorsError = (state) => state.doctors.error;
export const selectDoctorFilters = (state) => state.doctors.filters;

// Memoized selectors
export const selectFilteredDoctors = createSelector(
  [selectDoctors, selectDoctorFilters],
  (doctors, filters) => {
    return doctors.filter(doctor => {
      const matchesSpecialization = !filters.specialization || 
        doctor.specialization === filters.specialization;
      
      const matchesLocation = !filters.location || 
        doctor.location === filters.location;
      
      const matchesActive = filters.isActive === null || 
        doctor.isActive === filters.isActive;
      
      return matchesSpecialization && matchesLocation && matchesActive;
    });
  }
);

export const selectActiveDoctors = createSelector(
  [selectDoctors],
  (doctors) => {
    return doctors.filter(doctor => doctor.isActive);
  }
);

export const selectDoctorsBySpecialization = createSelector(
  [selectDoctors],
  (doctors) => {
    return doctors.reduce((acc, doctor) => {
      if (!acc[doctor.specialization]) {
        acc[doctor.specialization] = [];
      }
      acc[doctor.specialization].push(doctor);
      return acc;
    }, {});
  }
);

export default doctorsSlice.reducer;