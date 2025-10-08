import { createSlice, createSelector } from '@reduxjs/toolkit';
import { APPOINTMENT_STATUS } from '../../utils/constants';

const initialState = {
  appointments: [],
  selectedAppointment: null,
  loading: false,
  error: null,
  filters: {
    status: '',
    doctorId: '',
    patientId: '',
    date: '',
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setAppointmentsLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAppointmentsError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setAppointments: (state, action) => {
      state.appointments = action.payload;
      state.loading = false;
      state.error = null;
    },
    addAppointment: (state, action) => {
      state.appointments.unshift(action.payload);
    },
    updateAppointment: (state, action) => {
      const index = state.appointments.findIndex(a => a._id === action.payload._id);
      if (index !== -1) {
        state.appointments[index] = action.payload;
      }
      if (state.selectedAppointment?._id === action.payload._id) {
        state.selectedAppointment = action.payload;
      }
    },
    removeAppointment: (state, action) => {
      state.appointments = state.appointments.filter(a => a._id !== action.payload);
      if (state.selectedAppointment?._id === action.payload) {
        state.selectedAppointment = null;
      }
    },
    setSelectedAppointment: (state, action) => {
      state.selectedAppointment = action.payload;
    },
    setAppointmentFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setAppointmentPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    updateAppointmentStatus: (state, action) => {
      const { appointmentId, status } = action.payload;
      const appointment = state.appointments.find(a => a._id === appointmentId);
      if (appointment) {
        appointment.status = status;
      }
      if (state.selectedAppointment?._id === appointmentId) {
        state.selectedAppointment.status = status;
      }
    },
    clearAppointmentsError: (state) => {
      state.error = null;
    },
    resetAppointmentsState: () => initialState,
  },
});

export const {
  setAppointmentsLoading,
  setAppointmentsError,
  setAppointments,
  addAppointment,
  updateAppointment,
  removeAppointment,
  setSelectedAppointment,
  setAppointmentFilters,
  setAppointmentPagination,
  updateAppointmentStatus,
  clearAppointmentsError,
  resetAppointmentsState,
} = appointmentsSlice.actions;

// Basic selectors
export const selectAppointments = (state) => state.appointments.appointments;
export const selectSelectedAppointment = (state) => state.appointments.selectedAppointment;
export const selectAppointmentsLoading = (state) => state.appointments.loading;
export const selectAppointmentsError = (state) => state.appointments.error;
export const selectAppointmentFilters = (state) => state.appointments.filters;
export const selectAppointmentPagination = (state) => state.appointments.pagination;

// Memoized selectors
export const selectFilteredAppointments = createSelector(
  [selectAppointments, selectAppointmentFilters],
  (appointments, filters) => {
    return appointments.filter(appointment => {
      const matchesStatus = !filters.status || appointment.status === filters.status;
      const matchesDoctor = !filters.doctorId || appointment.doctorId === filters.doctorId;
      const matchesPatient = !filters.patientId || appointment.patientId === filters.patientId;
      const matchesDate = !filters.date || appointment.date === filters.date;
      
      return matchesStatus && matchesDoctor && matchesPatient && matchesDate;
    });
  }
);

export const selectTodaysAppointments = createSelector(
  [selectAppointments],
  (appointments) => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(appointment => 
      appointment.date === today
    );
  }
);

export const selectUpcomingAppointments = createSelector(
  [selectAppointments],
  (appointments) => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(appointment => 
      appointment.date >= today && appointment.status === APPOINTMENT_STATUS.BOOKED
    );
  }
);

export const selectAppointmentsByStatus = createSelector(
  [selectAppointments],
  (appointments) => {
    return appointments.reduce((acc, appointment) => {
      if (!acc[appointment.status]) {
        acc[appointment.status] = [];
      }
      acc[appointment.status].push(appointment);
      return acc;
    }, {});
  }
);

export default appointmentsSlice.reducer;