import axios from "axios";
import { jwtDecode } from "jwt-decode";

const navigateToLogin = () => {
  window.location.href = "/login";
};

// export const baseURL = "http://localhost:8080/api";
export const baseURL = import.meta.env.VITE_BACKEND_URL;
const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

const isTokenExpired = () => {
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    return true;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTimeInKolkata = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });
    const currentTime = new Date(currentTimeInKolkata).getTime() / 1000;

    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error("Error decoding token", error);
    return true;
  }
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");

    if (token) {
      if (isTokenExpired()) {
        localStorage.clear();
        navigateToLogin();
        return Promise.reject("Token expired. Please log in again.");
      }

      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      navigateToLogin();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
