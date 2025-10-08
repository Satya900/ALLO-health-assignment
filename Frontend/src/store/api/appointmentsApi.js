import { baseApi } from './baseApi';
import {
  setAppointments,
  addAppointment,
  updateAppointment as updateAppointmentInStore,
  removeAppointment,
  setAppointmentsLoading,
  setAppointmentsError,
  setAppointmentPagination,
  updateAppointmentStatus as updateAppointmentStatusInStore,
} from '../slices/appointmentsSlice';

// Appointments API endpoints
export const appointmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all appointments with filtering and pagination
    getAppointments: builder.query({
      query: ({ 
        page = 1, 
        limit = 10, 
        status = '', 
        doctorId = '', 
        patientId = '', 
        date = '',
        startDate = '',
        endDate = ''
      } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        
        if (status) params.append('status', status);
        if (doctorId) params.append('doctorId', doctorId);
        if (patientId) params.append('patientId', patientId);
        if (date) params.append('date', date);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        
        return `/appointments?${params.toString()}`;
      },
      providesTags: (result) => {
        // Handle both array response (old format) and object response (new format)
        const appointments = Array.isArray(result) ? result : (result?.appointments || []);
        return appointments.length > 0
          ? [
              ...appointments.map(({ _id }) => ({ type: 'Appointment', id: _id })),
              { type: 'Appointment', id: 'LIST' },
            ]
          : [{ type: 'Appointment', id: 'LIST' }];
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        dispatch(setAppointmentsLoading(true));
        try {
          const { data } = await queryFulfilled;
          // Handle both array response (old format) and object response (new format)
          const appointments = Array.isArray(data) ? data : (data.appointments || []);
          dispatch(setAppointments(appointments));
          
          if (!Array.isArray(data)) {
            dispatch(setAppointmentPagination({
              page: data.page || 1,
              limit: data.limit || 10,
              total: data.total || 0,
              totalPages: data.totalPages || 0,
            }));
          }
        } catch (error) {
          dispatch(setAppointmentsError(error.error?.data?.message || 'Failed to fetch appointments'));
        }
      },
    }),

    // Get single appointment by ID
    getAppointment: builder.query({
      query: (id) => `/appointments/${id}`,
      providesTags: (result, error, id) => [{ type: 'Appointment', id }],
    }),

    // Create new appointment
    createAppointment: builder.mutation({
      query: (appointmentData) => ({
        url: '/appointments',
        method: 'POST',
        body: appointmentData,
      }),
      invalidatesTags: [
        { type: 'Appointment', id: 'LIST' },
        { type: 'Doctor', id: 'LIST' }, // Invalidate doctor availability
      ],
      async onQueryStarted(appointmentData, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(addAppointment(data.appointment));
        } catch (error) {
          // Error handling is done by the component
        }
      },
    }),

    // Update existing appointment
    updateAppointment: builder.mutation({
      query: ({ id, ...appointmentData }) => ({
        url: `/appointments/${id}`,
        method: 'PUT',
        body: appointmentData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Appointment', id },
        { type: 'Appointment', id: 'LIST' },
        { type: 'Doctor', id: 'LIST' }, // Invalidate doctor availability
      ],
      async onQueryStarted({ id, ...appointmentData }, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          appointmentsApi.util.updateQueryData('getAppointments', undefined, (draft) => {
            const appointment = draft.appointments?.find((a) => a._id === id);
            if (appointment) {
              Object.assign(appointment, appointmentData);
            }
          })
        );
        
        try {
          const { data } = await queryFulfilled;
          dispatch(updateAppointmentInStore(data.appointment));
        } catch (error) {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
    }),

    // Cancel appointment
    cancelAppointment: builder.mutation({
      query: ({ id, reason = '' }) => ({
        url: `/appointments/${id}/cancel`,
        method: 'PUT',
        body: { reason },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Appointment', id },
        { type: 'Appointment', id: 'LIST' },
        { type: 'Doctor', id: 'LIST' },
      ],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          appointmentsApi.util.updateQueryData('getAppointments', undefined, (draft) => {
            const appointment = draft.appointments?.find((a) => a._id === id);
            if (appointment) {
              appointment.status = 'Canceled';
            }
          })
        );
        
        try {
          const { data } = await queryFulfilled;
          dispatch(updateAppointmentInStore(data.appointment));
        } catch (error) {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
    }),

    // Complete appointment
    completeAppointment: builder.mutation({
      query: ({ id, notes = '' }) => ({
        url: `/appointments/${id}/complete`,
        method: 'PUT',
        body: { notes },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Appointment', id },
        { type: 'Appointment', id: 'LIST' },
      ],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          appointmentsApi.util.updateQueryData('getAppointments', undefined, (draft) => {
            const appointment = draft.appointments?.find((a) => a._id === id);
            if (appointment) {
              appointment.status = 'Completed';
            }
          })
        );
        
        try {
          const { data } = await queryFulfilled;
          dispatch(updateAppointmentInStore(data.appointment));
        } catch (error) {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
    }),

    // Delete appointment
    deleteAppointment: builder.mutation({
      query: (id) => ({
        url: `/appointments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Appointment', id },
        { type: 'Appointment', id: 'LIST' },
        { type: 'Doctor', id: 'LIST' },
      ],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          appointmentsApi.util.updateQueryData('getAppointments', undefined, (draft) => {
            if (draft.appointments) {
              draft.appointments = draft.appointments.filter((a) => a._id !== id);
            }
          })
        );
        
        try {
          await queryFulfilled;
          dispatch(removeAppointment(id));
        } catch (error) {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
    }),

    // Get appointments by date range
    getAppointmentsByDateRange: builder.query({
      query: ({ startDate, endDate, doctorId = '', status = '' }) => {
        const params = new URLSearchParams({
          startDate,
          endDate,
        });
        
        if (doctorId) params.append('doctorId', doctorId);
        if (status) params.append('status', status);
        
        return `/appointments/date-range?${params.toString()}`;
      },
      providesTags: [{ type: 'Appointment', id: 'DATE_RANGE' }],
    }),

    // Get today's appointments
    getTodaysAppointments: builder.query({
      query: (doctorId = '') => {
        const today = new Date().toISOString().split('T')[0];
        const params = new URLSearchParams({ date: today });
        
        if (doctorId) params.append('doctorId', doctorId);
        
        return `/appointments/today?${params.toString()}`;
      },
      providesTags: [{ type: 'Appointment', id: 'TODAY' }],
    }),

    // Get upcoming appointments
    getUpcomingAppointments: builder.query({
      query: ({ limit = 10, doctorId = '', patientId = '' } = {}) => {
        const params = new URLSearchParams({ limit: limit.toString() });
        
        if (doctorId) params.append('doctorId', doctorId);
        if (patientId) params.append('patientId', patientId);
        
        return `/appointments/upcoming?${params.toString()}`;
      },
      providesTags: [{ type: 'Appointment', id: 'UPCOMING' }],
    }),

    // Check appointment conflicts
    checkAppointmentConflict: builder.query({
      query: ({ doctorId, date, time, excludeId = '' }) => {
        const params = new URLSearchParams({
          doctorId,
          date,
          time,
        });
        
        if (excludeId) params.append('excludeId', excludeId);
        
        return `/appointments/check-conflict?${params.toString()}`;
      },
    }),

    // Get available time slots for booking
    getAvailableSlots: builder.query({
      query: ({ doctorId, date }) => `/appointments/available-slots?doctorId=${doctorId}&date=${date}`,
      providesTags: (result, error, { doctorId, date }) => [
        { type: 'Appointment', id: `SLOTS-${doctorId}-${date}` },
      ],
    }),

    // Reschedule appointment
    rescheduleAppointment: builder.mutation({
      query: ({ id, newDate, newTime, reason = '' }) => ({
        url: `/appointments/${id}/reschedule`,
        method: 'PUT',
        body: { newDate, newTime, reason },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Appointment', id },
        { type: 'Appointment', id: 'LIST' },
        { type: 'Doctor', id: 'LIST' },
      ],
    }),

    // Get appointment statistics
    getAppointmentStats: builder.query({
      query: ({ startDate = '', endDate = '', doctorId = '' } = {}) => {
        const params = new URLSearchParams();
        
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (doctorId) params.append('doctorId', doctorId);
        
        return `/appointments/stats?${params.toString()}`;
      },
      providesTags: [{ type: 'Appointment', id: 'STATS' }],
    }),

    // Bulk operations
    bulkUpdateAppointments: builder.mutation({
      query: ({ appointmentIds, updateData }) => ({
        url: '/appointments/bulk-update',
        method: 'PUT',
        body: { appointmentIds, updateData },
      }),
      invalidatesTags: [{ type: 'Appointment', id: 'LIST' }],
    }),

    bulkCancelAppointments: builder.mutation({
      query: ({ appointmentIds, reason = '' }) => ({
        url: '/appointments/bulk-cancel',
        method: 'PUT',
        body: { appointmentIds, reason },
      }),
      invalidatesTags: [{ type: 'Appointment', id: 'LIST' }],
    }),

    // Export appointments data
    exportAppointments: builder.mutation({
      query: (filters = {}) => ({
        url: '/appointments/export',
        method: 'POST',
        body: filters,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Send appointment reminders
    sendAppointmentReminders: builder.mutation({
      query: ({ appointmentIds, type = 'email' }) => ({
        url: '/appointments/send-reminders',
        method: 'POST',
        body: { appointmentIds, type },
      }),
    }),
  }),
});

// Export hooks for components to use
export const {
  useGetAppointmentsQuery,
  useGetAppointmentQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useCancelAppointmentMutation,
  useCompleteAppointmentMutation,
  useDeleteAppointmentMutation,
  useGetAppointmentsByDateRangeQuery,
  useGetTodaysAppointmentsQuery,
  useGetUpcomingAppointmentsQuery,
  useCheckAppointmentConflictQuery,
  useGetAvailableSlotsQuery,
  useRescheduleAppointmentMutation,
  useGetAppointmentStatsQuery,
  useBulkUpdateAppointmentsMutation,
  useBulkCancelAppointmentsMutation,
  useExportAppointmentsMutation,
  useSendAppointmentRemindersMutation,
  useLazyGetAppointmentsQuery,
  useLazyCheckAppointmentConflictQuery,
  useLazyGetAvailableSlotsQuery,
} = appointmentsApi;

// Export endpoints for direct access if needed
export const {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  completeAppointment,
  deleteAppointment,
  getAppointmentsByDateRange,
  getTodaysAppointments,
  getUpcomingAppointments,
  checkAppointmentConflict,
  getAvailableSlots,
  rescheduleAppointment,
  getAppointmentStats,
  bulkUpdateAppointments,
  bulkCancelAppointments,
  exportAppointments,
  sendAppointmentReminders,
} = appointmentsApi.endpoints;