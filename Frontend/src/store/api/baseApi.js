import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { STORAGE_KEYS } from "../../utils/constants";

const getBaseUrl = () => {
  // In development, use the proxy path
  if (import.meta.env.DEV) {
    return "/api";
  }
  // In production, use the full API URL
  return import.meta.env.VITE_API_URL || "http://localhost:8000/api";
};

// Base query with authentication headers
const baseQuery = fetchBaseQuery({
  baseUrl: getBaseUrl(),
  prepareHeaders: (headers, { getState }) => {
    // Get token from Redux state or localStorage
    const token =
      getState()?.auth?.token || localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    headers.set("content-type", "application/json");
    return headers;
  },
});

// Base query with automatic token refresh and error handling
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Handle 401 unauthorized responses
  if (result.error && result.error.status === 401) {
    // Clear auth state and redirect to login
    api.dispatch({ type: "auth/logout" });
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }

  return result;
};

// Create the base API slice
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "Patient",
    "Doctor",
    "Appointment",
    "Queue",
    "Dashboard",
    "User",
  ],
  endpoints: () => ({}),
});

export default baseApi;
