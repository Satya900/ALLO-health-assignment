import { baseApi } from "./baseApi";
import {
  setQueues,
  addToQueue as addToQueueInStore,
  updateQueueItem as updateQueueItemInStore,
  removeFromQueue as removeFromQueueInStore,
  setQueueLoading,
  setQueueError,
  updateQueueStatus as updateQueueStatusInStore,
  updateQueuePriority as updateQueuePriorityInStore,
  reorderQueue as reorderQueueInStore,
} from "../slices/queueSlice";

// Queue API endpoints
export const queueApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all queue items with filtering
    getQueue: builder.query({
      query: ({
        doctorId = "",
        status = "",
        priority = "",
        date = "",
      } = {}) => {
        const params = new URLSearchParams();

        if (doctorId) params.append("doctorId", doctorId);
        if (status) params.append("status", status);
        if (priority) params.append("priority", priority);
        if (date) params.append("date", date);

        return `/queue?${params.toString()}`;
      },
      providesTags: (result) =>
        result?.queue
          ? [
              ...result.queue.map(({ _id }) => ({ type: "Queue", id: _id })),
              { type: "Queue", id: "LIST" },
            ]
          : [{ type: "Queue", id: "LIST" }],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        dispatch(setQueueLoading(true));
        try {
          const { data } = await queryFulfilled;
          dispatch(setQueues(data.queue || []));
        } catch (error) {
          dispatch(
            setQueueError(error.error?.data?.message || "Failed to fetch queue")
          );
        }
      },
    }),

    // Get single queue item by ID
    getQueueItem: builder.query({
      query: (id) => `/queue/${id}`,
      providesTags: (result, error, id) => [{ type: "Queue", id }],
    }),

    // Add patient to queue
    addToQueue: builder.mutation({
      query: (queueData) => ({
        url: "/queue",
        method: "POST",
        body: queueData,
      }),
      invalidatesTags: [{ type: "Queue", id: "LIST" }],
      async onQueryStarted(queueData, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(addToQueueInStore(data.queueItem));
        } catch (error) {
          // Error handling is done by the component
        }
      },
    }),

    // Update queue item
    updateQueueItem: builder.mutation({
      query: ({ id, ...queueData }) => ({
        url: `/queue/${id}`,
        method: "PUT",
        body: queueData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Queue", id },
        { type: "Queue", id: "LIST" },
      ],
      async onQueryStarted({ id, ...queueData }, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          queueApi.util.updateQueryData("getQueue", undefined, (draft) => {
            const queueItem = draft.queue?.find((q) => q._id === id);
            if (queueItem) {
              Object.assign(queueItem, queueData);
            }
          })
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(updateQueueItemInStore(data.queueItem));
        } catch (error) {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
    }),

    // Update queue item status
    updateQueueStatus: builder.mutation({
      query: ({ id, status, notes = "" }) => ({
        url: `/queue/${id}/status`,
        method: "PUT",
        body: { status, notes },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Queue", id },
        { type: "Queue", id: "LIST" },
        { type: "Queue", id: "STATS" },
      ],
      async onQueryStarted({ id, status }, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          queueApi.util.updateQueryData("getQueue", undefined, (draft) => {
            const queueItem = draft.queue?.find((q) => q._id === id);
            if (queueItem) {
              queueItem.status = status;
              if (status === "Completed") {
                queueItem.completedAt = new Date().toISOString();
              }
            }
          })
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(updateQueueStatusInStore({ queueId: id, status }));
          dispatch(updateQueueItemInStore(data.queueItem));
        } catch (error) {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
    }),

    // Update queue item priority
    updateQueuePriority: builder.mutation({
      query: ({ id, priority }) => ({
        url: `/queue/${id}/priority`,
        method: "PUT",
        body: { priority },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Queue", id },
        { type: "Queue", id: "LIST" },
        { type: "Queue", id: "STATS" },
      ],
      async onQueryStarted({ id, priority }, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          queueApi.util.updateQueryData("getQueue", undefined, (draft) => {
            const queueItem = draft.queue?.find((q) => q._id === id);
            if (queueItem) {
              queueItem.priority = priority;
            }
          })
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(updateQueuePriorityInStore({ queueId: id, priority }));
          dispatch(updateQueueItemInStore(data.queueItem));
        } catch (error) {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
    }),

    // Remove from queue
    removeFromQueue: builder.mutation({
      query: (id) => ({
        url: `/queue/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Queue", id },
        { type: "Queue", id: "LIST" },
      ],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          queueApi.util.updateQueryData("getQueue", undefined, (draft) => {
            if (draft.queue) {
              draft.queue = draft.queue.filter((q) => q._id !== id);
            }
          })
        );

        try {
          await queryFulfilled;
          dispatch(removeFromQueueInStore(id));
        } catch (error) {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
    }),

    // Reorder queue items
    reorderQueue: builder.mutation({
      query: ({ doctorId, queueOrder }) => ({
        url: `/queue/reorder`,
        method: "PUT",
        body: { doctorId, queueOrder },
      }),
      invalidatesTags: [{ type: "Queue", id: "LIST" }],
      async onQueryStarted(
        { doctorId, queueOrder },
        { dispatch, queryFulfilled }
      ) {
        try {
          await queryFulfilled;
          dispatch(reorderQueueInStore({ doctorId, newOrder: queueOrder }));
        } catch (error) {
          // Error handling is done by the component
        }
      },
    }),

    // Get queue by doctor
    getQueueByDoctor: builder.query({
      query: (doctorId) => `/queue/doctor/${doctorId}`,
      providesTags: (result, error, doctorId) => [
        { type: "Queue", id: `DOCTOR-${doctorId}` },
      ],
    }),

    // Get today's queue
    getTodaysQueue: builder.query({
      query: (doctorId = "") => {
        const today = new Date().toISOString().split("T")[0];
        const params = new URLSearchParams({ date: today });

        if (doctorId) params.append("doctorId", doctorId);

        return `/queue/today?${params.toString()}`;
      },
      providesTags: [{ type: "Queue", id: "TODAY" }],
    }),

    // Get queue statistics
    getQueueStats: builder.query({
      query: ({ doctorId = "", date = "" } = {}) => {
        const params = new URLSearchParams();

        if (doctorId) params.append("doctorId", doctorId);
        if (date) params.append("date", date);

        return `/queue/stats?${params.toString()}`;
      },
      providesTags: [{ type: "Queue", id: "STATS" }],
    }),

    // Get next patient in queue
    getNextPatient: builder.query({
      query: (doctorId) => `/queue/next/${doctorId}`,
      providesTags: (result, error, doctorId) => [
        { type: "Queue", id: `NEXT-${doctorId}` },
      ],
    }),

    // Call next patient
    callNextPatient: builder.mutation({
      query: (doctorId) => ({
        url: `/queue/call-next/${doctorId}`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, doctorId) => [
        { type: "Queue", id: "LIST" },
        { type: "Queue", id: `DOCTOR-${doctorId}` },
        { type: "Queue", id: `NEXT-${doctorId}` },
      ],
    }),

    // Add patient from appointment to queue
    addAppointmentToQueue: builder.mutation({
      query: ({ appointmentId, priority = "Normal" }) => ({
        url: "/queue/from-appointment",
        method: "POST",
        body: { appointmentId, priority },
      }),
      invalidatesTags: [
        { type: "Queue", id: "LIST" },
        { type: "Appointment", id: "LIST" },
      ],
    }),

    // Bulk queue operations
    bulkUpdateQueueStatus: builder.mutation({
      query: ({ queueIds, status, notes = "" }) => ({
        url: "/queue/bulk-status",
        method: "PUT",
        body: { queueIds, status, notes },
      }),
      invalidatesTags: [{ type: "Queue", id: "LIST" }],
    }),

    bulkUpdateQueuePriority: builder.mutation({
      query: ({ queueIds, priority }) => ({
        url: "/queue/bulk-priority",
        method: "PUT",
        body: { queueIds, priority },
      }),
      invalidatesTags: [{ type: "Queue", id: "LIST" }],
    }),

    bulkRemoveFromQueue: builder.mutation({
      query: (queueIds) => ({
        url: "/queue/bulk-remove",
        method: "DELETE",
        body: { queueIds },
      }),
      invalidatesTags: [{ type: "Queue", id: "LIST" }],
    }),

    // Get queue history
    getQueueHistory: builder.query({
      query: ({
        doctorId = "",
        startDate = "",
        endDate = "",
        limit = 50,
      } = {}) => {
        const params = new URLSearchParams({ limit: limit.toString() });

        if (doctorId) params.append("doctorId", doctorId);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        return `/queue/history?${params.toString()}`;
      },
      providesTags: [{ type: "Queue", id: "HISTORY" }],
    }),

    // Export queue data
    exportQueue: builder.mutation({
      query: (filters = {}) => ({
        url: "/queue/export",
        method: "POST",
        body: filters,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Real-time queue updates (WebSocket simulation)
    subscribeToQueueUpdates: builder.query({
      query: (doctorId) => `/queue/subscribe/${doctorId}`,
      providesTags: (result, error, doctorId) => [
        { type: "Queue", id: `SUBSCRIBE-${doctorId}` },
      ],
      // This would typically be handled by WebSocket in a real implementation
      async onCacheEntryAdded(
        doctorId,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        // WebSocket connection logic would go here
        // For now, we'll use polling as a fallback
        try {
          await cacheDataLoaded;

          // Simulate real-time updates with polling
          const interval = setInterval(() => {
            // This would trigger a refetch of queue data
            // In a real implementation, this would be WebSocket events
          }, 30000); // Poll every 30 seconds

          await cacheEntryRemoved;
          clearInterval(interval);
        } catch (error) {
          // Handle connection errors
        }
      },
    }),
  }),
});

// Export hooks for components to use
export const {
  useGetQueueQuery,
  useGetQueueItemQuery,
  useAddToQueueMutation,
  useUpdateQueueItemMutation,
  useUpdateQueueStatusMutation,
  useUpdateQueuePriorityMutation,
  useRemoveFromQueueMutation,
  useReorderQueueMutation,
  useGetQueueByDoctorQuery,
  useGetTodaysQueueQuery,
  useGetQueueStatsQuery,
  useGetNextPatientQuery,
  useCallNextPatientMutation,
  useAddAppointmentToQueueMutation,
  useBulkUpdateQueueStatusMutation,
  useBulkUpdateQueuePriorityMutation,
  useBulkRemoveFromQueueMutation,
  useGetQueueHistoryQuery,
  useExportQueueMutation,
  useSubscribeToQueueUpdatesQuery,
  useLazyGetQueueQuery,
  useLazyGetNextPatientQuery,
} = queueApi;

// Export endpoints for direct access if needed
export const {
  getQueue,
  getQueueItem,
  addToQueue,
  updateQueueItem,
  updateQueueStatus,
  updateQueuePriority,
  removeFromQueue,
  reorderQueue,
  getQueueByDoctor,
  getTodaysQueue,
  getQueueStats,
  getNextPatient,
  callNextPatient,
  addAppointmentToQueue,
  bulkUpdateQueueStatus,
  bulkUpdateQueuePriority,
  bulkRemoveFromQueue,
  getQueueHistory,
  exportQueue,
  subscribeToQueueUpdates,
} = queueApi.endpoints;
