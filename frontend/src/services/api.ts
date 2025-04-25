import axios from "axios";
import { clearCredentialsAction, dispatchAction } from "../store/storeUtils";

const API_URL = "http://localhost:5001/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // This ensures cookies are sent with requests
});

// Request interceptor for adding the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Only try to refresh token if it's a 401 error and we haven't tried refreshing already
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token using our refreshToken API
        const response = await axios.post(
          `${API_URL}/auth/refresh-token`,
          {}, // Empty body as the refresh token is in the cookies
          { withCredentials: true } // Ensure cookies are sent
        );

        const { accessToken } = response.data.data;

        // Update the token in localStorage and headers
        localStorage.setItem("accessToken", accessToken);

        // Update auth header for future requests
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        // Update auth header for the current request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Retry the original request with the new token
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, log out the user
        console.error("Failed to refresh token:", refreshError);
        dispatchAction(clearCredentialsAction());

        // Redirect to login
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
