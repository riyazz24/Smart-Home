import axios from "axios";
import { getDeviceId } from "./DeviceId";
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
    withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
    config.headers['X-DeviceId'] = getDeviceId();
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
        config.headers['X-SessionId'] = sessionId;
    }
    const agentId = localStorage.getItem('agentId');
    if (agentId) {
        config.headers['X-HomeId'] = agentId;
        config.headers['X-AgentId'] = agentId;
    }
    return config;
});

let isRefreshing = false;
let pendingQueue = [];

const resolvePendingQueue = (error) => {
    pendingQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve()));
    pendingQueue = [];
};

const logoutAndRedirect = () => {
    localStorage.removeItem('sessionId');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('agentId');
    localStorage.removeItem('name');
    if (window.location.pathname !== '/login') {
        window.location.href = '/login';
    }
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const isAuthRoute = originalRequest?.url?.includes('/auth/login') || originalRequest?.url?.includes('/auth/rotate/refresh/token');

        if (status !== 401 || isAuthRoute || originalRequest._retry) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            // A refresh is already in flight - queue this request until it settles.
            return new Promise((resolve, reject) => {
                pendingQueue.push({ resolve, reject });
            }).then(() => axiosInstance(originalRequest));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            await axiosInstance.post('/auth/rotate/refresh/token');
            resolvePendingQueue(null);
            return axiosInstance(originalRequest);
        } catch (refreshError) {
            resolvePendingQueue(refreshError);
            logoutAndRedirect();
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default axiosInstance;