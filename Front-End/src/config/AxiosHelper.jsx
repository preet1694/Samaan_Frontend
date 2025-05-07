import axios from "axios";
import { jwtDecode } from "jwt-decode";

// export const baseURL = "http://localhost:8080/api";
export const baseURL = import.meta.env.VITE_BACKEND_URL;
const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

const emitLogoutEvent = () => {
  const event = new CustomEvent("logout");
  window.dispatchEvent(event);
};

const isTokenExpired = () => {
  const token = localStorage.getItem("jwtToken");
  if (!token) return true;

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  } catch {
    return true;
  }
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");

    if (token) {
      if (isTokenExpired()) {
        localStorage.clear();
        emitLogoutEvent();
        return Promise.reject("Token expired. Please log in again.");
      }
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      emitLogoutEvent();
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
