import axios from 'axios';

axios.interceptors.request.use(
    (config) => {
        config.withCredentials = true;
        return config;
    },
    (error) => Promise.reject(error)
);

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await axios.post('http://localhost:3000/auth/refresh', {}, { withCredentials: true });
                return axios(originalRequest);
            } catch (refreshError) {
                console.error('Не удалось обновить токен:', refreshError);
                await axios.post('http://localhost:3000/auth/logout', {}, { withCredentials: true });
            }
        }

        return Promise.reject(error);
    }
);