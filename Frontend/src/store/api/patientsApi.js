import { baseApi } from './baseApi';
import {
  setPatients,
  addPatient,
  updatePatient as updatePatientInStore,
  removePatient,
  setPatientsLoading,
  setPatientsError,
  setPagination,
} from '../slices/patientsSlice';

// Patients API endpoints
export const patientsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all patients with pagination and search
    getPatients: builder.query({
      query: ({ page = 1, limit = 10, search = '', gender = '', ageRange = '' } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        
        if (search) params.append('search', search);
        if (gender) params.append('gender', gender);
        if (ageRange) params.append('ageRange', ageRange);
        
        return `/patients?${params.toString()}`;
      },
      providesTags: (result) =>
        result?.patients
          ? [
              ...result.patients.map(({ _id }) => ({ type: 'Patient', id: _id })),
              { type: 'Patient', id: 'LIST' },
            ]
          : [{ type: 'Patient', id: 'LIST' }],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        dispatch(setPatientsLoading(true));
        try {
          const { data } = await queryFulfilled;
          dispatch(setPatients(data.patients || []));
          dispatch(setPagination({
            page: data.page || 1,
            limit: data.limit || 10,
            total: data.total || 0,
            totalPages: data.totalPages || 0,
          }));
        } catch (error) {
          dispatch(setPatientsError(error.error?.data?.message || 'Failed to fetch patients'));
        }
      },
    }),

    // Get single patient by ID
    getPatient: builder.query({
      query: (id) => `/patients/${id}`,
      providesTags: (result, error, id) => [{ type: 'Patient', id }],
    }),

    // Create new patient
    createPatient: builder.mutation({
      query: (patientData) => ({
        url: '/patients',
        method: 'POST',
        body: patientData,
      }),
      invalidatesTags: [{ type: 'Patient', id: 'LIST' }],
      async onQueryStarted(patientData, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(addPatient(data.patient));
        } catch (error) {
          // Error handling is done by the component
        }
      },
      // Optimistic update
      async onQueryStarted(patientData, { dispatch, queryFulfilled }) {
        const tempId = `temp-${Date.now()}`;
        const optimisticPatient = {
          _id: tempId,
          ...patientData,
          createdAt: new Date().toISOString(),
        };
        
        // Add optimistic update
        dispatch(addPatient(optimisticPatient));
        
        try {
          const { data } = await queryFulfilled;
          // Replace optimistic update with real data
          dispatch(removePatient(tempId));
          dispatch(addPatient(data.patient));
        } catch (error) {
          // Remove optimistic update on error
          dispatch(removePatient(tempId));
        }
      },
    }),

    // Update existing patient
    updatePatient: builder.mutation({
      query: ({ id, ...patientData }) => ({
        url: `/patients/${id}`,
        method: 'PUT',
        body: patientData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Patient', id },
        { type: 'Patient', id: 'LIST' },
      ],
      async onQueryStarted({ id, ...patientData }, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          patientsApi.util.updateQueryData('getPatients', undefined, (draft) => {
            const patient = draft.patients?.find((p) => p._id === id);
            if (patient) {
              Object.assign(patient, patientData);
            }
          })
        );
        
        try {
          const { data } = await queryFulfilled;
          dispatch(updatePatientInStore(data.patient));
        } catch (error) {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
    }),

    // Delete patient
    deletePatient: builder.mutation({
      query: (id) => ({
        url: `/patients/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Patient', id },
        { type: 'Patient', id: 'LIST' },
      ],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          patientsApi.util.updateQueryData('getPatients', undefined, (draft) => {
            if (draft.patients) {
              draft.patients = draft.patients.filter((p) => p._id !== id);
            }
          })
        );
        
        try {
          await queryFulfilled;
          dispatch(removePatient(id));
        } catch (error) {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
    }),

    // Search patients
    searchPatients: builder.query({
      query: (searchTerm) => `/patients/search?q=${encodeURIComponent(searchTerm)}`,
      providesTags: [{ type: 'Patient', id: 'SEARCH' }],
    }),

    // Get patient statistics
    getPatientStats: builder.query({
      query: () => '/patients/stats',
      providesTags: [{ type: 'Patient', id: 'STATS' }],
    }),

    // Get patients by doctor (for appointments)
    getPatientsByDoctor: builder.query({
      query: (doctorId) => `/patients/by-doctor/${doctorId}`,
      providesTags: (result, error, doctorId) => [
        { type: 'Patient', id: `DOCTOR-${doctorId}` },
      ],
    }),

    // Bulk operations
    bulkUpdatePatients: builder.mutation({
      query: ({ patientIds, updateData }) => ({
        url: '/patients/bulk-update',
        method: 'PUT',
        body: { patientIds, updateData },
      }),
      invalidatesTags: [{ type: 'Patient', id: 'LIST' }],
    }),

    bulkDeletePatients: builder.mutation({
      query: (patientIds) => ({
        url: '/patients/bulk-delete',
        method: 'DELETE',
        body: { patientIds },
      }),
      invalidatesTags: [{ type: 'Patient', id: 'LIST' }],
      async onQueryStarted(patientIds, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          patientsApi.util.updateQueryData('getPatients', undefined, (draft) => {
            if (draft.patients) {
              draft.patients = draft.patients.filter((p) => !patientIds.includes(p._id));
            }
          })
        );
        
        try {
          await queryFulfilled;
          patientIds.forEach(id => dispatch(removePatient(id)));
        } catch (error) {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
    }),

    // Export patients data
    exportPatients: builder.mutation({
      query: (filters = {}) => ({
        url: '/patients/export',
        method: 'POST',
        body: filters,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Import patients data
    importPatients: builder.mutation({
      query: (formData) => ({
        url: '/patients/import',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Patient', id: 'LIST' }],
    }),
  }),
});

// Export hooks for components to use
export const {
  useGetPatientsQuery,
  useGetPatientQuery,
  useCreatePatientMutation,
  useUpdatePatientMutation,
  useDeletePatientMutation,
  useSearchPatientsQuery,
  useGetPatientStatsQuery,
  useGetPatientsByDoctorQuery,
  useBulkUpdatePatientsMutation,
  useBulkDeletePatientsMutation,
  useExportPatientsMutation,
  useImportPatientsMutation,
  useLazyGetPatientsQuery,
  useLazySearchPatientsQuery,
} = patientsApi;

// Export endpoints for direct access if needed
export const {
  getPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
  searchPatients,
  getPatientStats,
  getPatientsByDoctor,
  bulkUpdatePatients,
  bulkDeletePatients,
  exportPatients,
  importPatients,
} = patientsApi.endpoints;