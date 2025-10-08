import { baseApi } from './baseApi';
import {
  setDoctors,
  addDoctor,
  updateDoctor as updateDoctorInStore,
  removeDoctor,
  setDoctorsLoading,
  setDoctorsError,
  updateDoctorAvailability as updateDoctorAvailabilityInStore,
} from '../slices/doctorsSlice';

// Doctors API endpoints
export const doctorsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all doctors with filtering
    getDoctors: builder.query({
      query: ({ specialization = '', location = '', isActive = null } = {}) => {
        const params = new URLSearchParams();
        
        if (specialization) params.append('specialization', specialization);
        if (location) params.append('location', location);
        if (isActive !== null) params.append('isActive', isActive.toString());
        
        return `/doctors?${params.toString()}`;
      },
      providesTags: (result) => {
        // Handle both array response (old format) and object response (new format)
        const doctors = Array.isArray(result) ? result : (result?.doctors || []);
        return doctors.length > 0
          ? [
              ...doctors.map(({ _id }) => ({ type: 'Doctor', id: _id })),
              { type: 'Doctor', id: 'LIST' },
            ]
          : [{ type: 'Doctor', id: 'LIST' }];
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        dispatch(setDoctorsLoading(true));
        try {
          const { data } = await queryFulfilled;
          // Handle both array response (old format) and object response (new format)
          const doctors = Array.isArray(data) ? data : (data.doctors || []);
          dispatch(setDoctors(doctors));
        } catch (error) {
          dispatch(setDoctorsError(error.error?.data?.message || 'Failed to fetch doctors'));
        }
      },
    }),

    // Get single doctor by ID
    getDoctor: builder.query({
      query: (id) => `/doctors/${id}`,
      providesTags: (result, error, id) => [{ type: 'Doctor', id }],
    }),

    // Create new doctor
    createDoctor: builder.mutation({
      query: (doctorData) => ({
        url: '/doctors',
        method: 'POST',
        body: doctorData,
      }),
      invalidatesTags: [{ type: 'Doctor', id: 'LIST' }],
      async onQueryStarted(doctorData, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(addDoctor(data.doctor));
        } catch (error) {
          // Error handling is done by the component
        }
      },
    }),

    // Update existing doctor
    updateDoctor: builder.mutation({
      query: ({ id, ...doctorData }) => ({
        url: `/doctors/${id}`,
        method: 'PUT',
        body: doctorData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Doctor', id },
        { type: 'Doctor', id: 'LIST' },
      ],
      async onQueryStarted({ id, ...doctorData }, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          doctorsApi.util.updateQueryData('getDoctors', undefined, (draft) => {
            const doctor = draft.doctors?.find((d) => d._id === id);
            if (doctor) {
              Object.assign(doctor, doctorData);
            }
          })
        );
        
        try {
          const { data } = await queryFulfilled;
          dispatch(updateDoctorInStore(data.doctor));
        } catch (error) {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
    }),

    // Delete doctor
    deleteDoctor: builder.mutation({
      query: (id) => ({
        url: `/doctors/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Doctor', id },
        { type: 'Doctor', id: 'LIST' },
      ],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          doctorsApi.util.updateQueryData('getDoctors', undefined, (draft) => {
            if (draft.doctors) {
              draft.doctors = draft.doctors.filter((d) => d._id !== id);
            }
          })
        );
        
        try {
          await queryFulfilled;
          dispatch(removeDoctor(id));
        } catch (error) {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
    }),

    // Get doctor availability
    getDoctorAvailability: builder.query({
      query: (doctorId) => `/doctors/${doctorId}/availability`,
      providesTags: (result, error, doctorId) => [
        { type: 'Doctor', id: `AVAILABILITY-${doctorId}` },
      ],
    }),

    // Update doctor availability
    updateDoctorAvailability: builder.mutation({
      query: ({ doctorId, availability }) => ({
        url: `/doctors/${doctorId}/availability`,
        method: 'PUT',
        body: { availability },
      }),
      invalidatesTags: (result, error, { doctorId }) => [
        { type: 'Doctor', id: doctorId },
        { type: 'Doctor', id: `AVAILABILITY-${doctorId}` },
        { type: 'Doctor', id: 'LIST' },
      ],
      async onQueryStarted({ doctorId, availability }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(updateDoctorAvailabilityInStore({ doctorId, availability }));
        } catch (error) {
          // Error handling is done by the component
        }
      },
    }),

    // Get doctors by specialization
    getDoctorsBySpecialization: builder.query({
      query: (specialization) => `/doctors/specialization/${specialization}`,
      providesTags: (result, error, specialization) => [
        { type: 'Doctor', id: `SPECIALIZATION-${specialization}` },
      ],
    }),

    // Get active doctors
    getActiveDoctors: builder.query({
      query: () => '/doctors/active',
      providesTags: [{ type: 'Doctor', id: 'ACTIVE' }],
    }),

    // Get doctor statistics
    getDoctorStats: builder.query({
      query: () => '/doctors/stats',
      providesTags: [{ type: 'Doctor', id: 'STATS' }],
    }),

    // Toggle doctor active status
    toggleDoctorStatus: builder.mutation({
      query: ({ doctorId, isActive }) => ({
        url: `/doctors/${doctorId}/status`,
        method: 'PUT',
        body: { isActive },
      }),
      invalidatesTags: (result, error, { doctorId }) => [
        { type: 'Doctor', id: doctorId },
        { type: 'Doctor', id: 'LIST' },
        { type: 'Doctor', id: 'ACTIVE' },
      ],
      async onQueryStarted({ doctorId, isActive }, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          doctorsApi.util.updateQueryData('getDoctors', undefined, (draft) => {
            const doctor = draft.doctors?.find((d) => d._id === doctorId);
            if (doctor) {
              doctor.isActive = isActive;
            }
          })
        );
        
        try {
          const { data } = await queryFulfilled;
          dispatch(updateDoctorInStore(data.doctor));
        } catch (error) {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
    }),

    // Get doctor's schedule for a specific date
    getDoctorSchedule: builder.query({
      query: ({ doctorId, date }) => `/doctors/${doctorId}/schedule?date=${date}`,
      providesTags: (result, error, { doctorId, date }) => [
        { type: 'Doctor', id: `SCHEDULE-${doctorId}-${date}` },
      ],
    }),

    // Update doctor's schedule
    updateDoctorSchedule: builder.mutation({
      query: ({ doctorId, date, schedule }) => ({
        url: `/doctors/${doctorId}/schedule`,
        method: 'PUT',
        body: { date, schedule },
      }),
      invalidatesTags: (result, error, { doctorId, date }) => [
        { type: 'Doctor', id: doctorId },
        { type: 'Doctor', id: `SCHEDULE-${doctorId}-${date}` },
        { type: 'Appointment', id: 'LIST' }, // Invalidate appointments as well
      ],
    }),

    // Get available time slots for a doctor on a specific date
    getAvailableSlots: builder.query({
      query: ({ doctorId, date }) => `/doctors/${doctorId}/available-slots?date=${date}`,
      providesTags: (result, error, { doctorId, date }) => [
        { type: 'Doctor', id: `SLOTS-${doctorId}-${date}` },
      ],
    }),

    // Search doctors
    searchDoctors: builder.query({
      query: (searchTerm) => `/doctors/search?q=${encodeURIComponent(searchTerm)}`,
      providesTags: [{ type: 'Doctor', id: 'SEARCH' }],
    }),

    // Bulk operations
    bulkUpdateDoctors: builder.mutation({
      query: ({ doctorIds, updateData }) => ({
        url: '/doctors/bulk-update',
        method: 'PUT',
        body: { doctorIds, updateData },
      }),
      invalidatesTags: [{ type: 'Doctor', id: 'LIST' }],
    }),

    // Export doctors data
    exportDoctors: builder.mutation({
      query: (filters = {}) => ({
        url: '/doctors/export',
        method: 'POST',
        body: filters,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Import doctors data
    importDoctors: builder.mutation({
      query: (formData) => ({
        url: '/doctors/import',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Doctor', id: 'LIST' }],
    }),
  }),
});

// Export hooks for components to use
export const {
  useGetDoctorsQuery,
  useGetDoctorQuery,
  useCreateDoctorMutation,
  useUpdateDoctorMutation,
  useDeleteDoctorMutation,
  useGetDoctorAvailabilityQuery,
  useUpdateDoctorAvailabilityMutation,
  useGetDoctorsBySpecializationQuery,
  useGetActiveDoctorsQuery,
  useGetDoctorStatsQuery,
  useToggleDoctorStatusMutation,
  useGetDoctorScheduleQuery,
  useUpdateDoctorScheduleMutation,
  useGetAvailableSlotsQuery,
  useSearchDoctorsQuery,
  useBulkUpdateDoctorsMutation,
  useExportDoctorsMutation,
  useImportDoctorsMutation,
  useLazyGetDoctorsQuery,
  useLazySearchDoctorsQuery,
  useLazyGetAvailableSlotsQuery,
} = doctorsApi;

// Export endpoints for direct access if needed
export const {
  getDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorAvailability,
  updateDoctorAvailability,
  getDoctorsBySpecialization,
  getActiveDoctors,
  getDoctorStats,
  toggleDoctorStatus,
  getDoctorSchedule,
  updateDoctorSchedule,
  getAvailableSlots,
  searchDoctors,
  bulkUpdateDoctors,
  exportDoctors,
  importDoctors,
} = doctorsApi.endpoints;