import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

// Import base API
import { baseApi } from './api/baseApi';

// Import slices
import authReducer from './slices/authSlice';
import patientsReducer from './slices/patientsSlice';
import doctorsReducer from './slices/doctorsSlice';
import appointmentsReducer from './slices/appointmentsSlice';
import queueReducer from './slices/queueSlice';
import dashboardReducer from './slices/dashboardSlice';
import adminReducer from './slices/adminSlice';

// Configure the store
export const store = configureStore({
  reducer: {
    // RTK Query API slice
    [baseApi.reducerPath]: baseApi.reducer,
    
    // Feature slices
    auth: authReducer,
    patients: patientsReducer,
    doctors: doctorsReducer,
    appointments: appointmentsReducer,
    queue: queueReducer,
    dashboard: dashboardReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          // Ignore RTK Query actions
          'api/executeQuery/pending',
          'api/executeQuery/fulfilled',
          'api/executeQuery/rejected',
          'api/executeMutation/pending',
          'api/executeMutation/fulfilled',
          'api/executeMutation/rejected',
        ],
      },
    }).concat(baseApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Setup listeners for RTK Query
setupListeners(store.dispatch);

// Export types for TypeScript (if needed later)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

export default store;