import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const chatApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL_CHAT,
  withCredentials: true,
});

export default api;
export { chatApi };
