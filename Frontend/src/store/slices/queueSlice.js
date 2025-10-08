import { createSlice, createSelector } from '@reduxjs/toolkit';
import { QUEUE_STATUS, QUEUE_PRIORITY } from '../../utils/constants';

const initialState = {
  queues: [], // Array of queue items
  selectedQueue: null,
  loading: false,
  error: null,
  filters: {
    doctorId: '',
    status: '',
    priority: '',
  },
};

const queueSlice = createSlice({
  name: 'queue',
  initialState,
  reducers: {
    setQueueLoading: (state, action) => {
      state.loading = action.payload;
    },
    setQueueError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setQueues: (state, action) => {
      state.queues = action.payload;
      state.loading = false;
      state.error = null;
    },
    addToQueue: (state, action) => {
      state.queues.push(action.payload);
    },
    updateQueueItem: (state, action) => {
      const index = state.queues.findIndex(q => q._id === action.payload._id);
      if (index !== -1) {
        state.queues[index] = action.payload;
      }
      if (state.selectedQueue?._id === action.payload._id) {
        state.selectedQueue = action.payload;
      }
    },
    removeFromQueue: (state, action) => {
      state.queues = state.queues.filter(q => q._id !== action.payload);
      if (state.selectedQueue?._id === action.payload) {
        state.selectedQueue = null;
      }
    },
    setSelectedQueue: (state, action) => {
      state.selectedQueue = action.payload;
    },
    setQueueFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    updateQueueStatus: (state, action) => {
      const { queueId, status } = action.payload;
      const queueItem = state.queues.find(q => q._id === queueId);
      if (queueItem) {
        queueItem.status = status;
        if (status === QUEUE_STATUS.COMPLETED) {
          queueItem.completedAt = new Date().toISOString();
        }
      }
      if (state.selectedQueue?._id === queueId) {
        state.selectedQueue.status = status;
        if (status === QUEUE_STATUS.COMPLETED) {
          state.selectedQueue.completedAt = new Date().toISOString();
        }
      }
    },
    updateQueuePriority: (state, action) => {
      const { queueId, priority } = action.payload;
      const queueItem = state.queues.find(q => q._id === queueId);
      if (queueItem) {
        queueItem.priority = priority;
      }
      if (state.selectedQueue?._id === queueId) {
        state.selectedQueue.priority = priority;
      }
    },
    reorderQueue: (state, action) => {
      const { doctorId, newOrder } = action.payload;
      // Update queue numbers for a specific doctor
      state.queues = state.queues.map(queue => {
        if (queue.doctorId === doctorId) {
          const newPosition = newOrder.findIndex(id => id === queue._id);
          if (newPosition !== -1) {
            return { ...queue, queueNumber: newPosition + 1 };
          }
        }
        return queue;
      });
    },
    clearQueueError: (state) => {
      state.error = null;
    },
    resetQueueState: () => initialState,
  },
});

export const {
  setQueueLoading,
  setQueueError,
  setQueues,
  addToQueue,
  updateQueueItem,
  removeFromQueue,
  setSelectedQueue,
  setQueueFilters,
  updateQueueStatus,
  updateQueuePriority,
  reorderQueue,
  clearQueueError,
  resetQueueState,
} = queueSlice.actions;

// Basic selectors
export const selectQueues = (state) => state.queue.queues;
export const selectSelectedQueue = (state) => state.queue.selectedQueue;
export const selectQueueLoading = (state) => state.queue.loading;
export const selectQueueError = (state) => state.queue.error;
export const selectQueueFilters = (state) => state.queue.filters;

// Memoized selectors
export const selectFilteredQueues = createSelector(
  [selectQueues, selectQueueFilters],
  (queues, filters) => {
    return queues.filter(queue => {
      // Handle both doctorId field and populated doctor object
      const queueDoctorId = queue.doctorId || queue.doctor?._id || queue.doctor;
      const matchesDoctor = !filters.doctorId || queueDoctorId === filters.doctorId;
      const matchesStatus = !filters.status || queue.status === filters.status;
      const matchesPriority = !filters.priority || queue.priority === filters.priority;
      
      return matchesDoctor && matchesStatus && matchesPriority;
    });
  }
);

export const selectQueueByDoctor = createSelector(
  [selectQueues],
  (queues) => {
    return queues.reduce((acc, queue) => {
      // Handle both doctorId field and populated doctor object
      const doctorId = queue.doctorId || queue.doctor?._id || queue.doctor;
      if (doctorId) {
        if (!acc[doctorId]) {
          acc[doctorId] = [];
        }
        acc[doctorId].push(queue);
      }
      return acc;
    }, {});
  }
);

export const selectActiveQueue = createSelector(
  [selectQueues],
  (queues) => {
    return queues.filter(queue => 
      queue.status === QUEUE_STATUS.WAITING || queue.status === QUEUE_STATUS.WITH_DOCTOR
    );
  }
);

export const selectWaitingQueue = createSelector(
  [selectQueues],
  (queues) => {
    return queues.filter(queue => queue.status === QUEUE_STATUS.WAITING);
  }
);

export const selectQueueStats = createSelector(
  [selectQueues],
  (queues) => {
    const stats = {
      total: queues.length,
      waiting: 0,
      withDoctor: 0,
      completed: 0,
      urgent: 0,
    };
    
    queues.forEach(queue => {
      switch (queue.status) {
        case QUEUE_STATUS.WAITING:
          stats.waiting++;
          break;
        case QUEUE_STATUS.WITH_DOCTOR:
          stats.withDoctor++;
          break;
        case QUEUE_STATUS.COMPLETED:
          stats.completed++;
          break;
      }
      
      if (queue.priority === QUEUE_PRIORITY.URGENT) {
        stats.urgent++;
      }
    });
    
    return stats;
  }
);

export default queueSlice.reducer;